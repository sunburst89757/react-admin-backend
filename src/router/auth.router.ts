import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { testAuth } from "../controller/test.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const authRouter = new Router<DefaultState, Context>({ prefix: "/auth" });
authRouter.get("/menu", verifyAuth, testAuth);
export default authRouter;
