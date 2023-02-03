import { LogHelper } from "helper";
import { from } from "rxjs";
import { concatMap } from "rxjs/operators";
import { Config } from "../config/config";
import { BaseIORedis } from "../data/baseredis";
import { SwitchDNSRecord } from "../data/switchdns";

const key = "+switch-master";
export class SentinelSwitchDNS {
  protected log = LogHelper.create();
  public errortitle: string = this.constructor.name;

  protected event = () => {
    return from(
      new BaseIORedis(Config.rediscache).Subscribe(key, Config.mastername)
    );
  };

  public Start = () => {
    this.event()
      .pipe(
        // concatMap((a) => {
        //   return new BaseIORedis(Config.rediscache).Message(key);
        // }),
        concatMap((a) => {
          return this.Switch(a);
        })
      )
      .subscribe({
        next: (r) => {
          this.log.write("执行结果" + r, "INFO", this.errortitle);
        },
        error: (err) => {
          this.log.write(err, "Error", this.errortitle);
        },
        complete: () => {
          //再次订阅
          this.log.write("订阅执行完毕，关闭订阅任务", "INFO", this.errortitle);
        },
      });

    this.log.write(`启动成功`, "Warring", this.errortitle);
  };
  public Switch = (item: string | unknown) => {
    // 订阅后执行的事件内容  切换DNS
    console.log(item);
    return new SwitchDNSRecord().Switch({
      apikey: Config.apiKey,
      apisecret: Config.apiSecret,
      domainname: Config.redisdomain,
      ip: item as string,
    });
  };
}
