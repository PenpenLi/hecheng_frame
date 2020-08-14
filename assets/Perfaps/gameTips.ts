

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
    initMessage(str: string, isSpecial = false) {
        let self = this;
        let num = str.length;
        this.labTips.node.opacity = 255;
        let addHeight = 30;
        let align = null;
        if (!!!isSpecial) { //旧的
            // this.bg.width = num * 40;
            // this.labTips.string = str;
            align = cc.Label.HorizontalAlign.CENTER;
            this.labTips.fontSize = 30;
        } else {
            align = cc.Label.HorizontalAlign.LEFT;
            this.labTips.fontSize = 25;
            addHeight = 30;
        }
        this.bg.width = num * 40 > 560 ? 560 : num * 40;
        this.labTips.node.width = this.bg.width - 50;
        this.labTips.string = str;
        this.labTips.scheduleOnce(() => {
            self.bg.height = self.labTips.node.height < 60 ? 60 + addHeight : self.labTips.node.height + addHeight;
            self.labTips.horizontalAlign = align;
        }, 0)
    }

    // update (dt) {}
}
