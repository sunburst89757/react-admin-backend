import { Context, Next } from "koa";
import { uploader } from "../controller/upload.controller";

class Timer {
  // 一个月自动清除一次temp文件夹
  async cleanAllChunks(ctx: Context, next: Next) {
    setInterval(() => {
      uploader.removeAllChunks();
    }, 1000 * 60 * 60 * 24 * 30);
    await next();
  }
}

export const { cleanAllChunks } = new Timer();
