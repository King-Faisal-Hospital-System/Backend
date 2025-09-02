import Stock from "../models/stock.model.js";
import Supplier from "../models/supplier.model.js";

import generateExpiredStockReportTemplate from "../templates/expiredStockReport.template.js";
import generateInventoryReportTemplate from "../templates/inventoryReport.template.js";
import generateSupplierReportTemplate from "../templates/supplierReport.template.js";
import {convertHtmlToPdfBuffer} from "../utils/file.conversion.utils.js";
import uploadReportToCloudinary from "./cloudinary.services.js"

export const generateStockExpirationReport = async () => {
    const now = new Date();
    try {
        const expiredStocks = await Stock.find({ expiry_date: { $lt: now } });
        const template = await generateExpiredStockReportTemplate(expiredStocks);
        const pdf = await convertHtmlToPdfBuffer(template);
        // const url = await uploadReportToCloudinary(pdf)
        const url = await uploadReportLocally(pdf, "expired_stock_report");
        return url
    } catch (error) {
        throw new Error(error)
    }
};

export const generateSupplierReport = async (supplierId) => {
    try {
        const supplier = await Supplier.findById(supplierId);
        const supplierStocks = await Stock.find({ supplier : supplierId });
        const template = await generateSupplierReportTemplate(supplier, supplierStocks);
        const pdf = await convertHtmlToPdfBuffer(template);
        const url = await uploadReportLocally(pdf, "supplier_report");
        // const url = await uploadReportToCloudinary(pdf)
        return url
    } catch (error) {
        throw new Error(error)
    }
};

export const generateInventoryReport = async () => {
    try {
        const stocks = await Stock.find();
        const template = await generateInventoryReportTemplate(stocks);
        const pdf = await convertHtmlToPdfBuffer(template);
        const url = await uploadReportLocally(pdf, "inventory_report");
        // const url = await uploadReportToCloudinary(pdf)
        return url
    } catch (error) {
        throw new Error(error)
    }
}