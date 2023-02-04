import { PageInfo } from "./../types/user.type";
import { Button } from "@prisma/client";
import { db } from "../app/dataBase";
import { list2Tree, sortTree } from "../utils/list2tree";

class ButtonService {
  async getButtonList(roleId: number) {
    const res = await db.button.findMany({
      where: {
        roleId,
      },
    });
    const result = res.map((item) => ({
      pathname: item.pathname,
      auth: Object.keys(item).filter((key) => {
        // @ts-ignore
        return item[key] === true;
      }),
    }));
    return result;
  }
  async addButton({ roleId, pathname }: Pick<Button, "roleId" | "pathname">) {
    const res = await db.button.create({
      data: {
        roleId,
        pathname,
      },
    });
    return res;
  }
}

export default new ButtonService();
