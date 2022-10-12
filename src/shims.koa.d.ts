import "koa";
// 给koa的context添加全局属性
export type ErrorRes = {
  code: number;
  success?: boolean;
  message?: string;
};
export type SuccessRes = {
  code?: number;
  success?: boolean;
  message?: string;
  data: any;
};
export type IUser = {
  username: string;
  userId: number;
};
declare module "koa" {
  export interface DefaultContext {
    onSuccess: (data: SuccessRes) => void;
    onError: (err: ErrorRes) => void;
    user: IUser;
  }
}
