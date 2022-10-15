import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { create, login,logout } from "../controller/user.controller";
import {
  encryptPassword,
  verifyLogin,
  verifyUser,
} from "../middleware/auth.middleware";
const userRouter = new Router<DefaultState, Context>({ prefix: "/user" });
userRouter.post("/register", verifyUser, encryptPassword, create);
userRouter.post("/login", verifyLogin, login);
userRouter.get("/logout",logout);
export default userRouter;
