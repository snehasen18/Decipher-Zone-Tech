class AsyncQueue {
    constructor({
        emitter,
        delayMs = 1000,
        maxRetries = 3,
        maxQueueSize = Infinity,
        autoStart = false
    } = {}) {
        this.emitter = emitter || new EventEmitter();
        this._tasks = [];
        this._current = null;
        this.delayMs = delayMs;
        this.maxRetries = maxRetries;
        this.maxQueueSize = maxQueueSize;
        this.autoStart = autoStart;
        this._running = false;
        this._paused = false;
        this._inCooldown = false;
        this._nextId = 1;
        this.completedCount = 0;
        this.failedCount = 0;
        this.totalCreated = 0;
        this._worker = this._worker.bind(this);
    }
    add(taskFn, meta = {}) {
        if (typeof taskFn !== "function") {
            throw new TypeError(
                "Task must be a function."
            );
        }
        if (
            this._tasks.length >=
            this.maxQueueSize
        ) {
            const err = new Error(
                `Queue limit (${this.maxQueueSize}) reached.`
            );
            this.emitter.emit(
                "queueError",
                {
                    error: err
                }
            );
            throw err;
        }
        const id = this._nextId++;
        this.totalCreated++;
        const task = {
            id,
            name:
                meta.name ||
                `Task #${id}`,
            fn: taskFn,
            meta,
            attempts: 0,
            createdAt: new Date(),
            status: "pending",
            promise: null
        };
        this._tasks.push(task);
        task.promise = new Promise(
            (resolve, reject) => {
                task._resolve = resolve;
                task._reject = reject;
            }
        );
        this.emitter.emit(
            "taskAdded",
            {
                queue: this,
                task,
                snapshot:
                    this._snapshot(task)
            }
        );
        if (this.autoStart &&  !this._running) {
            this.start();
        }
        return task;
    }
    get size() {
        return this._tasks.length;
    }
    get isRunning() {
        return this._running;
    }
    get isPaused() {
        return this._paused;
    }
    get currentTask() {
        return this._current;
    }
    start() {
        if (this._running) return;
        if (this._tasks.length === 0) return;
        this._running = true;
        this._paused = false;
        this.emitter.emit("queueStarted", {
            running: true,
            pending: this._tasks.length
        });
        queueMicrotask(this._worker);
    }
    pause() {
        if (!this._running || this._paused) {
            return;
        }
        this._paused = true;
        this.emitter.emit("queuePaused", {
            running: false
        });
    }
    resume() {
        if (!this._paused) return;
        this._paused = false;
        this.emitter.emit("queueResumed", {
            running: true,
            pending: this._tasks.length
        });
        if (
            this._running &&
            !this._current
        ) {
            queueMicrotask(this._worker);
        }
    }
    remove(id) {
        const index = this._tasks.findIndex(
            task => task.id === id
        );
        if (index === -1) {
            return null;
        }
        const [task] = this._tasks.splice(
            index,
            1
        );
        task.status = "removed";
        task._resolve({
            removed: true,
            task
        });
        this.emitter.emit(
            "taskRemoved",
            {
                task,
                snapshot: this._snapshot(
                    task,
                    {
                        removed: true
                    }
                )
            }
        );
        if (
            this._tasks.length === 0 &&
            this._running &&
            !this._current
        ) {
            this._finishDrain();
        }
        return task;
    }
    clear() {
        const removed = this._tasks.splice(
            0,
            this._tasks.length
        );
        for (const task of removed) {
            task.status = "removed";
            task._resolve({
                removed: true,
                task
            });
        }
        this.emitter.emit(
            "queueCleared",
            {
                removed: removed.length
            }
        );
        return removed.length;
    }
    async _worker() {
        while (this._running) {
            if (this._paused) return;
            if (this._tasks.length === 0) {
                this._finishDrain();
                return;
            }
            const task = this._tasks[0];
            /* Rate Limiting */
            if (this._inCooldown) {
                await this._sleep(this.delayMs);
                this._inCooldown = false;
                if (this._paused || !this._running) {
                    continue;
                }
            }
            if (!this._tasks.includes(task)) {
                continue;
            }
            this._tasks.shift();
            this._current = task;
            try {
                const result = await this._runWithRetry(task);
                task.status = "success";
                this.completedCount++;
                this.emitter.emit(
                    "taskCompleted",
                    {
                        task,
                        result,
                        snapshot: this._snapshot(task)
                    }
                );
                task._resolve({
                    result,
                    task
                });
            }
            catch (error) {
                task.status = "failed";
                this.failedCount++;
                this.emitter.emit(
                    "taskFailed",
                    {
                        task,
                        error,
                        snapshot: this._snapshot(task)
                    }
                );
                task._reject(error);
            }
            finally {
                this._current = null;
                this._inCooldown = true;
            }
        }
    }
    async _runWithRetry(task) {
        let lastError;
        while (true) {
            task.attempts++;
            task.status =
                task.attempts === 1
                    ? "running"
                    : "retrying";
            this.emitter.emit(
                "taskStarted",
                {
                    task,
                    attempt: task.attempts,
                    snapshot: this._snapshot(task)
                }
            );
            try {
                return await task.fn();
            }
            catch (error) {
                lastError = error;
                if (
                    task.attempts >=
                    this.maxRetries
                ) {
                    throw lastError;
                }
                this.emitter.emit(
                    "taskRetry",
                    {
                        task,
                        attempt: task.attempts,
                        error,
                        snapshot: this._snapshot(task)
                    }
                );
                const backoff = Math.min(
                    600 *
                    Math.pow(
                        2,
                        task.attempts - 1
                    ),
                    5000
                );
                await this._sleep(backoff);
            }
        }
    }
    _finishDrain() {
        this._running = false;
        this._paused = false;
        this._current = null;
        this._inCooldown = false;
        this.emitter.emit(
            "queueDrained",
            {
                running: false,
                completed: this.completedCount,
                failed: this.failedCount
            }
        );
    }
    _sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    _snapshot(task, extra = {}) {
        return {
            id: task.id,
            name: task.name,
            status: task.status,
            attempts: task.attempts,
            meta: {
                ...task.meta
            },
            createdAt: task.createdAt,
            ...extra
        };
    }
}