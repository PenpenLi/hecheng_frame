import baseUi from "../../frameWork/ui/baseUi"
import { uiFormType, UI_CONFIG_NAME, uiFormPath } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import AdaptationManager, { AdaptationType } from "../../frameWork/ui/AdaptationManager";
import { uiManager } from "../../frameWork/ui/uiManager";
import { Game } from "../../game/Game";
import { G_baseData } from "../../data/baseData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class bottom extends baseUi {

    formType = new uiType(uiFormType.Fixed)
    btnGroup: cc.Node[] = [];

    /**加速按钮 */
    btnSpeed: cc.Node = null;
    btnBuy: cc.Node = null;
    sprbtnBuy: cc.Sprite = null;
    labcoinBtnBuy: cc.Label = null;
    lablvBtnBuy: cc.Label = null;

    onLoad() {
        Game.Bottom = this;
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.Bottom, this.node, 0);
        this.addListen();
    }


    /**给按钮添加监听事件 */
    addListen() {
        const childs = this.node.getChildByName("nodeFather").children;
        for (const child of childs) {
            if (child.name.slice(0, 3) === 'Btn') {
                this.btnGroup.push(child);
            }
        }
        const nodes = this.btnGroup;
        for (const v of nodes) {
            if (v.name === "BtnBuyBird") {
                this.btnBuy = v;
                setTimeout(() => {
                    this.initBtnBuy()
                }, 1)
            } else if (v.name === "BtnSpeedUp") {
                this.btnSpeed = v;
            }
            let button = v.getComponent(cc.Button);
            if (button) {
                button.target = v;
                button.transition = cc.Button.Transition.SCALE;
                button.duration = 0.1;
                button.zoomScale = 1.2;
                // cc.log(`已经添加了button组件`);
            } else {
                let button = v.addComponent(cc.Button);
                button.target = v;
                button.transition = cc.Button.Transition.SCALE;
                button.duration = 0.1;
                button.zoomScale = 1.2;
            }
            v.on("click", this.openbomFrame);
        }
    }
    /**打开界面 */
    openbomFrame(touch: cc.Event.EventTouch) {
        switch (touch.target._name) {
            case "BtnStore":
                uiManager.ins().show(UI_CONFIG_NAME.DlgShopMall);
                break;
            case "BtnBuyBird":
                let cost = G_baseData.petData.buy_price;
                if (!G_baseData.userData.isCanBuy(cost)) {
                    uiManager.ins().show(UI_CONFIG_NAME.DlgNotCoin);
                    return;
                }
                Game.gameManager.buyBird(0);
                break;
            case "BtnSpeedUp":
                uiManager.ins().show(UI_CONFIG_NAME.DlgSpeedup);
                break;
            case "BtnInvite":
                uiManager.ins().show(UI_CONFIG_NAME.DlgGift);
                break;
            default:
                Game.Console.Log("没有");
                break;
        }
    }

    /**购买健初始化 */
    initBtnBuy() {
        this.sprbtnBuy = this.btnBuy.getChildByName("BirdOfHead").getComponent(cc.Sprite);
        this.labcoinBtnBuy = this.btnBuy.getChildByName("labBirdOfCost").getComponent(cc.Label);
        this.lablvBtnBuy = this.btnBuy.getChildByName("LabbirdLv").getComponent(cc.Label);
        this.initmessBtnBuy();
    }

    /**赋值购买健*/
    initmessBtnBuy() {
        let lv = G_baseData.petData.buy_level;
        this.sprbtnBuy.spriteFrame = G_baseData.petData.smallBirdSprList[lv - 1];
        this.labcoinBtnBuy.string = G_baseData.petData.buy_price.geteveryStr();
        this.lablvBtnBuy.string = `Lv${lv}`;
    }

    /**视频回掉完显示加速的方法 */
    speed_video_back(jiasutime: number) {
        var labTimer = this.btnSpeed.getChildByName("LabTimer"); //显示文字
        this.btnSpeed.getComponent(cc.Button).interactable = false;
        this.startspeedup(true); //开启2倍加速
        var doSomething = function (num) {
            if (num > 0) {
                labTimer.getComponent(cc.Label).string = num;
            } else {
                labTimer.getComponent(cc.Label).string = "";
            }
        }
        var self = this;
        var callback = function () {
            if (jiasutime === 0) {
                self.btnSpeed.getComponent(cc.Button).interactable = true;
                self.startspeedup(false); //开启1倍加速
                this.unschedule(callback);
            }
            doSomething(jiasutime);
            jiasutime--;
        }
        this.schedule(callback, 1);
    }

    /**加速方法  */
    startspeedup(isStartSpeed: boolean) {
        if (isStartSpeed) {
            G_baseData.petData.isSpeedUp = true;
        } else {
            G_baseData.petData.isSpeedUp = false;
        }
        try {
            var bg = Game.gameManager.birdBornFather;
            var count = bg.childrenCount;
            for (let i = 0; i < count; i++) {
                bg.children[i].getComponent("block").speedUp();
            }
        } catch (e) {
            console.error("加速方法", e);
        }
    }

    // update (dt) {}
}
