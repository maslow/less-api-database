import { GetRes } from './result-types';
export declare class DocumentReference {
    readonly id: string | number;
    readonly projection: Object;
    get primaryKey(): string;
    set(data: Object, callback?: any): Promise<{
        updated: number;
        matched: number;
        upsertedId: number;
        requestId: string;
    } | {
        code: string;
        error: string;
    }>;
    update(data: Object, callback?: any): Promise<{
        updated: number;
        matched: number;
        upsertedId: number;
        requestId: string;
        ok: boolean;
    } | {
        code: string;
        error: string;
    }>;
    remove(callback?: any): Promise<{
        deleted: number;
        requestId: string;
    }>;
    get<T = any>(callback?: any): Promise<GetRes<T>>;
    field(projection: Object): DocumentReference;
}
