import { LogHelper } from "yanyu-helper";
import { Config } from "./config/config";
import { SentinelSwitchDNS } from "./job/sentinelswitchdns";

//读取远程配置
new Config()
  .Load()
  .then((a) => {
    //开启任务
    return new SentinelSwitchDNS().Start();
  })
  .catch((err) => {
    console.error(err);
    LogHelper.create().write(err, "Error", "提示1");
  });
