import * as IORedis from "ioredis";
import { IConnection, IRedisOption } from "./iconnection";

export class RedisCommand implements IConnection<IORedis.Redis> {
  constructor(private config: IRedisOption) {
    if (!config) throw new Error("配置不能为null");
  }

  //执行主入口 这个是关闭连接
  public execute<T>(cb: (client: IORedis.Redis) => Promise<T>): Promise<T> {
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
  private static clientmaps: Map<IRedisOption, IORedis.Redis> = new Map();
  //执行主入口 这个是关闭连接
  public static GetClient(config: IRedisOption): Promise<IORedis.Redis> {
    return new Promise<IORedis.Redis>((resolve, reject) => {
      if (!config) reject(new Error("配置不能为null"));
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
        client = new IORedis.Redis({
          sentinels: config.nodes,
          name: config.name,
          db: config.db,
          role: config.role,
          password: config.password,
          retryStrategy: (times) => {
            var delay = Math.min(times * 50, 2000);
            return delay;
          },
          reconnectOnError: (err) => {
            console.log(err);
            return false;
          },
        }).on("error", (err) => {
          reject(err);
        });
        this.clientmaps.set(config, client);
      }
      resolve(client);
    });
  }
}
