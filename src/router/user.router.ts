import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { create } from "../controller/user.controller";
const userRouter = new Router<DefaultState, Context>({ prefix: "/user" });
userRouter.get("/login", create);
export { userRouter };
