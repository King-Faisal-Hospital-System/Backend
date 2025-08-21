import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { agreeStockSupply, approveStockSupplied, changeStockName, changeStockSupplier, createStock, deleteStock, getStocks, rejectStockSupply } from "../controllers/stock.controllers.js";

const stockRouter = express.Router();

stockRouter.post("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), createStock);
stockRouter.get("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getStocks);
stockRouter.patch("/:stockId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), changeStockName);
stockRouter.patch("/:stockId/supplier", authorize, authorizeRole("STOCK_MANAGER"), changeStockSupplier);
stockRouter.delete("/:stockId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), deleteStock);
stockRouter.post("/:stockId/supply/agree", authorize, authorizeRole("SUPPLIER"), agreeStockSupply);
stockRouter.patch("/:stockId/supply", authorize, authorizeRole("SUPPLIER"), rejectStockSupply);
stockRouter.post("/:stockId/supply/approve", authorize, authorizeRole("STOCK_MANAGER", "ADMIN"), approveStockSupplied)

export default stockRouter