declare class Mutex<T> {
    maxAccesses: number;
    private currentAccesses;
    private locks;
    readonly content: T;
    constructor(content: T, maxAccesses?: number);
    lock(): Promise<{
        content: T;
        unlock: () => void;
    }>;
    private processLock;
}
export default Mutex;
