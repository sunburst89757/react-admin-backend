import { Context, DefaultState } from "koa";
import Router from "koa-router";
import { db } from "../app/dataBase";
import { create, getMenuList } from "../controller/menu.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const menuRouter = new Router<DefaultState, Context>({ prefix: "/menu" });
menuRouter.post("/add", verifyAuth, create);
menuRouter.get("/list", verifyAuth, getMenuList);

export default menuRouter;
