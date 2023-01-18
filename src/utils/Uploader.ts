import multer from "@koa/multer";
import fs from "fs";
import { Context } from "koa";
import { resolve } from "path";
import { ParsedUrlQuery } from "querystring";
export class Uploader {
  temporaryFolder: string;
  fileParameterName: string;
  maxFileSize?: number;
  constructor(
    temporaryFolder: string,
    fileParameterName = "file",
    maxFileSize?: number
  ) {
    this.temporaryFolder = temporaryFolder;
    this.maxFileSize = maxFileSize;
    this.fileParameterName = fileParameterName;
    try {
      fs.mkdirSync(temporaryFolder);
    } catch (e) {}
  }
  private cleanIdentifier(identifier: string) {
    return identifier.replace(/[^0-9A-Za-z_-]/g, "");
  }
  private getChunkFilename(chunkNumber: number, identifier: string) {
    const realIdentifier = this.cleanIdentifier(identifier);
    return resolve(
      this.temporaryFolder,
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
  // 进行秒传和断点续传测试
  get(query: ParsedUrlQuery, cb: (...args: any[]) => void) {
    let { chunkNumber, chunkSize, totalSize, identifier, filename } =
      query as Record<string, string>;
    console.log(typeof chunkNumber, typeof filename, chunkNumber, filename);
    //  传递少了变量会catch 报错
    const isValid = this.validateRequest(
      parseInt(chunkNumber),
      parseInt(chunkSize),
      parseInt(totalSize),
      identifier,
      filename
    );
    if (isValid) {
      const chunkFilename = this.getChunkFilename(
        parseInt(chunkNumber),
        identifier
      );
      const isExist = fs.existsSync(chunkFilename);
      if (isExist) {
        // 秒传逻辑 断点续传逻辑
        cb("found", chunkFilename, filename, identifier);
      } else {
        cb("not-found", null, null, null);
      }
    } else {
      cb("not-found", null, null, null);
    }
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
        //  保存切片
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
  async write(
    identifier: string,
    writableStream: fs.WriteStream,
    options: Record<string, any> = { end: true }
  ) {
    const pipeChunk = async (chunkNumber: number) => {
      const chunkFilename = this.getChunkFilename(chunkNumber, identifier);
      await fs.access(chunkFilename, (err) => {
        if (!err) {
          const sourceStream = fs.createReadStream(chunkFilename);
          sourceStream.pipe(writableStream, {
            end: false,
          });
          sourceStream.on("end", () => {
            pipeChunk(chunkNumber + 1);
          });
        } else {
          //  所有切片都处理了
          if (options?.end) writableStream.end();
        }
      });
    };
    await pipeChunk(1);
  }
}
