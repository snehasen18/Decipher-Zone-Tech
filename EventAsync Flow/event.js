class EventEmitter {
    constructor() {
        this._listeners = new Map();
    }
    on(event, callback) {
        if (typeof event !== "string" || !event.trim()) {
            throw new TypeError(
                "Event name must be a non-empty string."
            );
        }
        if (typeof callback !== "function") {
            throw new TypeError(
                "Callback must be a function."
            );
        }
        if (!this._listeners.has(event)) {
            this._listeners.set(
                event,
                new Set()
            );
        }
        const listeners = this._listeners.get(event);
        listeners.add(callback);
        return () => {
            this.off(event, callback);
        };
    }
    off(event, callback) {
        const listeners = this._listeners.get(event);
        if (!listeners) {
            return false;
        }
        for (const fn of listeners) {
            if (fn === callback || fn.original === callback) {
                listeners.delete(fn);
                break;
            }
        }
        if (listeners.size === 0) {
            this._listeners.delete(event);
        }
        return true;
    }
    emit(event, ...args) {
        const listeners = this._listeners.get(event);
        if (!listeners || listeners.size === 0) {
            return false;
        }
        const callbacks = [...listeners];
        for (const callback of callbacks) {
            try {
                callback(...args);
            }
            catch (error) {
                console.error(
                    `Error in "${event}" listener:`,
                    error
                );
            }
        }
        return true;
    }
    once(event, callback) {
        if (typeof callback !== "function") {
            throw new TypeError(
                "Callback must be a function."
            );
        }
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        wrapper.original = callback;
        return this.on(event, wrapper);
    }
    removeAllListeners(event = null) {
        if (event === null) {
            this._listeners.clear();
            return;
        }
        this._listeners.delete(event);
    }
    listenerCount(event) {
        const listeners = this._listeners.get(event);
        return listeners ? listeners.size : 0;
    }
    eventNames() {
        return [...this._listeners.keys()];
    }
    listeners(event) {
        const listeners = this._listeners.get(event);
        return listeners ? [...listeners] : [];
    }
    hasListeners(event) {
        return this.listenerCount(event) > 0;
    }
    destroy() {
        this._listeners.clear();
        Object.freeze(this);
    }
    debug() {
        console.group("📡 EventEmitter Debug");
        for (const [event, listeners] of this._listeners) {
            console.log(
                `${event} : ${listeners.size} listener(s)`
            );
        }
        console.groupEnd();
    }
}