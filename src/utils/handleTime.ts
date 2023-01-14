import dayjs from "dayjs";

export const time = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};
