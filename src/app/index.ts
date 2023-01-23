import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import { errorHandle } from "../middleware/errorHandle";
import { logger } from "../middleware/logger.middleware";
import { responseFormat } from "../middleware/response.middleware";
import { cleanAllChunks } from "../middleware/timer.middleware";
import { useRoutes } from "../router";
import "../utils/jwt";
const app = new Koa();
app.use(bodyParser());
app.use(cors());
app.use(logger);
// 添加ctx.onSuccess 和 onError
app.use(responseFormat);
app.use(errorHandle);
// 配置所有路由中间件
useRoutes(app);
// 定时删除chunk中间件
app.use(cleanAllChunks);

export { app };
