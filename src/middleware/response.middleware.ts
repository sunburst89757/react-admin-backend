import { Context, Next } from "koa";
import { ErrorRes, SuccessRes } from "../shims.koa";
import { HttpStatus } from "../types/httpStatus";
export const responseFormat = async (ctx: Context, next: Next) => {
  ctx.onSuccess = ({
    data,
    code = 200,
    message = HttpStatus[code],
    success = true,
  }: SuccessRes) => {
    ctx.body = {
      code,
      success,
      data,
      message,
    };
  };
  ctx.onError = ({
    code,
    message = HttpStatus[code],
    success = false,
  }: ErrorRes) => {
    ctx.body = {
      code,
      success,
      message,
    };
  };
  await next();
};
