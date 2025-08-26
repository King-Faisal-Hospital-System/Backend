import express from "express";
import { 
    createPaymentController, 
    getAllPaymentsController, 
    updatePaymentController, 
    deletePaymentController 
} from "../controllers/payment.controllers.js";

const router = express.Router();

// Payment routes
router.post("/", createPaymentController);
router.get("/", getAllPaymentsController);
router.put("/:id", updatePaymentController);
router.delete("/:id", deletePaymentController);

export default router;
