import { db } from "../app/dataBase";

class FileService {
  async queryFile({
    page,
    pageSize,
    filename,
  }: {
    page: number;
    pageSize: number;
    filename: string;
  }) {
    const res = await db.$transaction([
      db.file.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
          filename: {
            contains: filename,
          },
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.file.count({
        where: {
          filename: {
            contains: filename,
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
  async removeFile(id: number) {
    const res = await db.file.delete({
      where: {
        id,
      },
    });
    return res;
  }
}

export default new FileService();
