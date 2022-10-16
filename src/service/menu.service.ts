import { db } from "../app/dataBase";
import { IPath } from "./role.service";

class RoleService {
  async addPath(path: IPath) {
    const res = await db.menu.create({
      data: path,
    });
    return res;
  }
  async queryMenuListByRoleId(roleId: number) {
    const res = await db.menu.findMany({
      where: {
        roles: {
          some: {
            roleId,
          },
        },
      },
    });
    if (res.length === 0) return null;
    res.forEach((menu) => {
      // parentId = 0的都是一级路由
      if (menu.parentId > 0) {
        const fatherId = menu.parentId;
        const fatherMenu = res.find((menu) => menu.id === fatherId);
        // @ts-ignore;
        fatherMenu.children = menu;
      }
    });
    // 删除重复的子路由
    const realRes = res.filter((menu) => menu.parentId === 0);
    return realRes;
  }
}

export default new RoleService();
