import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { deleteReport, getAllReports, renameReport, requestReportGeneration, requestSupplierReport } from "../controllers/report.controllers.js";

const reportRouter = express.Router();

reportRouter.get("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), getAllReports);
reportRouter.post("/", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), requestReportGeneration);
reportRouter.post("/:supplierId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), requestSupplierReport);

/** Report CRUD */
reportRouter.post("/:reportId", authorize, authorizeRole("ADMIN"), renameReport);
reportRouter.delete("/:reportId", authorize, authorizeRole("ADMIN", "STOCK_MANAGER"), deleteReport)

export default reportRouter