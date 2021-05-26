declare type Lock = {
  unlockPromise: Promise<void>;
  lock: () => void;
};
declare class Mutex<T> {
  maxAccesses: number;
  private currentAccesses;
  private locks;
  private content;
  constructor(content: T, maxAccesses?: number);
  lock(): Promise<{
    content: T;
    unlock: () => void;
  }>;
  processLock(lock: Lock): Promise<void>;
}
export default Mutex;
