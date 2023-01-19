import { Context, Next } from "koa";
import { Uploader } from "../utils/Uploader";
import { resolve } from "path";
import uploadService from "../service/upload.service";
import send from "koa-send";
const uploader = new Uploader(
  resolve(__dirname, "../../temp"),
  resolve(__dirname, "../../uploads")
);
class UploadController {
  async uploadChunk(ctx: Context, next: Next) {
    const { status, filename, originalFilename, identifier } =
      await uploader.post(ctx);
    if (status === "done") {
      return ctx.onSuccess({
        data: {
          filename,
          originalFilename,
          identifier,
        },
      });
    } else {
      ctx.status = /^(partly_done|done)$/.test(status) ? 200 : 500;
    }
  }
  async testChunk(ctx: Context, next: Next) {
    const { skip, uploaded } = await uploader.get(ctx.query);
    ctx.onSuccess({
      data: {
        skip,
        uploaded,
      },
    });
  }
  async mergeChunk(ctx: Context, next: Next) {
    const { filename, identifier, uploadBy, size } = ctx.request.body;
    try {
      await uploader.write(filename, identifier);
      await uploadService.addFile({
        filename,
        identifier,
        uploadBy,
        size,
      });
      ctx.onSuccess({
        data: {
          filename,
          identifier,
        },
        message: "merge success",
      });
      // 删除所有的切片
      uploader.removeAllChunks(identifier);
    } catch (error) {}
  }
  async download(ctx: Context, next: Next) {
    const { filename } = ctx.params;
    // uploader.write(identifier);
    try {
      await send(ctx, filename, {
        root: resolve(__dirname, "../../uploads"),
      });
    } catch (error) {
      console.log("download file error:", error);
    }
  }
}

export const { uploadChunk, testChunk, mergeChunk, download } =
  new UploadController();
