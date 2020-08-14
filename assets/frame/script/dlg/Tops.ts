import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import AdaptationManager, { AdaptationType } from "../common/ui/AdaptationManager";
import { uiManager } from "../common/ui/uiManager";
import { UI_CONFIG_NAME } from "../common/config/gameConfigs";
import dataManager from "../game/dataManager";
import pictureManager from "../game/pictureManager"
import cfgManager from "../game/CfgManager";
import BigVal from "../common/bigval/BigVal"


const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {

    // /**总金币 */
    @property(cc.Label)
    labTotalCoins: cc.Label = null;
    /**每秒产生的金币 */
    @property(cc.Label)
    labeveryCoins: cc.Label = null;
    /**FHbc预制体*/
    @property(cc.Prefab)
    FHBC_Pab: cc.Prefab = null;

    @property(cc.ProgressBar)
    FHBC_Progress: cc.ProgressBar = null;
    @property(cc.Node)
    JewelClick: cc.Node = null;

    /**fhbc */
    FHBC: cc.Label = null;
    /**昨日收益 */
    FONHONG: cc.Label = null;
    /**我的头像 */
    myheadSpr: cc.Sprite = null;
    // /**我的头像的名字 */
    myheadName: cc.Label = null;
    /**我的头像的等级 */
    myheadLv: cc.Label = null;


    /**领取金币的按钮 */
    btnrightCoins: cc.Node = null;
    /**按键集合 */
    btnGroup: Btnnodes[] = [];

    formType = new uiType(uiFormType.Fixed);

    /**我的喵喵 */

    onLoad() {
        cfgManager.ins().Tops = this;
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.Top, this.node, -5)
        this.addListen();
    }

    _open() {
        this.initgameTops();
        this.FristRight_coin();
        //弹出离线金币
        if (dataManager.ins().offLineCoin.Num != "0") {
            uiManager.ins().show(UI_CONFIG_NAME.DlgOffLine)
        }
        this.initCoinOfTotal();
        this.initCoinOfSecond();
        this.showJewelClick();
    }

    /**给按钮添加监听事件 */
    addListen() {
        const childs = this.node.getChildByName("nodeFather").children;
        for (const child of childs) {
            let btnNode: Btnnodes = { name: null, node: null };;
            if (child.name.slice(0, 3) === 'Btn') {
                btnNode.node = child;
                btnNode.name = child.name;
                this.btnGroup.push(btnNode);
            }
        }
        const nodes = this.btnGroup;
        for (const v of nodes) {
            let button = v.node.getComponent(cc.Button);
            if (button) {
                button.target = v.node;
                button.transition = cc.Button.Transition.SCALE;
                button.duration = 0.1;
                button.zoomScale = 1.2;
                cc.log(`已经添加了button组件`);
            } else {
                let button = v.node.addComponent(cc.Button);
                button.target = v.node;
                button.transition = cc.Button.Transition.SCALE;
                button.duration = 0.1;
                button.zoomScale = 1.2;
            }
            v.node.on("click", this.opentopFrame);
        }
    }

    /**打开界面 */
    opentopFrame(touch: cc.Event.EventTouch) {
        switch (touch.target._name) {
            case "BtnPaiHang":
                uiManager.ins().show(UI_CONFIG_NAME.DlgRankList);
                break;
            case "BtnHowPlay":
                cfgManager.ins().btnClickPlay();
                break;
            case "BtnTuJian":
                uiManager.ins().show(UI_CONFIG_NAME.DlgTuJian);
                break;
            case "BtnZhuanPan":
                uiManager.ins().show(UI_CONFIG_NAME.DlgZhuanPan);
                break;
            case "BtnSetup":
                uiManager.ins().show(UI_CONFIG_NAME.DlgSetUp);
                break;
            case "Btnyaoyiyao":
                cfgManager.ins().clickYaoAgain();
                break;
            case "Btnkefu":
                cfgManager.ins().clickMessage_0();
                break;
            case "BtnheadImage":
                uiManager.ins().show(UI_CONFIG_NAME.DlgLeftHead);
                break;
            case "BtnrightCoins":
                uiManager.ins().show(UI_CONFIG_NAME.DlgRigthCoins);
                break;
            case "BtnActivity":
                cfgManager.ins().clickactive_0();
                break;
            case "BtnFHBC":
                cfgManager.ins().btnClickLeftJewel();
                break;
            case "BtnFENHONG":
                cfgManager.ins().btnClickFenhong();
                break;
            case "BtnSuperTurnTable": //超级转盘
                uiManager.ins().show(UI_CONFIG_NAME.DlgSuperTurnTable);
                break;
            case "BtnMutantDragon": //变异龙
                cfgManager.ins().btnClickVariationDragon();
                break;
            default:
                console.log("没有", touch.target._name);
                break;
        }
    }

    /**给tops按钮赋值（我的头像，fhbc,收益，金币） */
    initgameTops() {
        const nodes = this.btnGroup;
        for (const v of nodes) {
            switch (v.name) {
                case "BtnFHBC":
                    let fhbnode = v.node.getChildByName("FHbc");
                    this.FHBC = fhbnode.getComponent(cc.Label);
                    this.initFHBC();
                    break;
                case "BtnFENHONG":
                    let fenghongnode = v.node.getChildByName("FENhong");
                    this.FONHONG = fenghongnode.getComponent(cc.Label);
                    this.FONHONG.string = dataManager.ins().FENHONG.toString();
                    break;
                case "BtnheadImage":
                    this.myheadSpr = v.node.getChildByName("SprBirdHead").getComponent(cc.Sprite);
                    this.myheadName = v.node.getChildByName("labBirdName").getComponent(cc.Label);
                    this.myheadLv = v.node.getChildByName("labBirdLv").getComponent(cc.Label);
                    //初始化左上角我的头像
                    let numbest = dataManager.ins().BestBirdOfLv;
                    this.initmyHead(numbest);
                    break;
                case "BtnrightCoins":
                    this.btnrightCoins = v.node;
                    break;
                default:
                    // console.log("不需要");
                    break;
            }
        }

    }

    /**进入游戏时的右上角首次金币时间的更新 */
    FristRight_coin() {
        dataManager.ins().rest_time = 3600 - (dataManager.ins().now_time - dataManager.ins().rec_time);
        this.showCoinTips();
    }
    /**右上方提示玩家收获金币的按钮 */
    showCoinTips() {
        if (dataManager.ins().rest_time <= 0) {
            this.btnrightCoins.getComponent(cc.Button).interactable = true;
            let tween = cc.tween()
                .to(0.1, { scale: 1.3 })
                .to(0.1, { scale: 1 })
                .to(0.1, { scale: 1.6 })
                .to(0.1, { scale: 1 })
                .delay(5)
            this.btnrightCoins.getChildByName("sprTips").active = true;
            tween.clone(this.btnrightCoins.getChildByName("sprTips")).repeatForever().start();
        } else {
            this.btnrightCoins.getChildByName("sprTips").active = false;
            //显示倒计时
            this.btnrightCoins.stopAllActions();
            this.showTimeReduce();
            this.btnrightCoins.getComponent(cc.Button).interactable = false;
        }
    }

    /**填零方法 */
    addZone(num) {
        let a = num.toString();
        if (a.length < 2) {
            a = "0" + a;
        }
        return a;
    }

    /**显示倒计时的方法 */
    showTimeReduce() {
        var call = function () {
            if (dataManager.ins().rest_time <= 0) {
                this.unschedule(call);
                this.btnrightCoins.getChildByName("labtips").getComponent(cc.Label).string = '';
                this.showCoinTips(); //剩余时间为零
                return;
            }
            if (dataManager.ins().rest_time > 0) {
                dataManager.ins().rest_time -= 1;
            }
            let min = Math.floor(dataManager.ins().rest_time / 60);
            let sec = Math.floor(dataManager.ins().rest_time % 60);
            var str_time = this.addZone(min) + ":" + this.addZone(sec);
            this.btnrightCoins.getChildByName("labtips").getComponent(cc.Label).string = str_time;
        }
        this.schedule(call, 1);
    }

    /**每秒产生金币的更新 */
    initCoinOfSecond() {
        this.scheduleOnce(function () {
            let isHaveBird = dataManager.ins().isHaveBird;
            let totalCoin = new BigVal("0");
            for (let i = 0; i < isHaveBird.length; i++) {
                if (isHaveBird[i] > 0 && isHaveBird[i] < 38) {
                    let coin_0 = 25 * Math.pow(2, isHaveBird[i] - 1);
                    totalCoin = BigVal.Add(totalCoin, new BigVal(coin_0.toString()));
                } else if (isHaveBird[i] >= 38) {
                    let coin_1 = 25 * Math.pow(2, 38);
                    totalCoin = BigVal.Add(totalCoin, new BigVal(coin_1.toString()));
                }
            }
            dataManager.ins().everyCions = BigVal.Dev(totalCoin, new BigVal("5"));
            this.labeveryCoins.string = dataManager.ins().everyCions.geteveryStr() + "/秒";
        }, 1);
    }

    /**总金币金币的更新 */
    initCoinOfTotal() {
        this.labTotalCoins.string = dataManager.ins().TotalCoins.getTotalStr();
        let tween = cc.tween()
            .to(0.2, { scale: 1.2 })
            .to(0.2, { scale: 1 })
        tween.clone(this.labTotalCoins.node).start();
    }

    /**刷新我的头像 */
    initmyHead(lv: number) {
        this.myheadSpr.spriteFrame = pictureManager.getIns().birdTuji[lv - 1];
        this.myheadName.string = cfgManager.ins().getBirdName(lv);
        let name_num: number = 1;
        if (lv < 38) {
            name_num = lv;
        } else {
            name_num = 38;
        }
        this.myheadLv.string = `lv.${name_num}`;
    }

    /**刷新fhbc */
    initFHBC() {
        if (!this.FHBC) return;
        this.FHBC.string = dataManager.ins().FHBC.toFixed(2);
    }

    /**FHBC界面的更新 */
    showJewelClick() {
        if (dataManager.ins().FHBC_LIST.length == 0) {
            this.FHBC_Progress.progress = dataManager.ins().FHBC_LIST.length / 12; //进度条
            this.JewelClick.getChildByName("click_1").active = true;
            return;
        }
        this.JewelClick.getChildByName("click_1").active = false;
        this.FHBC_Progress.progress = dataManager.ins().FHBC_LIST.length / 12;
        var p1 = cc.v2(-50, 0),
            p2 = cc.v2(10, 0),
            p3 = cc.v2(70, 0),
            p4 = cc.v2(130, 0);
        var num_lenth = 0;
        dataManager.ins().FHBC_LIST.length > 4 ? num_lenth = 4 : num_lenth = dataManager.ins().FHBC_LIST.length;
        for (let i = 0; i < num_lenth; i++) {
            let jewel = cc.instantiate(this.FHBC_Pab);
            jewel.getComponent("jewelBiaoJi").initSelf(dataManager.ins().FHBC_LIST.shift()); //shift删除数组第一个元素并返回自身
            jewel.setParent(this.JewelClick.getChildByName("click_0"));
            switch (i) {
                case 0:
                    jewel.setPosition(p1);
                    break;
                case 1:
                    jewel.setPosition(p2);
                    break;
                case 2:
                    jewel.setPosition(p3);
                    break;
                case 3:
                    jewel.setPosition(p4);
                    break;
            }
        }
    }

    /**收完FHBC后的更新 */
    ClickJewelEnd(price) {
        dataManager.ins().FHBC = dataManager.ins().FHBC + price;
        this.initFHBC();
        if (this.JewelClick.getChildByName("click_0").childrenCount == 1) {
            this.showJewelClick();
        }
    }
}

type Btnnodes = {
    name: string;
    node: cc.Node;
}
