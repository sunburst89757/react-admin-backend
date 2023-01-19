import { File } from "@prisma/client";
import { db } from "../app/dataBase";
type IFileInfo = Pick<File, "filename" | "identifier" | "uploadBy" | "size">;
class UploadService {
  async addFile({ filename, identifier, uploadBy, size }: IFileInfo) {
    const res = await db.file.create({
      data: {
        filename,
        identifier,
        uploadBy,
        size,
      },
    });
    return res;
  }
}

export default new UploadService();
