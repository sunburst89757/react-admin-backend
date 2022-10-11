import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { responseFormat } from "../middleware/response.middleware";
import { userRouter } from "../router/user.router";
const app = new Koa();
app.use(bodyParser());
// 添加ctx.onSuccess 和 onError
app.use(responseFormat);
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

export { app };
