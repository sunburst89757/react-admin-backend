import { Context, DefaultStateExtends } from "koa";
import Router from "koa-router";
import multer from "@koa/multer";
import {
  mergeChunk,
  testChunk,
  uploadChunk,
} from "../controller/upload.controller";
import { verifyAuth } from "../middleware/auth.middleware";
const uploadRouter = new Router<DefaultStateExtends, Context>({
  prefix: "/upload",
});
const multerMidderWare = multer().any();
uploadRouter.post("/uploadChunk", multerMidderWare, uploadChunk);
uploadRouter.get("/uploadChunk", testChunk);
uploadRouter.post("/merge", mergeChunk);
export default uploadRouter;
