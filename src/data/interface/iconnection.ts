export interface IConnection<C> {
    //name: string;
    //age: number;
    execute<T>(cb: (client: C) => Promise<T>): Promise<T>
    //error(msg: string): void;
    //use(x: number, y: number): number;
    //use(x: number, y: number): number;
}
export interface IRedisOption {
    nodes: IRedisNode[];
    redisname: string;
    password?: string;
    name: string,
    db?: number;
    role?: 'master' | 'slave';
    keyPrefix?: string;
    //use(x: number, y: number): number;
    //use(x: number, y: number): number;
}
export interface IRedisNode {
    host: string;
    port: number;
}
export interface Result {
    Error: string;
    Data: any;
    Result: boolean;
    ErrorType: number;
}

export interface QueryResult<T> {
    Total: number;
    TotalPage: number;
    Data: T[];
}

export interface BaseQueryParam {
    page: number;
    size: number;
}