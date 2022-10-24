import { Context, DefaultState } from "koa";
import Router from "koa-router";
import {
  create,
  deleteMenu,
  getMenuList,
  updateMenu,
} from "../controller/menu.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const menuRouter = new Router<DefaultState, Context>({ prefix: "/menu" });
menuRouter.post("/add", verifyAuth, create);
menuRouter.get("/list", verifyAuth, getMenuList);
menuRouter.post("/update", verifyAuth, updateMenu);
menuRouter.delete("/delete/:id", verifyAuth, deleteMenu);

export default menuRouter;
