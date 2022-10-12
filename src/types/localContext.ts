import { DefaultContext } from "koa";
// 局部扩展属性
export interface localContext extends DefaultContext {
  name: string;
}
