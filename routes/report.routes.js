import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { getAllReports, requestReportGeneration, requestSupplierReport, getReportStats } from "../controllers/report.controllers.js";

const reportRouter = express.Router();

reportRouter.get("/", getAllReports);
reportRouter.get("/stats", getReportStats);
reportRouter.post("/", requestReportGeneration);
reportRouter.post("/supplier/:supplierId", requestSupplierReport);

export default reportRouter