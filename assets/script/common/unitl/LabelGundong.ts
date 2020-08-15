//label文本滚动效果

import { Game } from "../../game/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelGundong extends cc.Component {

    UI_Label: cc.Label;
    _StartY;
    _Str = '';

    NumArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    StrArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'k'];

    onLoad() {
        this.UI_Label = this.node.getComponent(cc.Label);
        this._StartY = this.node.y;
    }

    SetNum(str: string) {
        this.node.active = true;
        let count = str.length;

        let randomcount = 0;
        this._Str = '';
        for (let index = 0; index < count; index++) {
            this._Str += this.NumArr[Math.floor((Math.random() * this.NumArr.length))];
        }

        let callback = () => {
            this.SetNumForArr(this._Str);
            randomcount++;

            if (randomcount === 40) {
                this.UI_Label.string = str;
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 0.01);

    }

    SetNumForArr(str) {
        this._Str = this.RandomNumInArr(str);
        this.UI_Label.string = this._Str;
    }

    RandomNumInArr(_str: string) {

        let str = '';
        let num_arr = _str.split('');

        for (let index = 0; index < num_arr.length; index++) {

            let _num = parseInt(num_arr[index]);
            if (_num == 9) {
                _num = 0;
            }
            else {
                _num++;
            }
            str += _num.toString();
        }
        return str;
    }














    SetStr(str: string, type) {
        if (type == 2) {
            this.UI_Label.string = str;
            return;
        }
        this.node.active = true;
        let randomcount = 0;

        let now_str = this.UI_Label.string;

        let now_str_length = now_str.length;
        let str_length = str.length;

        let indexlength = now_str_length > str_length ? now_str_length : str_length;
        let maxcount = 0;
        for (let index = 0; index < indexlength; index++) {
            let str_index = this.StrArr.indexOf(str[str_length - index - 1]);
            if (str_index == -1) { str_index = str_length - 1 }

            let now_str_index = this.StrArr.indexOf(now_str[now_str_length - index - 1]);
            if (now_str_index == -1) { now_str_index = now_str_length - 1 }

            let count = (str_index - now_str_index) > 0 ? (str_index - now_str_index) : (str_index - now_str_index) + this.StrArr.length;
            if (count > maxcount) {
                maxcount = count;
            }
        }

        let callback = () => {
            this.SetStrForArr(str);
            randomcount++;

            if (randomcount === maxcount) {
                this.UI_Label.string = str;
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 0.05);

    }

    SetStrForArr(str: string) {
        this._Str = this.RandomStrInArr(str);
        this.UI_Label.string = this._Str;
    }

    RandomStrInArr(_str: string) {
        let now_str = this.UI_Label.string;
        let str = '';
        let str_arr = _str.split('');

        if (now_str.length > str_arr.length) {
            let _nowstr = '';
            for (let index = 0; index < str_arr.length; index++) {
                _nowstr = now_str[now_str.length - index - 1] + _nowstr;
            }
            now_str = _nowstr;
        }
        else if (now_str.length < str_arr.length) {
            let _cut = str_arr.length - now_str.length
            for (let index = 0; index < _cut; index++) {
                now_str = this.StrArr[0] + now_str;
            }
        }

        for (let index = 0; index < now_str.length; index++) {
            if (now_str[index] == str_arr[index]) {
                str += now_str[index];
                continue;
            }
            else {
                let _index = this.StrArr.indexOf(now_str[index]);
                let str_index = this.StrArr.indexOf(str_arr[index]);

                if (str_index == -1 || str_index >= this.StrArr.length - 1) {
                    str_index = -1;
                }
                if (_index == -1 || _index >= this.StrArr.length - 1) {
                    _index = -1;
                }

                if (_index > str_index) {
                    if (_index <= 0) {
                        _index = this.StrArr.length - 1
                    }
                    str += this.StrArr[--_index];
                }
                else if (_index < str_index) {
                    str += this.StrArr[++_index];
                }

            }
        }
        return str;
    }

    // update (dt) {}
}
