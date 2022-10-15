import { db } from "../app/dataBase";
export type IPath = {
  name: string;
  icon: string;
  path: string;
  sort: number;
  parentId?: number;
};
class RoleService {
  async addRole(roleName: string, path: IPath) {
    console.log(path);

    const res = await db.role.create({
      data: {
        roleName,
        menus: {
          create: [
            {
              menu: {
                create: path,
              },
            },
          ],
        },
      },
    });
    return res;
  }
}

export default new RoleService();
