import { db } from "../app/dataBase";
import { IPath } from "./role.service";

class RoleService {
  async addPath(path: IPath) {
    const res = await db.menu.create({
      data: path,
    });
    return res;
  }
}

export default new RoleService();
