/*********本脚本主要执行net 前端api 全局Event事件处理及主界面相关window入口的初始化******* */

import { uiManager } from "../common/ui/uiManager";
import { UI_CONFIG_NAME, uiFormPath, } from "../common/base/gameConfigs";
import BigVal from "../common/bigval/BigVal";
import boxMove from "./BoxMove";

//长连接
import pictureManager from "./pictureManager";
import { Game } from "./Game";
import { EventDispatch, Event_Name } from "../event/EventDispatch";
import { G_baseData } from "../data/baseData";
import websocketHandler from "../net/websocketHandler";
import petWindow from "../wnd/petWindow";
import guideWindow from "../wnd/guideWindow";

var callbackShop: Function = function () { };
const { ccclass, property } = cc._decorator;

@ccclass
export default class main extends cc.Component {
    @property(cc.Node)
    birdBornFather: cc.Node = null;

    @property(cc.Prefab)
    blockFaps: cc.Prefab = null;

    @property(cc.Prefab)
    game_Tips: cc.Prefab = null;

    private guideWnd: guideWindow;//引导界面
    private petWnd: petWindow;//宠物界面

    onLoad() {
        this.initGame();
    }

    onDestroy() {
        EventDispatch.ins().remove(Event_Name.MAIN_MSG, this.recvEventMsg.bind(this))
    }

    /**游戏初始化 */
    initGame() {
        this.addWebSocket();
        this.AddAppListen();
        this.initModules();

        //加载上框和下框
        uiManager.ins().show(UI_CONFIG_NAME.Tops);
        uiManager.ins().show(UI_CONFIG_NAME.Bottom);
    }

    initModules() {
        Game.gameManager = this;
        Game.Box = cc.find("Canvas/UIROOT/FlyBox").getComponent(boxMove);

        //加载宠物界面
        this.petWnd = cc.find("Canvas/UIROOT/Middle/Panel_bird").getComponent(petWindow);
        this.petWnd.initGame();
        this.guideWnd = cc.find("Canvas/guideLayer").getComponent(guideWindow);
        this.guideWnd.guideFirst();

        //广告
        Game.ApiManager.sendMessOfGuanggaoType();//获取广告类型
        Game.ApiManager.openGuangGao();
    }

    /**设定长连接监听 */
    addWebSocket() {
        let self = this;
        websocketHandler.ins().addWebSocket(function (res) {
            self.switchWebsocket(res);
        }.bind(this));
    }

    /**根据长连接的返回参数做回应 */
    switchWebsocket(res: any) {
        let self = this;
        if (res) {
            let type: string = res.method;
            let data: any = res.data;
            let err: any = res.error;
            switch (type) {
                case "bird.buy":
                    self.buyBirdCb(err, data);
                    break;
                case 'gold.refresh':
                    self.goldRefreshCb(err, data);
                    break;
                case 'bird.compose38':
                    self.composePTCb(err, data);
                    break;
                case 'bird.compose47':
                    self.composeSPCb(err, data);
                    break;
                case 'server.auth'://403
                    self.websocketLost();
                    break;
                case 'bird.offer'://奖励的鸟
                    self.awardBirdCb(err, data);
                    break;
            }
        }
    }

    /**添加APP的监听 */
    AddAppListen() {
        try {
            var self = this;
            api.addEventListener({
                name: "refreshGameEvent"
            },
                function (ret, err) {
                    var type = ret.value.type;
                    switch (type) {
                        case "videoEnd": //看完视频
                            self.watchVideoEndCb(); //检查看视频的回调
                            break;
                        case "closeSound": //离开首页
                            self.levelMainPageCb();
                            break;
                        case "openSound": //点击首页
                            self.enterMainPageCb();
                            break;
                        case "addGold": //金币刷新
                            break;
                        case "fhbc": //fhbc刷新
                            break;
                        case "addFhbc": //fhbc加
                            break;
                    }
                }
            );
        } catch (e) {
            console.log("添加视频监听");
        }
    }

    //全局的事件监听
    addEventListenerEvent() {
        EventDispatch.ins().add(Event_Name.MAIN_MSG, this.recvEventMsg.bind(this), this)
    }

    //全局事件回调
    recvEventMsg(msg) {
        switch (msg.type) {
            case "gameTips":
                this.gameTips(msg.value);
                break;
            default:
                break;
        }
    }

    RestartGame() {
        cc.tween(this.node)
            .delay(2)
            .call(() => {
                //cc.game.
                websocketHandler.ins().webSocketClose();
                cc.director.loadScene('Loading');
            })
            .start();

    }

    /***********websocket监听回调*********************** */
    /**
    * 购买宠物回调
    * @param data 
    */
    buyBirdCb(err, data) {
        if (err || !!!data) return;
        if (data.scene === "home") {
            this.initMenuBuy(data.recommend);
        } else if (data.scene === "shop") {
            if (data.pay === "gold") {
                callbackShop(data.shop.price);
                this.initMenuBuy(data.recommend);
            } else if (data.pay === "fhbc") {
                G_baseData.userData.FHBC = G_baseData.userData.FHBC - G_baseData.petData.shop_buy_Fhbc;
                Game.Tops.initFHBC();
                this.initMenuBuy(data.recommend);
            }
            Game.Tops.initCoinOfTotal();
        }
    }

    /**主界面购买健的刷新+每秒产比的刷新 */
    initMenuBuy(res: any) {
        G_baseData.petData.buy_level = Number(res.bird);
        G_baseData.petData.buy_price = new BigVal(res.price);
        Game.Bottom.initmessBtnBuy();
        Game.Tops.initCoinOfSecond();
        websocketHandler.ins().save_Birds_local();
    }

    /**
     * 金币刷新回调
     * @param data 
     */
    goldRefreshCb(err, data) {
        if (err || !!!data) return;
        G_baseData.userData.RefreshGold(data.gold, data.timestamp);
        Game.Tops.initCoinOfTotal();
    }

    /**
     * 合成38级以下鸟
     * @param data 
     */
    composePTCb(err, data) {
        if (err || !!!data) {
            EventDispatch.ins().fire(Event_Name.composeBest, 0)
            return;
        }
        let reward_id: number = Number(data.bird);
        EventDispatch.ins().fire(Event_Name.composeBest, reward_id)
    }

    /**
     * 合成47级鸟
     * @param data
     */
    composeSPCb(err, data) {
        if (err) {
            EventDispatch.ins().fire(Event_Name.composeFive, 1)
            return;
        }
        EventDispatch.ins().fire(Event_Name.composeFive, 0)
    }

    /**
     * 奖励的鸟
     * @param err 
     * @param data 
     */
    awardBirdCb(err, data) {
        if (err || !!!data) return;
        this.petWnd.isBird_reward(data);
    }

    websocketLost() {
        websocketHandler.ins().webSocketClose();
        Game.HttpManager.lostToken();
    }

    /************与前端api交互回调***************** */
    /**
     * 观看视频结束
     */
    watchVideoEndCb() {
        this.check_video_back();
    }

    /**
     * 离开首页
     */
    levelMainPageCb() {
        G_baseData.userData.isHoutai = true; //关闭音效
    }

    /**
     * 进入首页
     */
    enterMainPageCb() {
        G_baseData.userData.isHoutai = false;
        let ispauseGame_1 = cc.game.isPaused();
        if (ispauseGame_1) {
            // console.log("恢复暂停");
            cc.game.resume();
        }
    }

    /**进入游戏检查视频回调用的方法 */
    check_video_back() {
        var type = Game.ApiManager.videocallback; //类型
        if (type == "") return;
        var num_back = Game.ApiManager.videoCallvalue; //价值
        switch (type) {
            case "quan": //转盘券
                var call = function () {
                    G_baseData.userData.NumOfTurntables = G_baseData.userData.NumOfTurntables + Number(num_back);
                    Game.gameManager.showFrameBack(1, num_back);
                    G_baseData.userData.addQuan_Video = G_baseData.userData.addQuan_Video - 1;
                };
                this.sendMes_videoback(call, 1); //看完视频的接口（转盘券）
                break;
            case "box": //宝箱
                var call1 = function () {
                    Game.gameManager.showFrameBack(2, num_back);
                };
                this.sendMes_videoback(call1, 2, num_back); //看完视频的接口（宝箱）
                break;
            case "coin": //金币
                var call2 = function () {
                    let coin_back = new BigVal(num_back);
                    Game.gameManager.showFrameBack(3, coin_back); //显示奖励的弹框
                };
                this.sendMes_videoback(call2, 3); //看完视频的接口（宝箱）
                break;
            case "speed": //加速
                var call3 = function () {
                    Game.Bottom.speed_video_back(num_back);
                    websocketHandler.ins().save_speedDouble(num_back);
                }.bind(this);
                this.sendMes_videoback(call3, 4); //看完视频的接口（宝箱）
                break;
            case "coins": //飞天宝箱
                var call4 = function () {
                    let coin_back = new BigVal(num_back);
                    Game.Box.HomingOfBox(); //箱子归位
                    Game.gameManager.showFrameBack(3, coin_back); //显示奖励的弹框
                }.bind(this);
                this.sendMes_videoback(call4, 9); //看完视频的接口（宝箱）
                break;
        }
    }

    /**看完视频参数的加减(宝箱和转盘券) */
    sendMes_videoback(call, type_0, numo?: number) {
        var self = this;
        var funSuc = function (ret) {
            if (ret.code == 0) {
                if (type_0 <= 4 || type_0 == 9) {
                    G_baseData.userData.NumberOfVideosLeft = G_baseData.userData.NumberOfVideosLeft - 1;
                    self.Watch_restTime(); //限定视频时间
                } else {
                    G_baseData.userData.inviteJuan = G_baseData.userData.inviteJuan - 1;
                    G_baseData.userData.restOfJuan = G_baseData.userData.restOfJuan - 1;
                }
                if (ret.data.amount != 0) {
                    G_baseData.userData.RefreshGold(ret.data.amount.toString(), ret.data.update_time);
                    Game.Tops.initCoinOfTotal();
                }
                call(ret.data);
            }
        }
        var funErr = function (ret) {
            let string_0 = "网络连接回调失败，请稍后重试";
            self.gameTips(string_0);
        }
        let params = { //几倍宝箱
            ad_type: Game.ApiManager.ad_type,
            type: type_0,
            num: numo
        }
        try {
            Game.HttpManager.sendRequest("/api/game/videoReward", params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    /**看视频的间隔 */
    Watch_restTime() {
        G_baseData.userData.resttime_video = 15;
        var callback = function () {
            if (G_baseData.userData.resttime_video == 0) {
                this.unschedule(callback);
            }
            G_baseData.userData.resttime_video--;
        }
        this.schedule(callback, 1);
    }

    /**看完 视频 获得奖励的弹框 转盘券1 金币2 宝箱3  mbc 4 */
    showFrameBack(index: number, num: any) {
        if (index == 1) {
            this.shuaxinShowQaun();
        } else {
            //参数1打开第二种,Frame界面仅为展示界面，道具获取逻辑，理应写在调用此方法的外层
            uiManager.ins().show(UI_CONFIG_NAME.DlgFrame, 1, index, num)
        }
    }

    /**看完视频刷新转盘券*/
    shuaxinShowQaun() {
        let PopUp = cc.find(uiFormPath.PopUp);
        let zhuangpan = PopUp.getChildByName("DlgZhuanPan");
        if (!zhuangpan) {
            console.log("no find")
        } else {
            zhuangpan.getComponent("DlgZhuanPan").callbackReward();
        }
    }

    /************与main相关的全局事件回调***************** */

    /**所有游戏中的的提示，弹框的克隆 */
    gameTips(str: string) {
        var canvas = cc.find("Canvas");
        let gameTip = cc.instantiate(this.game_Tips);
        gameTip.getComponent("gameTips").initMessage(str);
        gameTip.parent = canvas;
    }

    /****************window层事件******************* */
    //引导
    guideFirst() {
        this.guideWnd.guideFirst();
    }

    /**获取空的地方 */
    public getEmpty(): cc.Node {
        var emptyBlock: cc.Node = this.petWnd.getEmpty();
        return emptyBlock;
    }

    /**
     * 购买鸟
     * @param type 0主页 1商店金币 2商店MBC
     * @param birdId 鸟id
     * @param call 回调
     */
    buyBird(type: number, birdId?: number, call?: Function) {
        this.petWnd.buyBird(type, birdId, call)
    }

    /**
     * 购买成功后添加鸟 
     * @param numLv 等级 
     * @param type type=2奖励的鸟有奖励弹框
     * @param weizhiindex 传入鸟的位置信息
     */
    public addBird(numLv: number, type?: number, timer?: number) {
        let blockItem = this.petWnd.addBird(numLv, type, timer);
        return blockItem;
    }
}

