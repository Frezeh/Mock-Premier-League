import { Router } from "express";
import { deleteUser, getUser, login, logout, signUp } from "../controller/userController";

const userRouter = Router();

userRouter.post("/signup", signUp);

userRouter.post("/login", login);

userRouter.get("/logout", logout);

userRouter.get("/:userId", getUser).delete("/:userId", deleteUser);

export = userRouter;
