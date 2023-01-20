import { Context, DefaultState } from "koa";
import Router from "koa-router";
import {
  deleteFile,
  download,
  getFileList,
} from "../controller/file.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const fileRouter = new Router<DefaultState, Context>({ prefix: "/file" });
fileRouter.get("/list", getFileList);
fileRouter.get("/download", download);
fileRouter.delete("/remove/:id", deleteFile);
export default fileRouter;
