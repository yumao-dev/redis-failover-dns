import { Observable, of } from "rxjs";
import { concatMap } from "rxjs/operators";
import { Config } from "../config/config";
import { StrRedis } from "../data/commonredis";
import { LogDB, LogEntity } from "../data/loddb";
import { CacheToDB } from "./ijob/icachetodb";

const key = "errorlog";
export class ErrorToDB extends CacheToDB {
  public GetItem = () => {
    //必须这样写，不然会重复读物第一条数据，也许有其他解决办法
    return new Observable<string>((sub) => {
      new StrRedis(Config.rediscache)
        .GetFirstOfList(key)
        .then(
          (item) => {
            sub.next(item);
          },
          (err) => {
            sub.error(err);
          }
        )
        .finally(() => {
          sub.complete();
        });
    });
  };

  public SetItem = (item: string) => {
    return new StrRedis(Config.rediscache).SetList(key, true, item);
  };
  public Process = (m_item: string) => {
    return of(m_item).pipe(
      concatMap(async (item) => {
        let log = JSON.parse(item) as LogEntity;
        if (!log.content) {
          // throw new Error(`转换失败`);
          await this.log.write(item, "Warring", this.errortitle);
          return true;
        }
        //判断log各个属性类型是否正确

        if (!Date.parse(log.time as any)) {
          await this.log.write(
            `${this.errortitle}时间格式异常，time为：${log.time}`,
            "Warring",
            this.errortitle
          );
          log.time = new Date();
        }
        return await new LogDB(Config.errordb).Add(log);
      })
    );
  };
}
