import { ConfigHelper, Level, LogHelper } from "yanyu-helper";
export class Config {
  //网络配置
  public static rediscache: any;
  public static redisdomain: string;
  public static apiKey: string;
  public static apiSecret: string;
  public static mastername: string;
  public static aliddnsapi: string;

  //基础配置 这些默认值都是无效的只是给看一下具体的类型
  public static loglevel: Level;
  public static jwtoption: any;
  public static clientidname: string;
  public static openpms: boolean;
  public static logurl: string;
  public static pmsurl: string;

  public async Load() {
    await LogHelper.create().write("读取配置", "INFO", "提示");
    return await ConfigHelper.Config().then((result) => {
      //写进config
      Config.rediscache = result.rediscache;
      Config.redisdomain = result.redisdomain;
      Config.apiKey = result.apiKey;
      Config.apiSecret = result.apiSecret;
      Config.mastername = result.mastername;
      Config.aliddnsapi = result.aliddnsapi;

      //基础配置
      Config.clientidname = result.clientidname;
      Config.jwtoption = result.jwtoption;
      Config.openpms = result.openpms;
      Config.logurl = result.logurl;
      Config.pmsurl = result.pmsurl;
      if (result.loglevel) {
        Config.loglevel = result.loglevel;
      }

      if (
        !Config.rediscache ||
        !Config.apiKey ||
        !Config.apiSecret ||
        !Config.mastername ||
        !Config.redisdomain
      ) {
        throw new Error("配置有误请检查");
      }
      return true;
    });
  }
}
