type Lock = {
  unlockPromise: Promise<void>;
  lock: () => void;
};

class Mutex {
  maxAccesses: number;
  private currentAccesses: number;

  private locks: Array<Lock>;

  private content: any;

  constructor(content: any, maxAccesses: number = 0) {
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

  async processLock(lock: Lock) {
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
