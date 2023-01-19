import { File } from "@prisma/client";
import { db } from "../app/dataBase";
type IFileInfo = Pick<File, "filename" | "identifier" | "uploadBy" | "size">;
class UploadService {
  async addFile({ filename, identifier, uploadBy, size }: IFileInfo) {
    const exits = await db.file.findUnique({
      where: {
        identifier,
      },
    });
    if (!exits) {
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
  async queryFile(identifier: string) {
    const res = await db.file.findUnique({
      where: {
        identifier,
      },
    });
    return res;
  }
}

export default new UploadService();
