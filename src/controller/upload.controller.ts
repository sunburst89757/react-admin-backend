import { Context, Next } from "koa";
import { Uploader } from "../utils/Uploader";
import { resolve } from "path";
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
    uploader.get(
      ctx.query,
      (status, filename, original_filename, identifier) => {
        if (status == "found") {
          status = 200;
          // 断点续传 和 秒传 逻辑待添加
          ctx.onSuccess({
            data: {
              filename,
              originalFilename: original_filename,
              identifier,
            },
          });
        } else {
          ctx.status = 204;
        }
      }
    );
  }
  async mergeChunk(ctx: Context, next: Next) {
    const { filename, identifier } = ctx.request.body;
    await uploader.write(filename, identifier);
    ctx.onSuccess({
      data: {
        filename,
        identifier,
      },
      message: "merge success",
    });
  }
  async download(ctx: Context, next: Next) {
    const { identifier } = ctx.params;
    // uploader.write(identifier);
  }
}

export const { uploadChunk, testChunk, mergeChunk, download } =
  new UploadController();
