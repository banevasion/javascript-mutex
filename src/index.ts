type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};

type Content<T> = T extends object ? ReadonlyDeep<T> : T;

export type Lock = {
  unlockPromise: Promise<void>;
  lock: () => void;
};

export type LockGuard<T> = {
  content: T;
  unlock: () => void;
  unlockPromise: Promise<void>;
};

class Mutex<T> {
  maxAccesses: number;
  private currentAccesses: number;

  private locks: Array<Lock>;

  private contentWrap: { content: Content<T> };

  constructor(content: Content<T>, maxAccesses: number = 1) {
    this.contentWrap = { content };
    this.maxAccesses = maxAccesses;
    this.locks = [];
    this.currentAccesses = 0;
  }

  async lock(): Promise<LockGuard<T>> {
    var lock = () => {};
    const lockPromise = new Promise<void>((resolve) => (lock = resolve));

    var unlock = () => {};
    const unlockPromise = new Promise<void>((resolve) => (unlock = resolve));

    const lockObject = {
      lock,
      unlockPromise,
    };

    this.locks.push(lockObject);

    this.processLock(lockObject);

    await lockPromise;

    return Object.assign(this.contentWrap as { content: T }, {
      unlock,
      unlockPromise,
    });
  }

  isLocked() {
    return this.currentAccesses >= this.maxAccesses;
  }

  readLock() {
    return this.contentWrap;
  }

  async awaitLockRelease() {
    return Promise.race(this.locks.map((lock) => lock.unlockPromise));
  }

  private async processLock(lock: Lock) {
    if (this.currentAccesses >= this.maxAccesses) {
      while (this.locks[this.maxAccesses - 1] !== lock) {
        await Promise.race(this.locks.map((lock) => lock.unlockPromise));
      }
    }

    this.currentAccesses++;

    lock.lock();

    await lock.unlockPromise;

    this.locks.splice(this.locks.indexOf(lock), 1);

    this.currentAccesses--;
  }
}

export default Mutex;
