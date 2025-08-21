import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createStock, requestQuantity } from "../controllers/stock.controllers.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const stockRouter = express.Router();

stockRouter.post("/", authorize, authorizeRole("STOCK_MANAGER", "ADMIN"), createStock);
stockRouter.post("/supply", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), requestQuantity);

export default stockRouter