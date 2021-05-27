declare type ReadonlyDeep<T> = {
    readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};
declare type Content<T> = T extends object ? ReadonlyDeep<T> : T;
declare class Mutex<T> {
    maxAccesses: number;
    private currentAccesses;
    private locks;
    readonly content: Content<T>;
    constructor(content: Content<T>, maxAccesses?: number);
    lock(): Promise<{
        content: T;
        unlock: () => void;
    }>;
    private processLock;
}
export default Mutex;
