
var self = null;
let id = 0;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        self = this;
        self._list = [];
    },

    update(dt) {
        self._list.slice(0).forEach(e => {
            e[0].call(e[1], dt);
        });
    },

    scheduleUpdate(callback, target) {
        self._list.push([callback, target, id]);
        return id++;
    },

    unscheduleUpdate(id) {
        for(let i = 0; i < self._list.length; i++) {
            if(self._list[i][2]=== id) {
                self._list.splice(i,1);
                break;
            }
        }
    },
});