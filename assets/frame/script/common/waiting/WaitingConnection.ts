import dataManager from "../../game/dataManager"

var labstr: string = "";
const { ccclass, property } = cc._decorator;

@ccclass
export default class WaitingConnection extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "显示的内容"
    })
    labContent: cc.Label = null;

    private _isShow: boolean = false;

    private _iswebsocket: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.active = this._isShow;
    }


    /**显示加载框 */
    showtips(content?: string,) {
        dataManager.ins().isAddCoin_bird = false;
        if (!this._isShow) {
            this._isShow = true;
            if (this.node) {
                this.node.active = this._isShow;
            }
            if (content == null) {
                content = "正在疯狂加载中";
            } else {
                this._iswebsocket = true;
            }
            labstr = content;
            // this.labContent.string = labstr;
        }
    }

    /**隐藏 */
    hidetips(closewebsokket?: boolean) {
        dataManager.ins().isAddCoin_bird = true;
        if (closewebsokket) {
            this._iswebsocket = false;
        }
        if (this._iswebsocket) return;
        this._isShow = false;
        if (this.node) {
            this.node.active = this._isShow;
        }
    }

    update(dt) {
        this.target.angle = this.target.angle - dt * 45;
        // var t = Math.floor(Date.now() / 1000) % 5;
        // if (this._isShow) {
        //     this.labContent.string = labstr;
        //     for (var i = 0; i < t; ++i) {
        //         this.labContent.string += ' .';
        //     }
        // }
    }
}
