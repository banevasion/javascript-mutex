type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};

type Content<T> = T extends object ? ReadonlyDeep<T> : T;

type Lock = {
  unlockPromise: Promise<void>;
  lock: () => void;
};

class Mutex<T> {
  maxAccesses: number;
  private currentAccesses: number;

  private locks: Array<Lock>;

  readonly content: Content<T>;

  constructor(content: Content<T>, maxAccesses: number = 0) {
    this.content = content;
    this.maxAccesses = maxAccesses;
    this.locks = [];
    this.currentAccesses = 0;
  }

  async lock() {
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

    return { content: this.content, unlock };
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
