function showChildrenGray(widget, isGray) {
    if (widget.children.length <= 0) return;
    for (let i = 0; i < widget.children.length; i++) {
        let child = widget.children[i];
        if (child.children.length > 0 && !child.getComponent(cc.Button)) {
            //showChildrenGray(child, isGray);
        }
        let _label = child.getComponent(cc.Label);
        if (_label) {
            _label.showAsGray(isGray, cc.color(254, 254, 254, 255));
        }
        let _button = child.getComponent(cc.Button);
        if (_button) {
            _button.showAsGray(isGray);
            continue;
        }
        let _sprite = child.getComponent(cc.Sprite);
        if (_sprite) {
            _sprite.showAsGray(isGray);
        }
    }
}

window.isEmptyObject = (obj) => {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

window.clone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}
window.assert = function (v, msg) {
    if (!v) {
        cc.error(msg);
    }
}

window.rawget = function (t, k) {
    return t[k]
}

window.rawset = function (t, k, v) {
    t[k] = v
}

window.handler = function (target, func) {
    return function () {
        func.apply(target, arguments);
    }
}

window.clone = function (t) {
    if (typeof (t) == "object") {
        let c
        if (Array.isArray(t)) {
            c = []
        } else {
            c = {}
        }
        for (var i in t) {
            c[i] = clone(t[i])
        }
        return c
    } else {
        return t
    }
}


window.table = {
    nums(t) {
        return t.length
    },
    insert(t, v, v2) {
        if (v2) {
            t.splice(v - 1, 0, v2)
        } else {
            t.push(v)
        }

    },
    sort(t, f) {
        t.sort(f)
    },
    remove(t, i) {
        return t.splice(i, 1)
    },
    foreach(t, func) {
        for (let i in t) {
            func(i, t[i]);
        }
    }
}

window.assert = function (a, msg) {
    if (!a) {
        cc.error(msg);
    }
}

window.tostring = function (o) {
    return "" + o;
}




cc.Node.prototype.setVisible = function (visible) {
    this.active = visible;
}

cc.Node.prototype.isVisible = function () {
    return this.active;
}

cc.Node.prototype.setName = function (name) {
    this.name = name;
}

cc.Node.prototype.getPositionInCCPoint = function () {
    return this.getPosition();
}
cc.Node.prototype.showAsGray = function (isGray) {
    showChildrenGray(this, isGray);
}
// cc.Node.prototype.getColor = function() {
//     return this.color;
// }
// cc.Node.prototype.setRotation = function (rotation) {
//     this.angle = rotation;
// }


