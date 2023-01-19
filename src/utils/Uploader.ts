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
  private cleanIdentifier(identifier: string) {
    return identifier.replace(/[^0-9A-Za-z_-]/g, "");
  }
  private getChunkFilename(chunkNumber: number, identifier: string) {
    const realIdentifier = this.cleanIdentifier(identifier);
    const chunkFolder = resolve(this.temporaryFolder, realIdentifier);
    try {
      fs.mkdirSync(this.temporaryFolder + "/" + realIdentifier);
    } catch (error) {}
    return resolve(
      chunkFolder,
      "./uploader-" + realIdentifier + "." + chunkNumber
    );
  }
  private validateRequest(
    chunkNumber: number,
    chunkSize: number,
    totalSize: number,
    identifier: string,
    filename: string,
    fileSize?: number
  ) {
    const realIdentifier = this.cleanIdentifier(identifier);
    //  没写默认值 这个拦截会无效
    if (
      chunkNumber == 0 ||
      chunkSize == 0 ||
      totalSize == 0 ||
      realIdentifier.length == 0 ||
      filename.length == 0
    ) {
      return false;
    }
    const numberOfChunks = Math.max(
      Math.floor(totalSize / (chunkSize * 1.0)),
      1
    );
    if (chunkNumber > numberOfChunks) {
      return false;
    }

    if (this.maxFileSize && totalSize > this.maxFileSize) {
      return false;
    }

    if (fileSize) {
      if (chunkNumber < numberOfChunks && fileSize != chunkSize) {
        // The chunk in the POST request isn't the correct size

        return false;
      }

      if (
        numberOfChunks > 1 &&
        chunkNumber == numberOfChunks &&
        fileSize != (totalSize % chunkSize) + parseInt(String(chunkSize))
      ) {
        // The chunks in the POST is the last one, and the fil is not the correct size

        return false;
      }

      if (numberOfChunks == 1 && fileSize != totalSize) {
        // The file is only a single chunk, and the data size does not fit

        return false;
      }
    }

    return true;
  }
  private async getAllChunkPath(identifier: string) {
    const files = (await fs.promises.readdir(this.temporaryFolder)).filter(
      (name) => {
        return name.indexOf(identifier) > 0;
      }
    );
    return files.map((file) => this.temporaryFolder + "/" + file);
  }
  // 进行秒传和断点续传测试
  async get(query: ParsedUrlQuery): Promise<{
    uploaded: number[];
    skip: boolean;
  }> {
    return new Promise(async (resolve) => {
      let {
        chunkNumber,
        chunkSize,
        totalSize,
        identifier,
        filename,
        totalChunks,
      } = query as Record<string, string>;
      //  传递少了变量会catch 报错
      const isValid = this.validateRequest(
        parseInt(chunkNumber),
        parseInt(chunkSize),
        parseInt(totalSize),
        identifier,
        filename
      );
      if (isValid) {
        // 秒传验证
        const res = await uploadService.queryFile(identifier);
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
            const files = (
              await fs.promises.readdir(this.temporaryFolder + "/" + identifier)
            ).filter((name) => {
              return name.indexOf(identifier) > 0;
            });
            // 切片排序
            files.sort((pre: string, next: string) => {
              const preIndex = parseInt(pre.slice(pre.lastIndexOf(".") + 1));
              const nextIndex = parseInt(next.slice(next.lastIndexOf(".") + 1));
              return preIndex - nextIndex;
            });
            // 已经上传的切片
            const uploaded = files.map((file) =>
              parseInt(file.slice(file.lastIndexOf(".") + 1))
            );
            resolve({
              skip: false,
              uploaded,
            });
          } else {
            resolve({
              uploaded: [],
              skip: false,
            });
          }
        }
      } else {
        resolve({
          uploaded: [],
          skip: false,
        });
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
      const realIdentifier = this.cleanIdentifier(identifier);
      const file = (ctx.files as multer.File[])[0];
      const original_filename = file.originalname;
      const isValid = this.validateRequest(
        chunkNumber,
        chunkSize,
        totalSize,
        realIdentifier,
        filename,
        file.size
      );
      if (isValid) {
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
      } else {
        resolve({
          status: "请求参数验证失败",
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
        const files = (await fs.promises.readdir(this.temporaryFolder)).filter(
          (name) => {
            return name.indexOf(identifier) > 0;
          }
        );
        // 切片排序
        files.sort((pre: string, next: string) => {
          const preIndex = parseInt(pre.slice(pre.lastIndexOf(".") + 1));
          const nextIndex = parseInt(next.slice(next.lastIndexOf(".") + 1));
          return preIndex - nextIndex;
        });
        // 切片收集
        const parts = [];
        for (const file of files) {
          const part = await fs.promises.readFile(
            this.temporaryFolder + "/" + file
          );
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
      resolve(false);
    });
  }
  removeAllChunks(identifier: string) {
    fs.rmSync(this.temporaryFolder + "/" + identifier, {
      recursive: true,
      force: true,
    });
  }
}
