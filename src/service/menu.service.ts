import { Menu } from "@prisma/client";
import { db } from "../app/dataBase";
import { IMenu } from "./role.service";

class RoleService {
  async createMenu(menu: IMenu) {
    const { path } = menu;
    const menuArr = path.split("/");
    if (menuArr.length === 2) {
      const res = await db.menu.create({
        data: {
          ...menu,
          path: menuArr[1],
          roles: {
            create: {
              // 创建的新菜单都默认绑定给管理员
              roleId: 1,
            },
          },
        },
      });
      return res;
    } else {
      const res = await this.findFatherMenu(menuArr[1]);
      const res1 = await db.menu.create({
        data: {
          ...menu,
          parentId: res!.id,
          path: menuArr[2],
          roles: {
            create: {
              // 没指定角色就是通用角色
              roleId: 2,
            },
          },
        },
      });
      return res1;
    }
  }
  async readMenuList(path: string, page: number = 1, pageSize: number = 10) {
    if (!path) {
      const res = await db.menu.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return res;
    } else {
      // 传递路径查询只有一条结果
      const res = await db.menu.findMany({
        where: {
          path,
        },
      });
      const menu = res[0];
      const children = await db.$transaction([
        db.menu.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            parentId: menu.id,
          },
          orderBy: {
            sort: "asc",
          },
        }),
        db.menu.count({
          where: {
            parentId: menu.id,
          },
        }),
      ]);
      res.push(...children[0]);
      return {
        page,
        pageSize,
        total: children[1],
        menuList: res,
      };
    }
  }
  async findFatherMenu(path: string) {
    const res = await db.menu.findUnique({
      where: {
        path,
      },
    });
    console.log(res?.id);
    return res;
  }
}

export default new RoleService();
