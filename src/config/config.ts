import { ConfigHelper, Level, LogHelper } from "helper";
export class Config {
  // public static readonly client = { name: "cid" }; //取其中的值用作pv的参数
  // public static readonly token = { name: "token" };//取其中的值用作uv的参数，进一步取userid作为其他参数值 visiter才是记录访问日志，log只是记录日志两者分开

  public static get isDebug() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === "debug";
  }
  public static readonly configurl =
    "http://config.yumao.tech/api/startconfig/server";

  //网络配置
  public static rediscache: any;

  //自定义配置
  public static appkey = ""; //预留 也许用来作为jwt中加密的sercrt
  public static redisdomain: string;
  public static apiKey: string;
  public static apiSecret: string;
  public static mastername: string;

  //基础配置 这些默认值都是无效的只是给看一下具体的类型
  public static loglevel: Level | undefined = Level.INFO;
  public static jwtoption = { expiresIn: "7d", secret: "", authname: "token" };
  public static clientidname = "cid";
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
