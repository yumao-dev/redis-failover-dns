import { Observable, of } from "rxjs";
import { concatMap } from "rxjs/operators";
import { Config } from "../config/config";
import { ListRedis, StrRedis } from "../data/commonredis";
import { PushMsgDB } from "../data/pushmsgdb";
import { HttpHelper } from "../helper/httphelper";
import { CacheToDB } from "./ijob/icachetodb";

const key = "message";
const redisdb = 5;
const msgdb = "YumaoMessage";
export class SendMsg extends CacheToDB {
  public GetItem = () => {
    return new Observable<string>((sub) => {
      new ListRedis(Config.rediscache)
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
    return new ListRedis(Config.rediscache).SetList(key, true, item);
  };

  public Process = (m_item: string) => {
    return of(m_item).pipe(
      concatMap(async (item) => {
        let entity = JSON.parse(item) as SengMsgEntity;

        //读取webhook
        let webhook = await this.getWebhook(entity.code);
        if (!webhook) {
          // throw new Error(`转换失败`);
          await this.log.write(item, "Warring", this.errortitle);
          return true;
        }
        entity.webhook = webhook!;
        //发送
        return await this.Send(entity);
      })
    );
  };

  private async getWebhook(code: string) {
    let redis = new StrRedis({ ...Config.rediscache, db: redisdb });
    let webhook: string | null | undefined = await redis.Get(code);
    if (!webhook) {
      //从数据库中读取
      webhook = await new PushMsgDB({ ...Config.errordb, database: msgdb }).Get(
        code
      );
      //写入redis
      if (webhook) {
        let result = await redis.Set(code, webhook);
        //缓存3分钟
        if (result) {
          result = await redis.Expire(code, 120);
        }
        if (!result) {
          //日志
          await this.log.write(
            "webhook配置地址写缓存失败",
            "Warring",
            this.errortitle
          );
        }
      }
    }
    return webhook;
  }

  private async Send(entity: SengMsgEntity) {
    // markdown
    let result = await HttpHelper.POST<SengMsgResult>(entity.webhook, {
      msgtype: "markdown",
      markdown: {
        content: entity.msg,
      },
    });
    if (result.errcode != 0) {
      throw new Error(result.errmsg);
    }
    return true;
  }
}

interface SengMsgEntity {
  code: string;
  msg: string;
  webhook: string;
}

interface SengMsgResult {
  errcode: number;
  errmsg: string;
}
