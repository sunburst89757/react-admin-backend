import { Menu } from "@prisma/client";
import { db } from "../app/dataBase";
export type IMenu = {
  name: string;
  icon: string;
  path: string;
  sort: number;
  parentId?: number;
};
class RoleService {
  async addRole(roleName: string, path?: IMenu) {
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
  async distributeRoleByUserId(userId: number, roleId: number) {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        roleId,
      },
    });
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
    //  不传指定路径 children的构造方法 用于登录获取菜单
    //  父级路由排序
    const sortRes = res
      .filter((menu) => menu.parentId === 0)
      .sort((pre, next) => pre.sort - next.sort);
    res.forEach((menu) => {
      // parentId = 0的都是一级路由
      if (menu.parentId > 0) {
        const fatherId = menu.parentId;
        const fatherMenu = sortRes.find((menu) => menu.id === fatherId);
        // @ts-ignore;
        fatherMenu.children || (fatherMenu.children = []);
        // @ts-ignore;
        fatherMenu.children.push(menu);
      } else {
        // @ts-ignore;
        menu.children = null;
      }
    });
    // 子菜单进行排序
    sortRes.forEach((menu) => {
      // @ts-ignore;
      if (menu.children) {
        // @ts-ignore;
        menu.children.sort((pre, next) => pre.sort - next.sort);
      }
    });
    // 删除重复的子路由
    // const realRes = res.filter((menu) => menu.parentId === 0);
    return sortRes;
  }
}

export default new RoleService();
