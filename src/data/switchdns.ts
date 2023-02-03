import { HttpHelper } from "helper";
import { AliDDNS } from "./entity/aliddns";
const url = "";

export class SwitchDNSRecord {
  constructor() {}
  public async Switch(params: AliDDNS) {
    return HttpHelper.Request<string>(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charst=utf-8",
        },
      },
      JSON.stringify(params)
    );
  }
}
