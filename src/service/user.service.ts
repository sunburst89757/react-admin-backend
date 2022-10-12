import { db } from "../app/dataBase";

class UserService {
  async createUser() {
    try {
      const res = await db.user.create({
        data: {
          email: "3333@gmail.com",
          name: "test25",
        },
      });
      return res;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}

export default new UserService();
