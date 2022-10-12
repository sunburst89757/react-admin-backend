import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { create } from "../controller/user.controller";
import { encryptPassword, verifyUser } from "../middleware/auth.middleware";
const userRouter = new Router<DefaultState, Context>({ prefix: "/user" });
userRouter.post("/register", verifyUser, encryptPassword, create);
export default userRouter;
