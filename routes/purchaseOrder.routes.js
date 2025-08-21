import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { confirmPurchaseOrder, receiveRequestedQuantities, rejectPurchaseOrder } from "../controllers/purchaseOrder.controllers.js";

const purchaseOrderRouter = express.Router();

purchaseOrderRouter.get("/", authorize, getMyPurchaseOrders)

purchaseOrderRouter.post("/:orderId/accept", authorize, authorizeRole("SUPPLIER"), confirmPurchaseOrder);
purchaseOrderRouter.post("/:orderId/reject", authorize, authorizeRole("SUPPLIER"), rejectPurchaseOrder);
purchaseOrderRouter.post("/:orderId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), receiveRequestedQuantities);

export default purchaseOrderRouter