import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { create } from "../controller/user.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const userRouter = new Router<DefaultState, Context>({ prefix: "/user" });
userRouter.get("/login", verifyAuth, create);
export default userRouter;
