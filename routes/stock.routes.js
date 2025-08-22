import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createStock, changeProductStockName, getAllStocks, getStockById, requestSupplierForStockRefill, receiveOrderToStock } from "../controllers/stock.controllers.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const stockRouter = express.Router();

stockRouter.post("/", authorize, authorizeRole("STOCK_MANAGER", "ADMIN"), createStock);
stockRouter.get("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getAllStocks);
stockRouter.get("/:stockId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getStockById);
stockRouter.patch("/:stockId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), changeProductStockName);

stockRouter.post("/:stockId/request", authorize, authorizeRole("STOCK_MANAGER"), requestSupplierForStockRefill);
stockRouter.post("/:stockId/receive", authorize, authorizeRole("STOCK_MANAGER"), receiveOrderToStock);

export default stockRouter