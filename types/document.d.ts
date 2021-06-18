interface GetRes {
    data: any[];
    requestId: string;
    total: number;
    limit: number;
    offset: number;
}
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
    get(callback?: any): Promise<GetRes>;
    field(projection: Object): DocumentReference;
}
export {};
