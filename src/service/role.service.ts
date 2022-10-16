import { db } from "../app/dataBase";
export type IPath = {
  name: string;
  icon: string;
  path: string;
  sort: number;
  parentId?: number;
};
class RoleService {
  async addRole(roleName: string, path?: IPath) {
    const unAuth = await db.menu.findMany({
      where: {
        isAuth: false,
      },
    });
    const unAuthMenu = unAuth.map((menu) => ({
      menu: {
        connect: {
          id: menu.id,
        },
      },
    }));
    const menu = path
      ? [
          ...unAuthMenu,
          {
            menu: {
              create: path,
            },
          },
        ]
      : unAuthMenu;
    const res = await db.role.create({
      data: {
        roleName,
        menus: {
          create: menu,
        },
      },
    });
    return res;
  }
  async distributeRoleByUserId(userId: number,roleId:number) {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        roleId,
      }
    });
  }
}

export default new RoleService();
