import { Context, Next } from "koa";
import { Uploader } from "../utils/Uploader";
import { resolve } from "path";
import fs from "fs";
const uploader = new Uploader(resolve(__dirname, "../../temp"));
class UploadController {
  async uploadChunk(ctx: Context, next: Next) {
    // console.log(ctx.files, "files \n");
    const { status, filename, originalFilename, identifier } =
      await uploader.post(ctx);
    if (status === "done") {
      ctx.onSuccess({
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
    // 合并逻辑
    /*  const path = resolve(__dirname, `../../uploads/${filename}`);
    const s = fs.createWriteStream(path);
    s.on("finish", () => {});
    await uploader.write(identifier, s, { end: true }); */
    ctx.onSuccess({
      data: "merge success",
    });
  }
  async download(ctx: Context, next: Next) {
    const { identifier } = ctx.params;
    // uploader.write(identifier);
  }
}

export const { uploadChunk, testChunk, mergeChunk, download } =
  new UploadController();
