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
  async readMenuList(
    path: string,
    page: number = 1,
    pageSize: number = 10,
    name: string
  ) {
    if (!path) {
      const res = await db.$transaction([
        db.menu.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            name: {
              contains: name,
            },
          },
          orderBy: {
            sort: "asc",
          },
        }),
        db.menu.count({
          where: {
            name: {
              contains: name,
            },
          },
        }),
      ]);
      if (!name) {
        // 查所有 排序
        const realRes: Menu[] = [];
        const fatherMenu = res[0].filter((menu) => menu.parentId === 0);
        fatherMenu.sort((pre, next) => pre.sort - next.sort);
        const sonMenu = res[0].filter((menu) => menu.parentId !== 0);
        sonMenu.sort((pre, next) => pre.sort - next.sort);
        fatherMenu.forEach((menu) => {
          realRes.push(menu);
          realRes.push(
            ...sonMenu.filter((route) => route.parentId === menu.id)
          );
        });
        return {
          page,
          pageSize,
          total: res[1],
          menuList: realRes,
        };
      }
      return {
        page,
        pageSize,
        total: res[1],
        menuList: res[0].length === 0 ? null : res[0],
      };
    } else {
      // 传递路径查询只有一条结果
      const res = await db.menu.findMany({
        where: {
          path,
          name: {
            contains: name,
          },
        },
      });
      const menu = res[0];
      const children = await db.$transaction([
        db.menu.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            parentId: menu.id,
            name: {
              contains: name,
            },
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
        menuList: res.length === 0 ? null : res,
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
