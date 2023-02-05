const timeout = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve("只等5秒");
  }, 500);
});

describe("rxjs", () => {
  beforeEach(async () => {
    // await new Config().Load();
  });
  afterEach(() => {
    // runs after each test in this block
  });

  it("test", async () => {
    // let result = await new BaseIORedis(Config.rediscache).Subscribe2(
    //   "+switch-master"
    // );
    // assert.equal(result, "PONG", "不能否ping通redis或者sentinel");
  });
  // it("通过接口更新redis2的dns记录", async () => {
  //   let result = await new SwitchDNSRecord().Switch({
  //     apikey: Config.apiKey,
  //     apisecret: Config.apiSecret,
  //     domainname: Config.redisdomain,
  //     ip: "162.14.120.141",
  //   });
  //   assert.equal(result, true, "更新dns记录失败");
  // });
});
