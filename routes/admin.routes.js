import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { createSupplier, deleteSupplier, getSuppliers } from "../controllers/supplier.controllers";

const adminRouter = express.Router();

adminRouter.post("/", authorize, authorizeRole("ADMIN"), createSupplier);
adminRouter.delete("/:supplierId", authorize, authorizeRole("ADMIN"), deleteSupplier);
adminRouter.get("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getSuppliers)

export default adminRouter