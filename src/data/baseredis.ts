import { fromEvent, map } from "rxjs";
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
  public Subscribe2 = (...args: string[]) => {
    return this._rediscommand.execute((client) => {
      return client.ping().finally(() => {
        //关闭连接
        client.disconnect();
      });
    });
  };

  public Subscribe(...args: string[]) {
    return this._rediscommand.execute((client) => {
      let obs = fromEvent<string[]>(client, "message", (...args: any[]) => {
        return args as string[];
      }).pipe(
        map(([channel, msg]) => {
          try {
            let msgs = (msg as string).split(" ");
            if (msgs.length > 4) {
              return msgs[3];
            } else {
              throw new Error(`消息不正确：${channel}，${msg}`);
            }
          } catch (error) {
            throw new Error(
              `格式化消息异常：${channel}，${msg}，${JSON.stringify(error)}`
            );
          }
        })
      );
      return client.subscribe(...args).then((r) => {
        return obs;
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
