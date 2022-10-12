import { Context, Next } from "koa";
import { ErrorRes, SuccessRes } from "../shims.koa";
import { HttpStatus } from "../types/httpStatus";
export const responseFormat = async (ctx: Context, next: Next) => {
  ctx.onSuccess = ({
    data,
    code = 200,
    message,
    success = true,
  }: SuccessRes) => {
    console.log(data, code, HttpStatus[code], success);
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
  await next();
};
