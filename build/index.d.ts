declare type ReadonlyDeep<T> = {
    readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};
declare type Content<T> = T extends object ? ReadonlyDeep<T> : T;
export declare type LockGuard<T> = {
    content: T;
    unlock: () => void;
    unlockPromise: Promise<void>;
};
declare class Mutex<T> {
    maxAccesses: number;
    private currentAccesses;
    private locks;
    private contentWrap;
    constructor(content: Content<T>, maxAccesses?: number);
    lock(): Promise<LockGuard<T>>;
    get isLocked(): boolean;
    readLock(): {
        content: Content<T>;
    };
    awaitLockRelease(): Promise<void> | undefined;
}
export default Mutex;
