import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { create } from "../controller/menu.controller";
const userRouter = new Router<DefaultState, Context>({ prefix: "/menu" });
userRouter.post("/add", create);
export default userRouter;
