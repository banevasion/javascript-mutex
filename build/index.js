"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Mutex {
    constructor(content, maxAccesses = 0) {
        this.content = content;
        this.maxAccesses = maxAccesses;
        this.locks = [];
        this.currentAccesses = 0;
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            var lock = () => { };
            const lockPromise = new Promise((resolve) => (lock = resolve));
            var unlock = () => { };
            const unlockPromise = new Promise((resolve) => (unlock = resolve));
            const lockObject = {
                lock,
                unlockPromise,
            };
            this.locks.push(lockObject);
            this.processLock(lockObject);
            yield lockPromise;
            return { content: this.content, unlock };
        });
    }
    processLock(lock) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentAccesses >= this.maxAccesses) {
                while (this.locks[this.maxAccesses - 1] !== lock) {
                    yield Promise.race(this.locks.map((lock) => lock.unlockPromise));
                }
            }
            this.currentAccesses++;
            lock.lock();
            yield lock.unlockPromise;
            this.locks.splice(this.locks.indexOf(lock), 1);
            this.currentAccesses--;
        });
    }
}
exports.default = Mutex;
