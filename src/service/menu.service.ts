import { Menu } from "@prisma/client";
import { db } from "../app/dataBase";
import { IMenu } from "./role.service";

class MenuService {
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
      if (name) {
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
        return {
          page,
          pageSize,
          total: res[1],
          list: res[0].length === 0 ? null : res[0],
        };
      }
      const res = await db.$transaction([
        db.menu.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            parentId: 0,
          },
          orderBy: {
            sort: "asc",
          },
        }),
        db.menu.count({
          where: {
            parentId: 0,
          },
        }),
      ]);
      return {
        page,
        pageSize,
        total: res[1],
        list: res[0].length === 0 ? null : res[0],
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
      console.log(res, "执行");
      if (res.length === 0) {
        return {
          page,
          pageSize,
          total: 0,
          list: null,
        };
      }
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
        list: res.length === 0 ? null : res,
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
  async updateMenu(menu: Menu) {
    const { id, name, icon, sort, isValid } = menu;
    const res = await db.menu.update({
      where: {
        id,
      },
      data: {
        name,
        icon,
        sort,
        isValid,
      },
    });
    // 禁用父级菜单 所有下面的都被禁止
    if (res.parentId === 0 && !isValid) {
      await db.menu.updateMany({
        where: {
          parentId: res.id,
        },
        data: {
          isValid,
        },
      });
    }
    return res;
  }
  async deleteMenu(id: number) {
    //  先删除关系表再删除menu表才可以
    await db.roleOnMenu.deleteMany({
      where: {
        menuId: id,
      },
    });
    const menu = await db.menu.delete({
      where: {
        id,
      },
    });
    if (menu?.parentId === 0) {
      const sonMenu = await db.menu.findMany({
        where: {
          parentId: id,
        },
      });
      console.log(sonMenu, "sonMenu");
      // 必须这么写异步执行完之后才可以
      await this.deleteAllSonMenu(sonMenu);
      await db.menu.deleteMany({
        where: {
          parentId: id,
        },
      });
    }
  }
  async deleteAllSonMenu(sonMenu: Menu[]) {
    sonMenu.forEach(async (menu) => {
      await db.roleOnMenu.deleteMany({
        where: {
          menuId: menu.id,
        },
      });
    });
  }
}

export default new MenuService();
