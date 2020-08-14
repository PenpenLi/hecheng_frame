import baseUi from "../common/ui/baseUi"
import { uiFormType, UI_CONFIG_NAME, uiFormPath } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import AdaptationManager, { AdaptationType } from "../common/ui/AdaptationManager";
import { uiManager } from "../common/ui/uiManager";
import cfgManager from "../game/CfgManager";
import dataManager from "../game/dataManager";
import pictureManager from "../game/pictureManager"

const { ccclass, property } = cc._decorator;

@ccclass
export default class bottom extends baseUi {

    formType = new uiType(uiFormType.Fixed)
    btnGroup: cc.Node[] = [];

    /**屠龙刀模块 */
    @property(cc.Node)
    tuLong: cc.Node = null;

    /**加速按钮 */
    btnSpeed: cc.Node = null;
    btnBuy: cc.Node = null;
    sprbtnBuy: cc.Sprite = null;
    labcoinBtnBuy: cc.Label = null;
    lablvBtnBuy: cc.Label = null;


    onLoad() {
        cfgManager.ins().Bottom = this;
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.Bottom, this.node, 0);
        this.addListen();
        console.log("bottom load")
    }
    _open() {
        this.initDao();
        console.log("bottom open")
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
                let cost = dataManager.ins().buy_price;
                if (!dataManager.ins().isCanBuy(cost)) {
                    uiManager.ins().show(UI_CONFIG_NAME.DlgNotCoin);
                    return;
                }
                cfgManager.ins().gameManager.buyPet(0);
                break;
            case "BtnSpeedUp":
                uiManager.ins().show(UI_CONFIG_NAME.DlgSpeedup);
                break;
            case "BtnInvite":
                uiManager.ins().show(UI_CONFIG_NAME.DlgGift);
                break;
            default:
                console.log("没有");
                break;
        }
    }

    /**购买健初始化 */
    initBtnBuy() {
        this.sprbtnBuy = this.btnBuy.getComponent(cc.Sprite);
        this.labcoinBtnBuy = this.btnBuy.getChildByName("labBirdOfCost").getComponent(cc.Label);
        this.lablvBtnBuy = this.btnBuy.getChildByName("LabbirdLv").getComponent(cc.Label);
        this.initmessBtnBuy();
    }

    /**赋值购买健 */
    initmessBtnBuy() {
        let lv = dataManager.ins().buy_level;
        this.sprbtnBuy.spriteFrame = pictureManager.getIns().carHeads[lv - 1];
        this.labcoinBtnBuy.string = dataManager.ins().buy_price.geteveryStr();
        this.lablvBtnBuy.string = `L${lv}`;
    }


    /**视频回掉完显示加速的方法 */
    speed_video_back(jiasutime: number) {
        var labTimer = this.btnSpeed.getChildByName("LabTimer"); //显示文字
        // this.btnSpeed.getComponent(cc.Button).interactable = false;
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
                // self.btnSpeed.getComponent(cc.Button).interactable = true;
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
            dataManager.ins().isSpeedUp = true;
        } else {
            dataManager.ins().isSpeedUp = false;
        }
        try {
            var bg = cfgManager.ins().gameManager.birdBornFather;
            var count = bg.childrenCount;
            for (let i = 0; i < count; i++) {
                bg.children[i].getComponent("block").speedUp();
            }
        } catch (e) {
            console.error("加速方法", e);
        }
    }

    jindu: cc.Sprite = null;
    labjinduL: cc.Label = null;
    logo: cc.Sprite = null;
    btnClickDao: cc.Sprite = null;
    /**屠龙刀模块初始化 */
    initDao() {
        this.jindu = this.tuLong.getChildByName("jinduBG").getChildByName("jindu").getComponent(cc.Sprite);
        this.labjinduL = this.tuLong.getChildByName("jinduBG").getChildByName("labJindu").getComponent(cc.Label);
        this.logo = this.tuLong.getChildByName("logo").getComponent(cc.Sprite);
        this.btnClickDao = this.tuLong.getChildByName("Image_dao_go").getComponent(cc.Sprite);
        this.tuLong.on("click", () => {
            if (dataManager.ins().dao_num < 100) {
                cfgManager.ins().gameManager.gameTips(dataManager.ins().dao_notice,true)
            } else {
                uiManager.ins().show(UI_CONFIG_NAME.DlgXianshFhView);
            }
        }, this);
        this.shuaxinDao();
    }

    /**更新屠龙刀模块 */
    shuaxinDao() {
        let num_dao = dataManager.ins().dao_num;
        if (num_dao < 100) {
            this.logo.setMaterial(0, cc.Material.getBuiltinMaterial('2d-gray-sprite'));
            this.btnClickDao.setMaterial(0, cc.Material.getBuiltinMaterial('2d-gray-sprite'))
            this.jindu.fillRange = num_dao / 100;
            this.labjinduL.string = `${num_dao}% `;
            this.labjinduL.node.color = cc.Color.RED;
            this.labjinduL.node.x = -330 + num_dao * 7;
        } else {
            this.logo.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
            this.btnClickDao.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'))
            this.jindu.fillRange = 100;
            this.labjinduL.string = `100% `;
            this.labjinduL.node.color = cc.Color.WHITE;
            this.labjinduL.node.x = 258;
        }
    }
    // update (dt) {}
}
