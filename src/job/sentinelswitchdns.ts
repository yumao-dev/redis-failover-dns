import { concatAll, from, switchMap } from "rxjs";
// import { concatAll } from "rxjs/operators";
import { LogHelper } from "yanyu-helper";
import { Config } from "../config/config";
import { BaseIORedis } from "../data/baseredis";
import { SwitchDNSRecord } from "../data/switchdns";

const key = "+switch-master";
export class SentinelSwitchDNS {
  protected log = LogHelper.create();
  public errortitle: string = this.constructor.name;

  protected event = () => {
    let obs = from(new BaseIORedis(Config.rediscache).Subscribe(key)).pipe(
      concatAll()
    );
    return obs;
  };

  public Start = () => {
    this.event()
      .pipe(switchMap(this.Switch))
      .subscribe({
        next: (r) => {
          this.log.write(`执行结果: ${r}`, "INFO", this.errortitle);
        },
        error: (err) => {
          this.log.write(err, "Error", this.errortitle);
        },
        complete: () => {
          this.log.write("订阅执行完毕", "INFO", this.errortitle);
        },
      });
    this.log.write(`启动成功`, "Warring", this.errortitle);
  };
  public Switch = (item: string | unknown) => {
    // 订阅后执行的事件内容  切换DNS
    return new SwitchDNSRecord().Switch({
      apikey: Config.apiKey,
      apisecret: Config.apiSecret,
      domainname: Config.redisdomain,
      ip: item as string,
      t: Date.now(),
    });
  };
}
