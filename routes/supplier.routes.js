import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { createSupplier, deleteSupplier, getSupplier, getSuppliers } from "../controllers/supplier.controllers.js";

const supplierRouter = express.Router();

supplierRouter.post("/", authorize, authorizeRole("ADMIN"), createSupplier);
supplierRouter.delete("/:supplierId", authorize, authorizeRole("ADMIN"), deleteSupplier);
supplierRouter.get("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getSuppliers);
supplierRouter.get("/:supplierId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getSupplier)

export default supplierRouter
