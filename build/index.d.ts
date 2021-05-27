declare type ReadonlyDeep<T> = {
    readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};
declare class Mutex<T> {
    maxAccesses: number;
    private currentAccesses;
    private locks;
    readonly content: ReadonlyDeep<T>;
    constructor(content: T, maxAccesses?: number);
    lock(): Promise<{
        content: ReadonlyDeep<T>;
        unlock: () => void;
    }>;
    private processLock;
}
export default Mutex;
