import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { userRouter } from "../router/user.router";
const app = new Koa();
app.use(bodyParser());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
export { app };
