import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { getAllInvoices, getInvoice, createInvoiceController, updateInvoiceController, deleteInvoiceController } from "../controllers/invoice.controllers.js";

const invoiceRouter = express.Router();

invoiceRouter.get("/", authorize, authorizeRole("STOCK_MANAGER", "ADMIN"), getAllInvoices);
invoiceRouter.get("/:invoiceId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getInvoice);
invoiceRouter.post("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), createInvoiceController);
invoiceRouter.put("/:invoiceId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), updateInvoiceController);
invoiceRouter.delete("/:invoiceId", authorize, authorizeRole("ADMIN"), deleteInvoiceController);

export default invoiceRouter