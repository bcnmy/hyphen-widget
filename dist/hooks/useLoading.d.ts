export declare enum Status {
    IDLE = "idle",
    PENDING = "pending",
    SUCCESS = "success",
    ERROR = "error"
}
declare type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;
export default function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>): {
    value: T | undefined;
    error: undefined | Error;
    status: Status;
    execute: ReplaceReturnType<typeof asyncFunction, Promise<void>>;
};
export {};
//# sourceMappingURL=useLoading.d.ts.map