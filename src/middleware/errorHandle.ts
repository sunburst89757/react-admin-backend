import { Context, Next } from "koa";
import { HttpStatus } from "../types/httpStatus";

export const errorHandle = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = (error as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.onError({
      code: ctx.status,
      message: "服务器内部错误",
    });
  }
};
