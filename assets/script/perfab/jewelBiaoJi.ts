import { Game } from "../game/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    /**显示hfbcf个数*/
    @property(cc.Label)
    labTips: cc.Label = null;
    /**标记*/
    id: number = 0;

    priceOfJewel: string = "";

    start() {
        this.schedule(function () {
            let index = this.node.getSiblingIndex();
            this.LocationUpdate(index);
        }, 10);
    }

    /**初始化自身 */
    initSelf(obj: any) {
        this.priceOfJewel = obj.price;
        this.labTips.string = this.priceOfJewel;
        this.id = obj.id;
    }

    /**自动更新位置 */
    LocationUpdate(INDEX) {
        var p1 = cc.v2(-50, 10),
            p2 = cc.v2(10, 10),
            p3 = cc.v2(70, 10),
            p4 = cc.v2(130, 10);
        switch (INDEX) {
            case 0:
                this.node.setPosition(p1);
                break;
            case 1:
                this.node.setPosition(p2);
                break;
            case 2:
                this.node.setPosition(p3);
                break;
            case 3:
                this.node.setPosition(p4);
                break;
        }
    }

    /**主界面的4个FHBC的点击方法 */
    btnClickJewel() {
        this.sendMessageFhbc();
    }

    /**给服务器发消息 */
    sendMessageFhbc() {
        var self = this;
        var funSuc = function (ret) {
            if (ret.code == 0) {
                self.jewelMove(self);
            }
        }
        var funErr = function (ret) {
            Game.gameManager.gameTips("MBC领取失败");
        }
        let params = {
            id: self.id
        }
        Game.HttpManager.sendRequest('/api/game/receiveFhbc', params, funSuc, funErr);
    }

    /**钻石的运动轨迹 */
    jewelMove(self) {
        var price = Number(self.priceOfJewel); //每个FHBC的价格
        self.node.getComponent(cc.Button).interactable = false; //关闭点击
        var x1 = self.node.x;
        var y1 = self.node.y;
        var action = cc.sequence(
            cc.bezierTo(0.5, [cc.v2(x1, y1), cc.v2(x1 - 80, y1 + 180), cc.v2(-150, 200)]),
            cc.callFunc(function () {
                Game.Tops.ClickJewelEnd(price); //加金币
                self.node.destroy();
            }, self),
        )
        self.node.runAction(action); //钻石的运动轨迹
    }
}
