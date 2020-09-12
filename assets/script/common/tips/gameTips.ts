const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    /** labTips*/
    @property(cc.Label)
    labTips: cc.Label = null;

    /** labTips*/
    @property(cc.Node)
    bg: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.scheduleOnce(function () {
            this.node.destroy();
        }, 2);
    }

    /**初始化文本框的内容 */
    initMessage(str: string) {
        let num = str.length;
        this.bg.opacity = 160;
        this.bg.width = num * 40;
        this.labTips.string = str;

    }

    // update (dt) {}
}
