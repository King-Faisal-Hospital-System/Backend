import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { getLoggedInUser, getUser } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/me", authorize, getLoggedInUser);
userRouter.get("/:userId", authorize, getUser);

export default userRouter
