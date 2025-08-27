import express from "express";
import { login, logout, register,getMe } from "../controllers/auth.controllers.js";
import { authorize } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authorize, getMe);
authRouter.post("/logout", authorize, logout);

export default authRouter