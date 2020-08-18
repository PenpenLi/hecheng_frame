import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import AdaptationManager, { AdaptationType } from "../common/ui/AdaptationManager";
import { uiManager } from "../common/ui/uiManager";
import { UI_CONFIG_NAME } from "../common/base/gameConfigs";
import BigVal from "../common/bigval/BigVal"
import { Game } from "../game/Game";
import LabelGundong from "../common/unitl/LabelGundong";
import { G_baseData } from "../data/baseData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Tops extends baseUi {

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
        Game.Tops = this;
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.Top, this.node, 0)
        this.addListen();
    }

    _open() {
        this.initgameTops();
        this.FristRight_coin();
        //弹出离线金币
        if (G_baseData.userData.offLineCoin.Num != "0") {
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
            v.node.on("click", this.opentopFrame.bind(this));
        }
    }

    /**打开界面 */
    opentopFrame(touch: cc.Event.EventTouch) {
        let self = this;
        switch (touch.target._name) {
            case "BtnPaiHang":
                uiManager.ins().show(UI_CONFIG_NAME.DlgRankList);
                break;
            case "BtnHowPlay":
                Game.ApiManager.btnClickPlay();
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
                self.clickYaoAgain();
                break;
            case "Btnkefu":
                Game.ApiManager.clickMessage_0();
                break;
            case "BtnheadImage":
                // Game.gameManager.RestartGame();
                uiManager.ins().show(UI_CONFIG_NAME.DlgLeftHead);
                break;
            case "BtnrightCoins":
                {
                    /**初始化值 */
                    let initOFRigthCoin = (price) => {
                        let _nowtime = parseInt((new Date().getTime() / 1000).toString());
                        G_baseData.userData.now_time = _nowtime;
                        G_baseData.userData.rec_time = _nowtime;
                        G_baseData.userData.LocolIndexTime = _nowtime;
                        var coins = new BigVal(price);
                        uiManager.ins().show(UI_CONFIG_NAME.DlgRigthCoins, "+" + coins.geteveryStr());
                    }

                    var funSuc = (ret) => {
                        Game.Console.Log(ret)
                        G_baseData.userData.RefreshGold(ret.data.amount, ret.data.update_time);
                        if (ret.code == 0) {
                            initOFRigthCoin(ret.data.add_num);
                        }
                    }
                    var funErr = (ret) => {
                        Game.gameManager.gameTips('金币领取失败，请检查网络连接或联系游戏客服，错误信息：' + JSON.stringify(ret));
                    }
                    let params = {
                        type: 1,
                    }
                    try {
                        Game.HttpManager.sendRequest('/api/game/receiveGold', params, funSuc, funErr);
                    } catch (e) {
                        console.log(e);
                    }
                }
                break;
            case "BtnActivity":
                Game.ApiManager.clickactive_0();
                break;
            case "BtnFHBC":
                Game.ApiManager.btnClickLeftJewel();
                break;
            case "BtnFENHONG":
                Game.ApiManager.btnClickFenhong();
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
                    this.FONHONG.string = G_baseData.userData.FENHONG.toString();
                    break;
                case "BtnheadImage":
                    this.myheadSpr = v.node.children[0].getChildByName("SprBirdHead").getComponent(cc.Sprite);
                    this.myheadName = v.node.getChildByName("labBirdName").getComponent(cc.Label);
                    this.myheadLv = v.node.getChildByName("labBirdLv").getComponent(cc.Label);
                    //初始化左上角我的头像
                    setTimeout(() => {
                        let numbest = G_baseData.petData.BestBirdOfLv;
                        this.initmyHead(numbest);
                    }, 500)
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
        G_baseData.userData.rest_time = 3600 - (G_baseData.userData.now_time + (parseInt((new Date().getTime() / 1000).toString()) - G_baseData.userData.LocolIndexTime) - G_baseData.userData.rec_time);
        this.showCoinTips();
    }
    /**右上方提示玩家收获金币的按钮 */
    showCoinTips() {
        if (G_baseData.userData.rest_time <= 0) {
            this._iscd = false;
            this.btnrightCoins.getComponent(cc.Button).interactable = true;
            let tween = cc.tween()
                .to(0.1, { scale: 1.3 })
                .to(0.1, { scale: 1 })
                .to(0.1, { scale: 1.6 })
                .to(0.1, { scale: 1 })
                .delay(5)
            tween.clone(this.btnrightCoins).repeatForever().start();
        } else {
            //显示倒计时
            this._iscd = true;
            this.btnrightCoins.stopAllActions();
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
    _time = 0;
    _iscd = false;
    update(dt) {
        if (this._iscd == false) {
            return;
        }

        this._time += dt;
        if (this._time < 1) {
            return
        }
        this._time = 0;

        let cd_time = G_baseData.userData.rest_time = 3600 - (G_baseData.userData.now_time + (parseInt((new Date().getTime() / 1000).toString()) - G_baseData.userData.LocolIndexTime) - G_baseData.userData.rec_time);
        if (cd_time <= 0) {
            this.btnrightCoins.getChildByName("labtips").getComponent(cc.Label).string = '领取';
            this.showCoinTips(); //剩余时间为零
            return;
        }
        let min = Math.floor(G_baseData.userData.rest_time / 60);
        let sec = Math.floor(G_baseData.userData.rest_time % 60);
        var str_time = this.addZone(min) + ":" + this.addZone(sec);
        this.btnrightCoins.getChildByName("labtips").getComponent(cc.Label).string = str_time;
    }

    /**每秒产生金币的更新 */
    initCoinOfSecond() {
        this.scheduleOnce(function () {
            let isHaveBird = G_baseData.petData.isHaveBird;
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
            G_baseData.petData.everyCions = BigVal.Dev(totalCoin, new BigVal("5"));
            this.labeveryCoins.string = G_baseData.petData.everyCions.geteveryStr() + "/秒";
        }, 1);
    }

    /**总金币金币的更新 */
    initCoinOfTotal(type = 1) {
        let num = G_baseData.userData.TotalCoins.getTotalStr();
        cc.tween(this.labTotalCoins.node)
            .to(0.2, { scale: 1.2 })
            .to(0.2, { scale: 1 })
            .start();
        this.labTotalCoins.string = num;
        //this.labTotalCoins.getComponent(LabelGundong).SetStr(num, type)
    }

    /**刷新我的头像 */
    initmyHead(lv: number) {
        this.myheadSpr.spriteFrame = G_baseData.petData.birdSprList[lv - 1];
        this.myheadName.string = G_baseData.petData.getBirdName(lv);
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
        this.FHBC.string = G_baseData.userData.FHBC.toFixed(2);
    }

    /**FHBC界面的更新 */
    showJewelClick() {
        if (G_baseData.userData.FHBC_LIST.length == 0) {
            this.FHBC_Progress.progress = G_baseData.userData.FHBC_LIST.length / 12; //进度条
            this.JewelClick.getChildByName("click_1").active = true;
            return;
        }
        this.JewelClick.getChildByName("click_1").active = false;
        this.FHBC_Progress.progress = G_baseData.userData.FHBC_LIST.length / 12;
        var p1 = cc.v2(-50, 10),
            p2 = cc.v2(10, 10),
            p3 = cc.v2(70, 10),
            p4 = cc.v2(130, 10);
        var num_lenth = 0;
        G_baseData.userData.FHBC_LIST.length > 4 ? num_lenth = 4 : num_lenth = G_baseData.userData.FHBC_LIST.length;
        for (let i = 0; i < num_lenth; i++) {
            let jewel = cc.instantiate(this.FHBC_Pab);
            jewel.getComponent("jewelBiaoJi").initSelf(G_baseData.userData.FHBC_LIST.shift()); //shift删除数组第一个元素并返回自身
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
        G_baseData.userData.FHBC = G_baseData.userData.FHBC + price;
        this.initFHBC();
        if (this.JewelClick.getChildByName("click_0").childrenCount == 1) {
            this.showJewelClick();
        }
    }



    //TODO 逻辑测试
    /**摇一摇 */
    clickYaoAgain() {
        Game.ApiManager.Shake();
        var funSuc = (res) => {
            console.log("res", res.data.type)
            switch (res.data.type) {
                case 'gold':
                    G_baseData.userData.RefreshGold(res.data.amount, res.data.update_time);
                    uiManager.ins().show(UI_CONFIG_NAME.DlgFrame, 1, 3, new BigVal(res.data.num));
                    break;
                case 'fhbc':
                    G_baseData.userData.FHBC += res.data.num;
                    this.initFHBC();
                    uiManager.ins().show(UI_CONFIG_NAME.DlgFrame, 1, 4, res.data.num);
                    break;
                case 'suanli':
                    uiManager.ins().show(UI_CONFIG_NAME.DlgFrame, 1, 5, res.data.num);
                    break;
                case 'add':
                    Game.ApiManager.openYaoyiYao('add');
                    break;
                case 'game':
                    Game.ApiManager.openYaoyiYao('game');
                    break;
                case 'balance'://红包
                    uiManager.ins().show(UI_CONFIG_NAME.DlgRedBagPanel, 4);
                    break;
                default:
                    break;
            }
        }
        var funerr = function (res) {
            Game.gameManager.gameTips("点击太快了")
        }
        Game.HttpManager.sendRequest("/api/recreation/shake", null, funSuc, funerr)
    }
}

type Btnnodes = {
    name: string;
    node: cc.Node;
}
