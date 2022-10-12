import { Context } from "koa";
class TestController {
  async testAuth(ctx: Context) {
    ctx.onSuccess({
      data: ctx.userId,
      message: "校验token成功",
    });
  }
}

export const { testAuth } = new TestController();
