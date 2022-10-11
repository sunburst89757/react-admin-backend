import { Context, Next } from "koa";
import { ErrorRes, SuccessRes } from "../shims.koa";
export const responseFormat = (ctx: Context, next: Next) => {
  ctx.onSuccess = ({
    data,
    message,
    code = 200,
    success = true,
  }: SuccessRes) => {
    ctx.body = {
      code,
      success,
      data,
      message,
    };
  };
  ctx.onError = ({ message, code, success = false }: ErrorRes) => {
    ctx.body = {
      code,
      success,
      message,
    };
  };
  next();
};
