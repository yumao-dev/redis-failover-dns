import { HttpHelper, LogHelper } from "yanyu-helper";
import { Config } from "../config/config";
import { AliDDNS } from "./entity/aliddns";

export class SwitchDNSRecord {
  private log = LogHelper.create();
  private errortitle: string = this.constructor.name;

  constructor() {}
  public async Switch(params: AliDDNS) {
    let searchparams = new URLSearchParams(
      params as unknown as Record<string, string>
    );
    let url = `${Config.aliddnsapi}?${searchparams.toString()}`;
    return await HttpHelper.Get<string>(url).catch((err) => {
      this.log.write(err, "Error", this.errortitle);
      return `更新dnsRecord异常，${url}`;
    });
  }
}
