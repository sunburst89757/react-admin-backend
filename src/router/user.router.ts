import Router from "koa-router";
const userRouter = new Router({ prefix: "/user" });
userRouter.get("/login", async (ctx, next) => {
  ctx.body = "结束";
});
export { userRouter };
