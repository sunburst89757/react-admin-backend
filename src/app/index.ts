import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import { responseFormat } from "../middleware/response.middleware";
import { useRoutes } from "../router";
import "../utils/jwt";
const app = new Koa();
app.use(bodyParser());
app.use(cors());
// 添加ctx.onSuccess 和 onError
app.use(responseFormat);
// 配置所有路由中间件
useRoutes(app);

export { app };
