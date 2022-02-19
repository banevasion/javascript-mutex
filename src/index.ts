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
    let lockObject: any = {};

    var unlock = () => {};
    const unlockPromise = new Promise<void>(
      (resolve) =>
        (unlock = () => {
          this.locks.splice(this.locks.indexOf(lockObject), 1);
          this.currentAccesses--;
          resolve();
        })
    );

    this.locks.push(lockObject);

    if (this.isLocked) {
      while (this.locks[this.maxAccesses - 1] !== lockObject) {
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

  awaitLockRelease() {
    return Promise.race(this.locks.map((lock) => lock.unlockPromise));
  }
}

export default Mutex;
