import SingletonClass from "../common/base/SingletonClass";

var self = null;

export class eventManager extends SingletonClass {
    ctor() {
        self = this;
        self._isDispatching = false;
        self._observerList = {};
        self._asyncEvent = [];
        self._eventPair = {};
        self._removeEventCache = [];
        self._addEventCache = {};
        self._targetUid = 1;
    };

    static ins(): eventManager {
        return super.ins() as eventManager;
    }

    // start() {
    //     var GlobalVar = require("globalvar");
    //     self.upid = GlobalVar.scheduleManager().scheduleUpdate(self.update);
    // };

    // stop() {
    //     var GlobalVar = require("globalvar");
    //     GlobalVar.scheduleManager().unscheduleUpdate(self.upid);
    // };

    addEventListener(event, fun, target) {
        if (event == null || fun == null) {
            return false;
        }

        if (target == null) {
            console.error("target can't be nil when register event listener!");
            return false;
        }

        if (self._findEventListener(event, fun, target)) {
            return true;
        }

        return self._addListener(event, fun, target);
    };

    removeListenerWithTarget(target) {
        if (target == null) {
            return false;
        }

        var eventArr = self._eventPair[target._private_uid_for_event_manager];
        if (eventArr == null) {
            return true;
        }

        for (var key in eventArr) {
            var value = eventArr[key];
            if (value != null) {
                self.removeListenerWithEvent(target, value);
            }
        }
        self._eventPair[target._private_uid_for_event_manager] = null;

        return true;
    };

    _findEventListener(event, fun, target) {
        if (event == null || fun == null || target == null) {
            cc.error("invalid param");
            return true;
        }

        var obj = self._observerList[event];
        if (obj == null || typeof obj != "object") {
            return false;
        }

        for (var key in obj) {
            var value = obj[key];
            if (typeof value == "object" && value[0] == target && value[1] == fun) {
                return true;
            }
        }

        return false;
    };

    _addListener(event, fun, target) {
        if (event == null || fun == null) {
            cc.error("invalid param");
            return true;
        }

        var obj = self._observerList[event];
        var len = 1;
        if (obj == null || typeof obj != "object") {
            self._observerList[event] = [];
            len = 1;
        } else {
            len = obj.length + 1;
        }

        self._observerList[event].push([target, fun]);

        //add event id into event pair
        if (target != null) {
            if (!target._private_uid_for_event_manager) {
                target._private_uid_for_event_manager = self._targetUid;
                self._targetUid++;
            }
            var len = 1;
            if (self._eventPair[target._private_uid_for_event_manager] == null ||
                typeof self._eventPair[target._private_uid_for_event_manager] != "object") {
                self._eventPair[target._private_uid_for_event_manager] = [];
            } else {
                len = self._eventPair[target._private_uid_for_event_manager].length + 1;
            }
            self._eventPair[target._private_uid_for_event_manager].push(event);
        }

        return true;
    };

    _removeListener(target) {
        if (target == null) {
            return false;
        }

        var eventArr = self._eventPair[target._private_uid_for_event_manager];
        if (eventArr == null) {
            return true;
        }

        for (var key in eventArr) {
            var value = eventArr[key];
            if (value != null) {
                self.removeListenerWithEvent(target, value);
            }
        }
        self._eventPair[target._private_uid_for_event_manager] = null;

        return true;
    };

    removeListenerWithEvent(target, event) {
        if (target == null || event == null) {
            return false;
        }

        var eventObserver = self._observerList[event];
        if (eventObserver == null) {
            return true;
        }

        if (self._isDispatching) {
            return self._addRemoveEventCache(target, event);
        }

        for (var key in eventObserver) {
            var value = eventObserver[key];
            if (typeof value == "object" && value[0] == target) {
                self._observerList[event].splice(key, 1);
                return true;
            }
        }

        return false;
    };

    _addRemoveEventCache(target, event) {
        self._removeEventCache.push([target, event]);
    };

    _doRemoveEventCache() {
        for (var key in self._removeEventCache) {
            var value = self._removeEventCache[key];
            self.removeListenerWithEvent(value[0], value[1]);
        }

        self._removeEventCache = [];
    };

    dispatchEvent(event, except, async) {
        if (event == null) {
            return null;
        }
        let args = [].slice.call(arguments, 3);
        if (async) {
            self._addAsyncEvent(event, except, args);
        } else {
            self._doDispatchEvent(event, except, args);
        }
    };

    _doDispatchEvent(event, except, args) {
        var eventObserver = self._observerList[event];
        if (eventObserver == null) {
            return false;
        }

        self._isDispatching = true;
        for (var key in eventObserver) {
            var value = eventObserver[key];
            if (value != null && typeof value == "object") {
                if (value[1] != null && value[0] != null) {
                    value[1].apply(value[0], args);
                } else if (value.fun != null) {
                    value[1].apply(null, args);
                }
            }
        }
        self._isDispatching = false;

        self._doRemoveEventCache();
    };

    _addAsyncEvent(event, except, args) {
        self._asyncEvent.push({ id: event, ex: except, args: args });
    };

    update() {
        self._asyncEvent.splice(0).forEach(info => {
            self._doDispatchEvent(info.id, info.ex, info.args);
        });
    };
}

