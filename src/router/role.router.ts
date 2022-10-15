import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { create } from "../controller/role.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const userRouter = new Router<DefaultState, Context>({ prefix: "/role" });
userRouter.post("/addRole", verifyAuth, create);
export default userRouter;
