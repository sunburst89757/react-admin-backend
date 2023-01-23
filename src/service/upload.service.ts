import { File } from "@prisma/client";
import fs from "fs";
import path from "path";
import { db } from "../app/dataBase";
import { uploader } from "../controller/upload.controller";
type IFileInfo = Pick<File, "filename" | "identifier" | "uploadBy" | "size">;
class UploadService {
  async addFile({ filename, identifier, uploadBy, size }: IFileInfo) {
    const exits = await db.file.findUnique({
      where: {
        identifier,
      },
    });
    if (!exits) {
      // 对是test用户的限制
      if (uploadBy === 11) {
        await this.deleteTestFile(uploadBy);
      }
      await db.file.create({
        data: {
          filename,
          identifier,
          uploadBy,
          size,
        },
      });
    }
  }
  async testFastPass(identifier: string) {
    const res = await db.file.findUnique({
      where: {
        identifier,
      },
    });
    return res;
  }
  //  删除test用户上传的多余文件
  async deleteTestFile(uploadBy: number) {
    return new Promise(async (resolve) => {
      const number = await db.file.count({
        where: {
          uploadBy,
        },
      });
      // 上传超过5个就将之前上传的都删除
      if (number === 5) {
        const files = await db.file.findMany({
          where: {
            uploadBy,
          },
        });
        await db.file.deleteMany({
          where: {
            uploadBy,
          },
        });
        // 删除test上传的文件
        for (const file of files) {
          fs.unlinkSync(
            path.resolve(__dirname, `../../uploads/${file.filename}`)
          );
        }
        // 删除所有chunk
        await uploader.removeAllChunks();
        resolve(true);
      }
      resolve(true);
    });
  }
}

export default new UploadService();
