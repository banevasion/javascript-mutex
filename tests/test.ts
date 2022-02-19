import Mutex from "../src";

const mutex = new Mutex(null, 1);

(async () => {
  while (true) {
    const lock = await mutex.lock();

    if (mutex.isLocked) {
      setTimeout(() => lock.unlock());
      await mutex.awaitLockRelease();
    }
  }
})();
