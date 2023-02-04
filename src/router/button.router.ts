import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { addButton, getButtonList } from "../controller/button.controller";

import { verifyAuth } from "../middleware/auth.middleware";
// 这功能没做完 用户角色对应的权限没设计完整 还有创建新用户自动添加的权限逻辑没添加
const buttonRouter = new Router<DefaultState, Context>({ prefix: "/button" });
buttonRouter.get("/list/:roleId", getButtonList);
buttonRouter.post("/create", addButton);
export default buttonRouter;
