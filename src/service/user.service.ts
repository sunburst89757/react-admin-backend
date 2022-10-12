class UserService {
  async createUser() {
    try {
      // const res = await db.user.create({
      //    data: {
      //     username:
      //    }
      // })
      return 123;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}

export default new UserService();
