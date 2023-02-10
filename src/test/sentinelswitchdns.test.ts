import assert from "assert";
import { Config } from "../config/config";
import { BaseIORedis } from "../data/baseredis";
import { SwitchDNSRecord } from "../data/switchdns";
const timeout = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve("只等5秒");
  }, 500);
});

describe("redis-sentinel主从切换自动更新redis2的dnsrecord", () => {
  before(async () => {
    await new Config().Load();
  });

  it("监听sentinel切换事件", async () => {
    //由于监听redis的事件 不能断开sentinel连接
    //但是不断开连接此处程序会一直处于挂起状态，导致此测试不能正常完成关闭
    //所以忽略此测试

    //只是测试redis能否ping通
    let result = await new BaseIORedis(Config.rediscache).Subscribe2(
      "+switch-master"
    );
    assert.equal(result, "PONG", "不能否ping通redis或者sentinel");
  });
  it("通过接口更新redis2的dns记录", async () => {
    let result = await new SwitchDNSRecord().Switch({
      apikey: Config.apiKey,
      apisecret: Config.apiSecret,
      domainname: Config.redisdomain,
      ip: "162.14.120.141",
      t: Date.now(),
    });
    assert.equal(result, true, "更新dns记录失败");
  });
});
