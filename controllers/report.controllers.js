import Report from "../models/report.model.js";
import { generateInventoryReport, generateStockExpirationReport, generateSupplierReport } from "../services/report.services.js";

export const requestReportGeneration = async (req, res) => {
    const { type } = req.body;
    try {
        const report = new Report({
            type: type
        });
        report.name = `${type} - ${new Date(Date.now())}`;
        report.status = "PENDING";
        await report.save();
        res.status(202).json({ message: "Report generation in progress", report: report._id });
        // Enable background report generation
        (async () => {
            try {
                let url;
                // Report generation based on type logic
                if (type === "INVENTORY_REPORT") {
                    const url = await generateInventoryReport();
                    report.file_url = url;
                    await report.save();
                } else if (type === "EXPIRATION_REPORT") {
                    url = await generateStockExpirationReport();
                    report.file_url = url;
                    report.status = "COMPLETED";
                    await report.save();
                } else {
                    throw new Error("Unable to detect type of report")
                };
            } catch (error) {
                report.status = "FAILED";
                await report.save();
                throw new Error(error)
            }
        })();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const requestSupplierReport = async (req, res) => {
    const { supplierId } = req.params;
    try {
        const report = new Report({
            type: "SUPPLIER_REPORT"
        });
        report.name = `SUPPLIER_REPORT - ${new Date(Date.now())}`;
        await report.save();
        res.status(202).json({ message: "Supplier's report generation in progress" });
        (async () => {
            try {
                const url = await generateSupplierReport(supplierId);
                report.file_url = url;
                report.status = "COMPLETED";
                await report.save();
            } catch (error) {
                report.status = "FAILED";
                await report.save();
                throw new Error(error)
            }
        })();
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "Internal server error" })
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
}