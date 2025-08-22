import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { getPurchaseOrder, getPurchaseOrders } from "../controllers/purchaseOrder.controllers.js";

const purchaseOrderRouter = express.Router();

purchaseOrderRouter.get("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getPurchaseOrders);
purchaseOrderRouter.get("/:orderId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getPurchaseOrder)

export default purchaseOrderRouter