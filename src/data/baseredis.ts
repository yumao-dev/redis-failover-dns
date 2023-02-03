import { RedisCommand as IORedisCommand } from "./interface/iorediscommand2";
export * from "./interface/iconnection";

//redis基础方法
export class BaseIORedis {
  protected _source: string = "baseredis";
  protected get _rediscommand(): IORedisCommand {
    return new IORedisCommand(this.config);
  }

  constructor(protected config: any, source?: string) {
    // this._rediscommand = new RedisCommand(config);
    if (source && source.length > 0) this._source = source;
  }

  public async Subscribe(...args: string[]) {
    return await this._rediscommand.execute((client) => {
      // return client.subscribe(...args);

      return new Promise<string>((resolve, reject) => {
        client
          .on("message", (channel, msg) => {
            try {
              let msgs = (msg as string).split(" ");
              if (msgs.length > 4) {
                resolve(msgs[3]);
              } else {
                reject(new Error(`消息不正确：${channel}，${msg}`));
              }
            } catch (error) {
              reject(
                new Error(
                  `异常的消息：${channel}，${msg}，${JSON.stringify(error)}`
                )
              );
            }
          })
          .subscribe(...args);
      });
    });
  }
  public async Message(chanel: string) {
    return await this._rediscommand.execute((client) => {
      return new Promise((resolve, reject) => {
        client.on(chanel, (msg) => {
          resolve(msg);
        });
      });
    });
  }
}
