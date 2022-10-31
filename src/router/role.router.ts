import { Context, DefaultState } from "koa";
import Router from "koa-router";
import {
  create,
  distributeRole,
  getMenuListByRoleId,
  getRoleList,
  updateMenuList,
} from "../controller/role.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const roleRouter = new Router<DefaultState, Context>({ prefix: "/role" });
roleRouter.post("/addRole", verifyAuth, create);
roleRouter.post("/distribute", verifyAuth, distributeRole);
roleRouter.get("/menuList/:roleId", verifyAuth, getMenuListByRoleId);
roleRouter.get("/list", verifyAuth, getRoleList);
roleRouter.post("/updateMenuList", verifyAuth, updateMenuList);
export default roleRouter;
