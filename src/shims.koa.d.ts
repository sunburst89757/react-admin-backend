import "koa";
// 给koa的context添加全局属性
declare module "koa" {
  export interface DefaultContext {
    name: string;
  }
}
