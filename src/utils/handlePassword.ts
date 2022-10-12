import crypto from "crypto";
export const md5Password = (password: string) => {
  const md5 = crypto.createHash("md5");
  const result = md5.update(password).digest("hex");
  return result;
};
