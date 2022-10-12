import { db } from "../app/dataBase";

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
}

export default new UserService();
