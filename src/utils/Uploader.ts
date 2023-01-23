import multer from "@koa/multer";
import fs from "fs";
import { Context } from "koa";
import { resolve } from "path";
import { ParsedUrlQuery } from "querystring";
import uploadService from "../service/upload.service";
export class Uploader {
  temporaryFolder: string;
  uploadFolder: string;
  fileParameterName: string;
  maxFileSize?: number;
  constructor(
    temporaryFolder: string,
    uploadFolder: string,
    fileParameterName = "file",
    maxFileSize?: number
  ) {
    this.uploadFolder = uploadFolder;
    this.temporaryFolder = temporaryFolder;
    this.maxFileSize = maxFileSize;
    this.fileParameterName = fileParameterName;
    try {
      fs.mkdirSync(temporaryFolder);
      fs.mkdirSync(uploadFolder);
    } catch (e) {}
  }
  private getChunkFilename(chunkNumber: number, identifier: string) {
    const chunkFolder = resolve(this.temporaryFolder, identifier);
    try {
      fs.mkdirSync(this.temporaryFolder + "/" + identifier);
    } catch (error) {}
    return resolve(chunkFolder, "./uploader-" + identifier + "." + chunkNumber);
  }
  private async getAllChunkSortPath(identifier: string) {
    // 找到切片
    const chunks = await fs.promises.readdir(
      this.temporaryFolder + "/" + identifier
    );
    // 切片排序
    chunks.sort((pre: string, next: string) => {
      const preIndex = parseInt(pre.slice(pre.lastIndexOf(".") + 1));
      const nextIndex = parseInt(next.slice(next.lastIndexOf(".") + 1));
      return preIndex - nextIndex;
    });
    return chunks.map(
      (chunk) => this.temporaryFolder + "/" + identifier + "/" + chunk
    );
  }
  // 进行秒传和断点续传测试
  async get(query: ParsedUrlQuery): Promise<{
    uploaded: number[];
    skip: boolean;
  }> {
    return new Promise(async (resolve) => {
      let { chunkNumber, identifier } = query as Record<string, string>;
      // 秒传验证
      const res = await uploadService.testFastPass(identifier);
      if (res) {
        resolve({
          skip: true,
          uploaded: [],
        });
      } else {
        // 断点续传
        const chunkFilename = this.getChunkFilename(
          parseInt(chunkNumber),
          identifier
        );
        const isExist = fs.existsSync(chunkFilename);
        if (isExist) {
          // 断点续传逻辑
          const chunks = await this.getAllChunkSortPath(identifier);

          // 已经上传的切片
          const uploaded = chunks.map((chunk) =>
            parseInt(chunk.slice(chunk.lastIndexOf(".") + 1))
          );
          resolve({
            skip: false,
            uploaded,
          });
        } else {
          // 没有上传切片 所有的都需要重新传递
          resolve({
            uploaded: [],
            skip: false,
          });
        }
      }
    });
  }
  // 上传文件
  async post(ctx: Context): Promise<{
    status: string;
    filename: string;
    originalFilename: string;
    identifier: string;
  }> {
    return new Promise(async (resolve) => {
      const { chunkNumber, chunkSize, totalSize, identifier, filename } =
        ctx.request.body;
      const file = (ctx.files as multer.File[])[0];
      const original_filename = file.originalname;
      // 切片保存地址
      const chunkFilename = this.getChunkFilename(chunkNumber, identifier);
      try {
        await fs.promises.writeFile(chunkFilename, file.buffer);
        let currentTestChunk = 1;
        const numberOfChunks = Math.max(
          Math.floor(totalSize / (chunkSize * 1.0)),
          1
        );
        const testChunkExists = async () => {
          try {
            await fs.promises.access(
              this.getChunkFilename(currentTestChunk, identifier)
            );
            currentTestChunk++;
            if (currentTestChunk > numberOfChunks) {
              resolve({
                status: "done",
                filename,
                originalFilename: original_filename,
                identifier,
              });
            } else {
              // Recursion
              await testChunkExists();
            }
          } catch (error) {
            resolve({
              status: "partly_done",
              filename,
              originalFilename: original_filename,
              identifier,
            });
          }
        };
        await testChunkExists();
      } catch (error) {
        console.error("node 写入切片错误", error);
        resolve({
          status: "node写入错误",
          filename,
          originalFilename: original_filename,
          identifier,
        });
      }
    });
  }
  // 文件合并写入文件
  async write(filename: string, identifier: string) {
    return new Promise(async (resolve) => {
      const exits = fs.existsSync(this.uploadFolder + "/" + filename);
      // 避免重复写入
      if (!exits) {
        const chunks = await this.getAllChunkSortPath(identifier);
        // 切片收集
        const parts = [];
        for (const chunk of chunks) {
          const part = await fs.promises.readFile(chunk);
          parts.push(part);
        }
        // 切片写入文件
        try {
          await fs.promises.writeFile(
            this.uploadFolder + "/" + filename,
            Buffer.concat(parts)
          );
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      }
      resolve(true);
    });
  }
  async removeAllChunks(identifier?: string) {
    fs.rmSync(this.temporaryFolder + "/" + identifier, {
      recursive: true,
      force: true,
    });
    // 不传递identifier 删除所有temp文件下的chunk
    if (!identifier) {
      try {
        fs.mkdirSync(this.temporaryFolder);
      } catch (error) {}
    }
  }
}
