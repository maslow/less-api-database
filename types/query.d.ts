import { OrderByDirection } from './constant';
import { GetOneRes, GetRes, ErrorRes, CountRes, UpdateRes, RemoveRes } from './result-types';
declare enum JoinType {
    INNER = "inner",
    LEFT = "left",
    RIGHT = "right",
    FULL = "full"
}
interface WithParam {
    query: Query;
    localField: string;
    foreignField: string;
    as?: string;
    one?: boolean;
}
export declare class Query {
    where(query: object): Query;
    orderBy(fieldPath: string, directionStr: OrderByDirection): Query;
    join(collection: string, rightKey: string, leftKey: string, type?: JoinType): Query;
    leftJoin(collection: string, rightKey: string, leftKey: string): Query;
    rightJoin(collection: string, rightKey: string, leftKey: string): Query;
    fullJoin(collection: string, rightKey: string, leftKey: string): Query;
    innerJoin(collection: string, rightKey: string, leftKey: string): Query;
    with(param: WithParam): Query;
    withOne(param: WithParam): Query;
    field(projection: string[] | any): Query;
    limit(limit: number): Query;
    skip(offset: number): Query;
    clone(): Query;
    get<T>(options?: {
        nested?: boolean;
    }, callback?: any): Promise<GetRes<T> & ErrorRes>;
    getOne(options?: {
        nested?: boolean;
    }): Promise<GetOneRes & ErrorRes>;
    merge<T>(options?: {
        nested?: boolean;
        intersection?: boolean;
    }): Promise<GetRes<T> & ErrorRes>;
    count(callback?: any): Promise<CountRes & ErrorRes>;
    update(data: Object, options?: {
        multi: boolean;
        merge: boolean;
        upsert: boolean;
    }, callback?: any): Promise<UpdateRes & ErrorRes>;
    remove(options?: {
        multi: boolean;
    }, callback?: any): Promise<RemoveRes & ErrorRes>;
}
export {};
