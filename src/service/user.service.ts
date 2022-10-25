import { Prisma, Role, User } from "@prisma/client";
import { db } from "../app/dataBase";
import { PageInfo } from "../types/user.type";

class UserService {
  async createUser(userInfo: User) {
    try {
      const res = await db.user.create({
        data: {
          ...userInfo,
        },
      });
      return res;
    } catch (error: any) {
      console.error(error.message);
    }
  }
  async updateUser(
    userInfo: Pick<
      User,
      "id" | "username" | "isValid" | "description" | "roleId"
    >
  ) {
    const res = await db.user.update({
      where: {
        id: userInfo.id,
      },
      data: {
        ...userInfo,
      },
    });
    return res;
  }
  async deleteUser(id: number) {
    return await db.user.delete({
      where: {
        id,
      },
    });
  }
  async getUserList({
    username,
    page,
    pageSize,
  }: PageInfo & { username: string }) {
    const res = await db.$transaction([
      db.user.count({
        where: {
          username: {
            contains: username,
          },
        },
      }),
      db.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
          username: {
            contains: username,
          },
        },
        include: {
          role: {
            select: {
              roleName: true,
              id: true,
            },
          },
        },
      }),
    ]);
    if (res[1].length === 0) {
      return {
        page,
        pageSize,
        total: res[0],
        list: null,
      };
    }
    // await this.getRoleName(res[1]);
    return {
      page,
      pageSize,
      total: res[0],
      list: res[1],
    };
  }
  // async getRoleName(userInfo: User[]) {
  //   console.log("1", userInfo);
  //   let promiseArr: Prisma.Prisma__RoleClient<Role | null, null>[] = [];
  //   userInfo.forEach((menu) => {
  //     const res = db.role.findUnique({
  //       where: {
  //         id: menu.roleId,
  //       },
  //     });
  //     promiseArr.push(res);
  //   });
  //   const res = await Promise.all(promiseArr);
  //   userInfo.forEach((menu, index) => {
  //     // @ts-ignore
  //     menu.roleName = res[index]?.roleName;
  //   });
  // }
}

export default new UserService();
