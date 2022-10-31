import { PageInfo } from "./../types/user.type";
import { Menu } from "@prisma/client";
import { WHITE_LIST } from "../app/config";
import { db } from "../app/dataBase";
export type IMenu = {
  name: string;
  icon: string;
  path: string;
  sort: number;
  isValid?: boolean;
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
    let res;
    if (WHITE_LIST.includes(roleId)) {
      res = await db.menu.findMany({
        where: {
          isValid: true,
        },
      });
      console.log(res, "是啥");
    } else {
      res = await db.menu.findMany({
        where: {
          isValid: true,
          roles: {
            some: {
              roleId,
            },
          },
        },
      });
    }

    if (res.length === 0) return null;
    //  不传指定路径 children的构造方法 用于登录获取菜单
    //  父级路由排序

    const sortRes = res
      .filter((menu) => menu.parentId === 0)
      .sort((pre, next) => pre.sort - next.sort);
    console.log(sortRes, "是啥");

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
    return sortRes;
  }
  async getRoleList({
    roleName,
    description,
    page = 1,
    pageSize = 10,
  }: { roleName: string; description: string } & PageInfo) {
    const res = await db.$transaction([
      db.role.count({
        where: {
          roleName: {
            contains: roleName,
          },
          description: {
            contains: description,
          },
        },
      }),
      db.role.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
          roleName: {
            contains: roleName,
          },
          description: {
            contains: description,
          },
        },
      }),
    ]);
    return {
      page,
      pageSize,
      total: res[0],
      list: res[1],
    };
  }
  async updateMenuList(roleId: number, menuIds: number[]) {
    const data = menuIds.map((menuId) => ({
      roleId,
      menuId,
    }));
    // 先删除旧的，再添加新的
    const res = await db.$transaction([
      db.roleOnMenu.deleteMany({
        where: {
          roleId,
        },
      }),
      db.roleOnMenu.createMany({
        data,
      }),
    ]);
    return res;
  }
}

export default new RoleService();
