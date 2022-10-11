import { Context, Next } from "koa";
import { ErrorRes, SuccessRes } from "../shims.koa";
import { HttpStatus } from "../types/httpStatus";
export const responseFormat = (ctx: Context, next: Next) => {
  ctx.onSuccess = ({
    data,
    code = 200,
    message,
    success = true,
  }: SuccessRes) => {
    ctx.body = {
      code,
      success,
      data,
      message: message || HttpStatus[code],
    };
  };
  ctx.onError = ({ code, message, success = false }: ErrorRes) => {
    ctx.body = {
      code,
      success,
      message: message || HttpStatus[code],
    };
  };
  next();
};
