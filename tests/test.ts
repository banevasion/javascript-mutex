import Mutex from "../src";

const mutex = new Mutex(0);

(async () => {
  const lock = await mutex.lock();

  lock.content = 1;

  lock.unlock();

  const second = await mutex.lock();

  console.log(second.content);
})();
