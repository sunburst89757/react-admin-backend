import fs from "fs";
import { Context } from "koa";
import mine from "mime-types";
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
    const filePath = path.resolve(__dirname, `../../uploads/${filename}`);
    const mimeType = mine.lookup(filePath);
    if (mimeType) {
      const src = fs.createReadStream(filePath);
      ctx.response.set("content-type", mimeType);
      ctx.attachment(filename as string);
      ctx.body = src;
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
