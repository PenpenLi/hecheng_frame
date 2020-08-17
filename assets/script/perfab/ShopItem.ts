import pictureManager from "../game/pictureManager"
import userData from "../data/userData"
import BigVal from "../common/bigval/BigVal"
import { uiManager } from "../common/ui/uiManager";
import { uiFormType, UI_CONFIG_NAME, uiFormPath } from "../common/base/gameConfigs";
import { Game } from "../game/Game";
import { G_baseData } from "../data/baseData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class shopItem extends cc.Component {

    /**鸟的头像 */
    @property(cc.Sprite)
    sprBird: cc.Sprite = null;

    /**头像的数字 */
    @property(cc.Label)
    LabIndex: cc.Label = null;

    /**购买金币button */
    @property(cc.Button)
    BtncoinBuy: cc.Button = null;

    /**购买钻石button */
    @property(cc.Button)
    BtnJewelBuy: cc.Button = null;

    /**不能购买button */
    @property(cc.Node)
    BtnNotBuy: cc.Node = null;

    /**鸟的名称 */
    @property(cc.Label)
    LabBirdsName: cc.Label = null;

    /**做标记的鸟标号 */
    IndexNum: number = 0;

    /**钻石 */
    costOfjewel: number = 0;


    /**当前金币的花费 */
    costOfCoin: BigVal = null;
    //添加监听
    onEnable() {
        this.BtncoinBuy.node.on("click", this.BtnOfcoinBuy, this);
        this.BtnJewelBuy.node.on("click", this.BtnOfjewelBuy, this);
    }

    /**初始化框的信息 */
    initOfThing(obj) {
        this.IndexNum = obj.id; //每一个等级鸟的序号
        this.LabBirdsName.node.parent.active = true;
        this.LabBirdsName.string = G_baseData.petData.getBirdName(this.IndexNum); //鸟的名字
        //两张图片
        this.sprBird.spriteFrame = pictureManager.getIns().birdTuji[this.IndexNum - 1]; //鸟的图片
        this.sprBird.node.color = new cc.Color(255, 255, 255, 255);
        this.LabIndex.string = this.IndexNum.toString();
        if (obj.type == 1) { //type=0 不能购买  type=1 金币 type=2 钻石
            this.showCoinBuy(obj);
        } else if (obj.type == 2) { //钻石购买
            this.showJewelBuy(obj);
        } else { //不能购买
            this.showBtnNotBuy(obj);
        }
    }
    /**显示金币买的按钮 */
    showCoinBuy(obj) {
        var pricecoin = new BigVal(obj.num);
        this.costOfCoin = pricecoin; //当前购买价格金币
        this.BtnNotBuy.active = false;
        this.BtnJewelBuy.node.active = false;
        this.BtncoinBuy.node.active = true;
        this.BtncoinBuy.node.getChildByName("Cointips").getComponent(cc.Label).string = pricecoin.geteveryStr();
    }
    /**显示钻石买的按钮 */
    showJewelBuy(obj) {
        var jewelNum = obj.num;
        this.costOfjewel = jewelNum; //钻石
        this.BtnNotBuy.active = false;
        this.BtncoinBuy.node.active = false;
        this.BtnJewelBuy.node.active = true;
        this.BtnJewelBuy.node.getChildByName("Jeweltips").getComponent(cc.Label).string = jewelNum;
    }

    /**显示不能卖的按钮 */
    showBtnNotBuy(obj) {
        this.sprBird.node.color = new cc.Color(0, 0, 0, 255);
        this.LabBirdsName.node.parent.active = false;
        this.BtncoinBuy.node.active = false;
        this.BtnJewelBuy.node.active = false;
        this.BtnNotBuy.active = true;
        this.BtnNotBuy.getChildByName("tips").getComponent(cc.Label).string = obj.num;
    }


    /**购买金币按钮 */
    BtnOfcoinBuy() {
        if (userData.ins().is_Click_end) {
            userData.ins().is_Click_end = !userData.ins().is_Click_end;
            this.scheduleOnce(function () {
                userData.ins().is_Click_end = !userData.ins().is_Click_end;
            }, 0.2);
            G_baseData.petData.shop_buy_price = this.costOfCoin;
            if (!userData.ins().isCanBuy(this.costOfCoin)) {
                uiManager.ins().show(UI_CONFIG_NAME.DlgNotCoin);
                return;
            }
            var self = this;
            var call = function (price) {
                var pricecoin = new BigVal(price);
                self.costOfCoin = pricecoin;
                self.BtncoinBuy.node.getChildByName("Cointips").getComponent(cc.Label).string = pricecoin.geteveryStr();
            }
            Game.gameManager.buyBird(1, this.IndexNum, call);
        } else {
            console.log("请勿快速点击");
        }
    }

    /**购买钻石按钮 */
    BtnOfjewelBuy() {
        if (userData.ins().FHBC < this.costOfjewel) {
            let string_0 = "MBC余额不足";
            Game.gameManager.gameTips(string_0);
            return;
        } else {
            if (userData.ins().is_Click_end) { //防止快速点击
                userData.ins().is_Click_end = !userData.ins().is_Click_end;
                this.scheduleOnce(function () {
                    userData.ins().is_Click_end = !userData.ins().is_Click_end;
                }, 0.2);
                G_baseData.petData.shop_buy_Fhbc = this.costOfjewel;
                Game.gameManager.buyBird(2, this.IndexNum)
            } else {
                console.log("请勿快速点击");
            }
        }
    }

    //取消监听
    onDisable() {
        this.BtncoinBuy.node.off("click", this.BtnOfcoinBuy, this);
        this.BtnJewelBuy.node.off("click", this.BtnOfjewelBuy, this);
    }


    // update (dt) {}
}
