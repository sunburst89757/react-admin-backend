import { DefaultContext } from "koa";
// 局部扩展属性
export interface GlobalContext extends DefaultContext {
  name: string;
}
