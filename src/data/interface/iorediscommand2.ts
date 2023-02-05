// import * as IORedis from "ioredis";
import Redis, { RedisOptions } from "ioredis";
import { IConnection } from "./iconnection";

export class RedisCommand implements IConnection<Redis> {
  constructor(private config: RedisOptions) {
    if (!config) throw new Error("配置不能为null");
  }

  //执行主入口 这个是关闭连接
  public execute<T>(cb: (client: Redis) => Promise<T>): Promise<T> {
    return RedisClients.GetClient(this.config).then(cb);
    // return from(this.pool.acquire()).pipe(
    //     concatMap(client => {
    //         return cb(client).pipe(
    //             map(result => {
    //                 this.pool.release(client);
    //                 return result;
    //             }), catchError(err => {
    //                 this.pool.release(client);
    //                 return throwError(()=>err);
    //             }));
    //     }),
    //     // finalize(() => {
    //     //     RedisCommand.pool.release(client);
    //     // })
    // );
    // return from(RedisCommand.pool.use(fn)).pipe(concatMap(a => {
    //     return a;
    // }));
  }
}

export class RedisClients {
  private static clientmaps: Map<any, Redis> = new Map();

  public static GetClient(config: RedisOptions): Promise<Redis> {
    if (!config) throw new Error("配置不能为null");
    let client = this.clientmaps.get(config);
    if (!client) {
      // client = new Cluster(config.nodes, {
      //     scaleReads: 'slave',
      //     clusterRetryStrategy: (times) => {
      //         var delay = Math.min(times * 50, 2000);
      //         return delay;
      //     },
      //     redisOptions: { db: config.db }
      // })
      client = new Redis({
        lazyConnect: true,
        port: config.port,
        host: config.host,
        name: config.name,
        retryStrategy: (times) => {
          var delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          console.log(err);
          return false;
        },
      });
      // client.connect(() => {
      //   this.clientmaps.set(config, client!);
      // });
      // this.clientmaps.set(config, client!);
    }

    return Promise.resolve(client);
  }
}
