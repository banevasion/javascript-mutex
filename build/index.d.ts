declare type ReadonlyDeep<T> = {
    readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};
declare type Content<T> = T extends object ? ReadonlyDeep<T> : T;
export declare type Lock = {
    unlockPromise: Promise<void>;
    lock: () => void;
};
export declare type LockGuard<T> = {
    content: T;
    unlock: () => void;
};
declare class Mutex<T> {
    maxAccesses: number;
    private currentAccesses;
    private locks;
    private contentWrap;
    constructor(content: Content<T>, maxAccesses?: number);
    lock(): Promise<LockGuard<T>>;
    isLocked(): Promise<boolean>;
    get content(): Content<T>;
    private processLock;
}
export default Mutex;
