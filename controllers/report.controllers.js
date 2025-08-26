import Report from "../models/report.model.js";
import { generateInventoryReport, generateStockExpirationReport, generateSupplierReport } from "../services/report.services.js";

export const requestReportGeneration = async (req, res) => {
    const { type } = req.body;
    try {
        const report = new Report({
            type: type,
            name: `${type} - ${new Date().toLocaleDateString()}`,
            status: "PENDING"
        });
        await report.save();

        let url;
        // Generate report 
        if (type === "INVENTORY_REPORT") {
            url = await generateInventoryReport();
        } else if (type === "EXPIRATION_REPORT") {
            url = await generateStockExpirationReport();
        } else {
            throw new Error("Unable to detect type of report");
        }

        
        report.file_url = url;
        report.status = "COMPLETED";
        await report.save();

      
        res.status(200).json({ 
            message: "Report generated successfully", 
            report: report,
            downloadUrl: `http://localhost:5000${url}`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const requestSupplierReport = async (req, res) => {
    const { supplierId } = req.params;
    try {
        const report = new Report({
            type: "SUPPLIER_REPORT",
            name: `SUPPLIER_REPORT - ${new Date().toLocaleDateString()}`,
            status: "PENDING"
        });
        await report.save();

        // Generate supplier report 
        const url = await generateSupplierReport(supplierId);
        
      
        report.file_url = url;
        report.status = "COMPLETED";
        await report.save();

       
        res.status(200).json({ 
            message: "Supplier report generated successfully", 
            report: report,
            downloadUrl: `http://localhost:5000${url}`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find();
        return res.status(200).json({ reports: reports });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getReport = async (req, res) => {
    const { reportId } = req.params;
    try {
        const report = await Report.findById(reportId);
        return res.status(200).json({ report : report })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getReportStats = async (req, res) => {
    try {
        const Stock = (await import("../models/stock.model.js")).default;
        const Invoice = (await import("../models/invoice.model.js")).default;

        // total counts 
        const totalReports = await Report.countDocuments();
        const completedReports = await Report.countDocuments({ status: "COMPLETED" });
        const pendingReports = await Report.countDocuments({ status: "PENDING" });
        const failedReports = await Report.countDocuments({ status: "FAILED" });

        // counts by report type
        const inventoryReports = await Report.countDocuments({ type: "INVENTORY_REPORT" });
        const expirationReports = await Report.countDocuments({ type: "EXPIRATION_REPORT" });
        const supplierReports = await Report.countDocuments({ type: "SUPPLIER_REPORT" });

        // recent reports (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentReports = await Report.countDocuments({ 
            createdAt: { $gte: sevenDaysAgo } 
        });

        //  reports generated today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayReports = await Report.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        //  inventory value 
        const allStocks = await Stock.find();
        const totalInventoryValue = allStocks.reduce((sum, stock) => {
            const received = stock.quantity || 0;
            const issued = stock.issued || 0;
            const balance = received - issued;
            const unitCost = stock.unit_price || 0;
            const totalValue = balance * unitCost;
            return sum + totalValue;
        }, 0);

        // expired loss 
        const now = new Date();
        const expiredStocks = await Stock.find({ expiry_date: { $lt: now } });
        const expiredLoss = expiredStocks.reduce((sum, stock) => {
            const received = stock.quantity || 0;
            const issued = stock.issued || 0;
            const balance = received - issued;
            const unitCost = stock.unit_price || 0;
            const totalValue = balance * unitCost;
            return sum + totalValue;
        }, 0);

        // Calculate monthly revenue (current month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const monthlyInvoices = await Invoice.find({
            createdAt: { $gte: startOfMonth }
        });
        const monthlyRevenue = monthlyInvoices.reduce((sum, invoice) => 
            sum + (invoice.total_amount || 0), 0
        );

        // Calculate previous month for comparison
        const startOfLastMonth = new Date();
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
        startOfLastMonth.setDate(1);
        startOfLastMonth.setHours(0, 0, 0, 0);
        
        const endOfLastMonth = new Date();
        endOfLastMonth.setDate(0);
        endOfLastMonth.setHours(23, 59, 59, 999);
        
        const lastMonthInvoices = await Invoice.find({
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        });
        const lastMonthRevenue = lastMonthInvoices.reduce((sum, invoice) => 
            sum + (invoice.total_amount || 0), 0
        );

        // Calculate percentage changes
        const revenueChange = lastMonthRevenue > 0 ? 
            (((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1) : 0;

        const stats = {
            overview: {
                total: totalReports,
                completed: completedReports,
                pending: pendingReports,
                failed: failedReports,
                successRate: totalReports > 0 ? ((completedReports / totalReports) * 100).toFixed(1) : 0
            },
            byType: {
                inventory: inventoryReports,
                expiration: expirationReports,
                supplier: supplierReports
            },
            activity: {
                today: todayReports,
                lastWeek: recentReports
            },
            financial: {
                monthlyRevenue: monthlyRevenue,
                inventoryValue: totalInventoryValue,
                expiredLoss: expiredLoss,
                revenueChange: revenueChange
            }
        };

        return res.status(200).json({ stats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};