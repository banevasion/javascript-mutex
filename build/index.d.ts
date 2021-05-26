declare type Lock = {
    unlockPromise: Promise<void>;
    lock: () => void;
};
declare class Mutex {
    maxAccesses: number;
    private currentAccesses;
    private locks;
    private content;
    constructor(content: any, maxAccesses?: number);
    lock(): Promise<{
        content: any;
        unlock: () => void;
    }>;
    processLock(lock: Lock): Promise<void>;
}
export default Mutex;
