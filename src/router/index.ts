import fs from "fs";
import Application from "koa";
import Router from "koa-router";
import path from "path";
const dir = fs.readdirSync(path.resolve(__dirname, "./"));
export const useRoutes = (app: Application) => {
  dir.forEach(async (file) => {
    if (file !== "index.ts") {
      // import 导入的是一个模块对象 对象的属性上有default 和 具名导出的对象
      const { default: router }: { default: Router } = await import(
        `./${file}`
      );
      app.use(router.routes());
      app.use(router.allowedMethods());
    }
  });
};
