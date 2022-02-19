type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};

type Content<T> = T extends object ? ReadonlyDeep<T> : T;

export type LockGuard<T> = {
  content: T;
  unlock: () => void;
  unlockPromise: Promise<void>;
};

class Mutex<T> {
  maxAccesses: number;
  private currentAccesses: number;

  private locks: Array<Promise<void>>;

  private contentWrap: { content: Content<T> };

  constructor(content: Content<T>, maxAccesses: number = 1) {
    this.contentWrap = { content };
    this.maxAccesses = maxAccesses;
    this.locks = [];
    this.currentAccesses = 0;
  }

  async lock(): Promise<LockGuard<T>> {
    var unlock = () => {};
    const unlockPromise = new Promise<void>((resolve) => {
      unlock = () => {
        this.locks.splice(this.locks.indexOf(unlockPromise), 1);
        this.currentAccesses--;
        resolve();
      };
    });

    this.locks.push(unlockPromise);

    if (this.isLocked) {
      while (this.locks[this.maxAccesses - 1] !== unlockPromise) {
        await this.awaitLockRelease();
      }
    }

    this.currentAccesses++;

    return Object.assign(this.contentWrap as { content: T }, {
      unlock,
      unlockPromise,
    });
  }

  get isLocked() {
    return this.currentAccesses >= this.maxAccesses;
  }

  readLock() {
    return this.contentWrap;
  }

  async awaitLockRelease() {
    if (this.locks.length) {
      await Promise.race(this.locks);
    }
  }
}

export default Mutex;
