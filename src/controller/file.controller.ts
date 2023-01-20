import fs from "fs";
import { Context } from "koa";
import send from "koa-send";
import path from "path";
import service from "../service/file.service";
class FileController {
  async getFileList(ctx: Context) {
    const { page, pageSize, filename } = ctx.query;
    const data = await service.queryFile({
      page: Number(page as string),
      pageSize: Number(pageSize as string),
      filename: filename as string,
    });
    ctx.onSuccess({
      data,
    });
  }
  async download(ctx: Context) {
    const { filename } = ctx.query;
    try {
      await send(ctx, filename as string, {
        root: path.resolve(__dirname, "../../uploads"),
      });
    } catch (error) {
      console.log("download file error:", error);
    }
  }
  async deleteFile(ctx: Context) {
    const { id } = ctx.params;
    const data = await service.removeFile(Number(id));
    fs.unlinkSync(path.resolve(__dirname, `../../uploads/${data.filename}`));
    ctx.onSuccess({
      data,
      message: "delete file successfully",
    });
  }
}

export const { getFileList, download, deleteFile } = new FileController();
