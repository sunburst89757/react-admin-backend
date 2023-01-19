import { File } from "@prisma/client";
import { db } from "../app/dataBase";
type IFileInfo = Pick<File, "filename" | "identifier" | "uploadBy">;
class UploadService {
  async addFile({ filename, identifier, uploadBy }: IFileInfo) {}
}

export default new UploadService();
