import Stock from "../models/stock.model.js";
import Invoice from "../models/invoice.model.js";
import Report from "../models/report.model.js";

export const getDashboardStats = async (req, res) => {
    try {
       
        const totalProducts = await Stock.countDocuments();

        //  low stock items
        const allStocks = await Stock.find();
        const lowStockItems = allStocks.filter(stock => {
            const received = stock.quantity || 0;
            const issued = stock.issued || 0;
            const balance = received - issued;
            const minStock = stock.minStock || 50;
            return balance < minStock;
        }).length;

        // expiring soon items (within 60 days)
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
        const expiringSoon = await Stock.countDocuments({
            expiry_date: { $lte: sixtyDaysFromNow, $gt: new Date() }
        });

        //  recent activities 
        const recentStocks = await Stock.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('supplier', 'name');

        const recentInvoices = await Invoice.find()
            .sort({ createdAt: -1 })
            .limit(3);

        const recentReports = await Report.find()
            .sort({ createdAt: -1 })
            .limit(2);

        
        const activities = [];

        // stock activities
        recentStocks.forEach((stock, index) => {
            const received = stock.quantity || 0;
            const issued = stock.issued || 0;
            const balance = received - issued;
            
            if (received > issued) {
                activities.push({
                    id: `stock-${stock._id}`,
                    title: stock.name,
                    description: `Received ${received} units from ${stock.supplier?.name || 'Unknown Supplier'}`,
                    code: stock.batch_number || `STK${index + 1}`,
                    time: getTimeAgo(stock.createdAt),
                    type: "in"
                });
            } else if (balance < (stock.minStock || 50)) {
                activities.push({
                    id: `low-${stock._id}`,
                    title: stock.name,
                    description: `Low stock: ${balance} units remaining`,
                    code: stock.batch_number || `STK${index + 1}`,
                    time: getTimeAgo(stock.updatedAt || stock.createdAt),
                    type: "low"
                });
            }
        });

        //  invoice activities
        recentInvoices.forEach((invoice, index) => {
            activities.push({
                id: `invoice-${invoice._id}`,
                title: `Invoice Generated`,
                description: `Invoice for ${invoice.total_value.toLocaleString()} RWF created`,
                code: `INV${invoice._id.toString().slice(-3)}`,
                time: getTimeAgo(invoice.createdAt),
                type: "out"
            });
        });

        // activities 
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        const limitedActivities = activities.slice(0, 6);

        // top products by quantity
        const topProducts = allStocks
            .map(stock => ({
                name: stock.name,
                quantity: stock.quantity || 0,
                issued: stock.issued || 0,
                balance: (stock.quantity || 0) - (stock.issued || 0),
                value: ((stock.quantity || 0) - (stock.issued || 0)) * (stock.unit_price || 0),
                unit_price: stock.unit_price || 0
            }))
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 5);

        const dashboardData = {
            totalProducts,
            lowStockItems,
            expiringSoon,
            activities: limitedActivities,
            topProducts
        };

        return res.status(200).json({ dashboard: dashboardData });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}
