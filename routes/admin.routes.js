import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { getAllUsers, verifyUser } from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.get("/users", authorize, getAllUsers); 
adminRouter.patch("/verify-user/:userId", authorize, verifyUser); 

export default adminRouter;
