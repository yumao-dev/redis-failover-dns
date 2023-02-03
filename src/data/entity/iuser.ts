export interface IUser {
    name: string;
    code: string;
    userid: number;
    nickname: string;
}

export interface IGrantUser {
    code: string;
    userid: number;
    nickname: string;
    token: string;
    mobile?: string
}

export interface ICacheUser  extends IUser {
    //public verifycode: string, public verifyvalue: string, 
    token: string;
    usergroup?: string[]; //用户组
    cachetype: 'u000' | 'u001'; //缓存类型  u000：正常登录用户，u001：找回密码用户--还没提交到服务器

    password: string;
    ip: string;
    time: number;
    source: string;
    lastip: string;
    lasttime: number;
    lastsource: string

}