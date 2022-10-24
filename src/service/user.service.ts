import { User } from "@prisma/client";
import { db } from "../app/dataBase";
import { PageInfo } from "../types/user.type";

class UserService {
  async createUser(username: string, password: string) {
    try {
      const res = await db.user.create({
        data: {
          username,
          password,
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
      }),
    ]);
    return {
      page,
      pageSize,
      total: res[0],
      list: res[1].length === 0 ? null : res[1],
    };
  }
}

export default new UserService();
