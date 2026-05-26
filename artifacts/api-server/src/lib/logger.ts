type LogObj = Record<string, unknown> | unknown;

export const logger = {
  info(obj: LogObj, msg?: string) {
    console.log(msg ?? "", obj);
  },
  warn(obj: LogObj, msg?: string) {
    console.warn(msg ?? "", obj);
  },
  error(obj: LogObj, msg?: string) {
    console.error(msg ?? "", obj);
  },
};
