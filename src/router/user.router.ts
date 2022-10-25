import { Context, DefaultState } from "koa";
import Router from "koa-router";
import {
  create,
  deleteUser,
  getUserList,
  login,
  logout,
  updateUser,
} from "../controller/user.controller";
import {
  encryptPassword,
  verifyAuth,
  verifyLogin,
  verifyUser,
} from "../middleware/auth.middleware";
const userRouter = new Router<DefaultState, Context>({ prefix: "/user" });
userRouter.post("/add", verifyUser, encryptPassword, create);
userRouter.post("/login", verifyLogin, login);
userRouter.get("/logout", logout);
userRouter.post("/update", verifyAuth, updateUser);
userRouter.delete("/delete/:id", verifyAuth, deleteUser);
userRouter.get("/list", verifyAuth, getUserList);

export default userRouter;
