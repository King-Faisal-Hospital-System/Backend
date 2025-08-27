import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { connectToDatabase } from "./config/db.config.js";
import cookieParser from "cookie-parser";
import stockRouter from "./routes/stock.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import userRouter from "./routes/user.routes.js";
import purchaseOrderRouter from "./routes/purchaseOrder.routes.js";
import invoiceRouter from "./routes/invoice.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import { configDotenv } from "dotenv";
import reportRouter from "./routes/report.routes.js";
import adminRouter from "./routes/admin.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import settingsRouter from "./routes/settings.routes.js";

configDotenv()

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin : process.env.FRONTEND_URL || "http://localhost:3000",
    credentials : true
}));
app.use(cookieParser())
app.use(express.json());

// Serve static files from reports directory
app.use('/reports', express.static('reports'));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter)
app.use("/api/stocks", stockRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/orders", purchaseOrderRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reports", reportRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/settings", settingsRouter);


app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully and connected to MongoDB!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", db: "connected" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    connectToDatabase()
})