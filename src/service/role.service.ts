import { PageInfo } from "./../types/user.type";
import { Menu, Role } from "@prisma/client";
import { WHITE_LIST } from "../app/config";
import { db } from "../app/dataBase";
import { list2Tree, sortTree } from "../utils/list2tree";
export type IMenu = {
  name: string;
  icon: string;
  path: string;
  sort: number;
  isValid?: boolean;
  parentId?: number;
};
type IRoleInfo = Pick<Role, "description" | "isValid" | "roleName">;
class RoleService {
  // path是新增除了未授权菜单外的其他菜单
  async addRole({ roleName, isValid, description }: IRoleInfo, path?: IMenu) {
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
        isValid,
        description,
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
    //  父级路由排序
    const tree = list2Tree(res, 0);
    const result = sortTree(tree!);
    return result;
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
  async updateRoleInfo({
    id,
    roleName,
    isValid,
    description,
  }: IRoleInfo & { id: number }) {
    const res = await db.role.update({
      where: {
        id,
      },
      data: {
        roleName,
        isValid,
        description,
      },
    });
    return res;
  }
  async deleteRole(id: number) {
    try {
      await db.user.deleteMany({
        where: {
          roleId: id,
        },
      });
    } catch (error) {
      console.log(error, "没有对应的用户属于该角色");
    }
    const res = await db.$transaction([
      db.roleOnMenu.deleteMany({
        where: {
          roleId: id,
        },
      }),
      db.role.delete({
        where: {
          id,
        },
      }),
    ]);
    return res;
  }
}

export default new RoleService();
