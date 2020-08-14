import { uiManager } from "../common/ui/uiManager";
import { uiFormType, UI_CONFIG_NAME, uiFormPath, musicPath } from "../common/config/gameConfigs";
import BigVal from "../common/bigval/BigVal";
import dataManager from "./dataManager";
import cfgManager from "./CfgManager";
//长连接
import { WebSock } from "../common/net/WebSock";
import { NetManager } from "../common/net/NetManager";
import { NetNode } from "../common/net/NetNode";
import { DefStringProtocol, NetData, INetworkTips } from "../common/net/NetInterface";
import websockeConfig from "./websockeConfig";
import pictureManager from "./pictureManager";
import musicManager from "../common/music/musicManager";
import baseHandle from "../common/massage/baseHandle";

import DlgSuperTurnTable from "../dlg/DlgSuperTurnTable";
import tsAddLayer from "../common/tsAddLayer";

var callbackShop: Function = function () { };
var shopBuyLv: number = 1;
const { ccclass, property } = cc._decorator;

class NetTips implements INetworkTips {
    connectTips(isShow: boolean): void {

    }

    reconnectTips(isShow: boolean): void {

    }

    requestTips(isShow: boolean): void {

    }
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    birdBornFather: cc.Node = null;

    @property(cc.Prefab)
    blockFaps: cc.Prefab = null;

    @property(cc.Prefab)
    game_Tips: cc.Prefab = null;


    onLoad() {
        console.log("main")
        this.initGame();
        tsAddLayer.getIns().initSynthesizePetLayer();
    }

    /**游戏初始化 */
    initGame() {
        cfgManager.ins().sendMessOfGuanggaoType();//获取广告类型
        cfgManager.ins().getRunPlatform();//判断运行环境
        cfgManager.ins().openGuangGao();//开启广告

        //加载上框和下框
        uiManager.ins().show(UI_CONFIG_NAME.Tops);
        uiManager.ins().show(UI_CONFIG_NAME.Bottom);

        this.AddAppListen();
        this.addWebSocket();
        this.sendHttpGetMsg();
    }

    start() {
        // this.scheduleOnce(() => {
        //     this.CreateBirdOfLast();
        //     this.isHave_XsLong();
        // }, 0.5)

        // this.scheduleOnce(() => {
        //     this.isBird_reward();
        // }, 2);
        // tsAddLayer.getIns().guideFirst();
    }

    /**设定长连接监听 */
    addWebSocket() {
        let Node = new NetNode();
        Node.init(new WebSock(), new DefStringProtocol(), new NetTips());
        Node.setResponeHandler(0, (cmd: number, data: NetData) => {
            let res = JSON.parse(data as string);
            this.swicthWebsocket(res);
        });
        NetManager.getInstance().setNetNode(Node);
        NetManager.getInstance().connect({ url: websockeConfig.ins().URL, autoReconnect: -1 })
    }
    /**根据长连接的返回参数做回应 */
    swicthWebsocket(res: any) {
        if (res.code == 0) {
            let typenum = Number(res.msg);
            switch (typenum) {
                case 0:
                    this.initMenuBuy(res);
                    break;
                case 1:
                    dataManager.ins().TotalCoins = BigVal.Sub(dataManager.ins().TotalCoins, dataManager.ins().shop_buy_price); //总金币减少
                    cfgManager.ins().Tops.initCoinOfTotal();
                    this.addBird(shopBuyLv);
                    callbackShop(res.data.shop_price);
                    this.initMenuBuy(res);
                    break;
                case 2:
                    this.addBird(shopBuyLv);
                    dataManager.ins().FHBC = dataManager.ins().FHBC - dataManager.ins().shop_buy_Fhbc;
                    cfgManager.ins().Tops.initFHBC();
                    this.initMenuBuy(res);
                    break;
                case 3:
                    // console.log('位置信息保存成功');
                    break;
                case 4:
                    if (res.data.invite_ticket) {
                        dataManager.ins().inviteJuan = res.data.invite_ticket;
                    }
                    if (res.data.mbc) {
                        dataManager.ins().FHBC = Number(res.data.mbc);
                        cfgManager.ins().Tops.initFHBC();
                    }
                    // if (res.data.mbc && dataManager.ins().FHBC != Number(res.data.mbc)) {
                    //     dataManager.ins().FHBC = Number(res.data.mbc);
                    //     cfgManager.ins().Tops.initFHBC();
                    // }
                    break;
                default:
                    break;
            }
        } else if (res.code == 200) { //连接成功
            websockeConfig.ins().sendMessageFrist();
            dataManager.ins().isCloseWebSocket = false;
        } else if (res.code == 401) { //fd过期(断开重连)
            console.log("fd过期+++++++401")
            NetManager.getInstance().close();
            setTimeout(() => {
                NetManager.getInstance().connect({ url: websockeConfig.ins().URL, autoReconnect: -1 })
            }, 1000)
        } else if (res.code == 403) { //token过期
            console.log("token过期+++++++403")
            dataManager.ins().isCloseWebSocket = true;
            NetManager.getInstance().close();
            cfgManager.ins().http.lostToken();
        } else { //其他情况
            console.log("特殊情况", res);
        }
    }

    /**主界面购买健的刷新+每秒产比的刷新 */
    initMenuBuy(res: any) {
        dataManager.ins().buy_level = res.data.level;
        dataManager.ins().buy_price = new BigVal(res.data.price);
        cfgManager.ins().Bottom.initmessBtnBuy();
        cfgManager.ins().Tops.initCoinOfSecond();
    }

    /**购买鸟（主界面0，商店（金币1/钻石2），） */
    buyPet(type: number, shopnum?: number, call?: Function) {
        let blockItem0 = this.getEmpty();
        if (!blockItem0) {
            var string_0 = "位置满了，请合成或者拖到右下角回收";
            this.gameTips(string_0);
            return;
        }
        let param: {} = {};
        let data: string = "";
        switch (type) {
            case 0:
                tsAddLayer.getIns().guideFirst();
                dataManager.ins().TotalCoins = BigVal.Sub(dataManager.ins().TotalCoins, dataManager.ins().buy_price); //总金币减少
                cfgManager.ins().Tops.initCoinOfTotal();
                this.addBird(dataManager.ins().buy_level);
                param = {
                    id: dataManager.ins().buy_level,
                    type: type
                }
                data = websockeConfig.ins().Long_save("buy", param);
                break;
            case 1:
                shopBuyLv = shopnum;
                callbackShop = call;
                param = {
                    id: shopnum,
                    type: type
                }
                data = websockeConfig.ins().Long_save("buy", param);
                break;
            case 2:
                shopBuyLv = shopnum;
                param = {
                    id: shopnum,
                    type: type
                }
                data = websockeConfig.ins().Long_save("buy", param);
                break;
        }
        musicManager.ins().playEffectMusic(musicPath.buyshopclip)
        setTimeout(() => {
            NetManager.getInstance().send(data)
        }, 0);
    }

    /**购买成功后添加鸟 */
    public addBird(numlv: number, type?: any, timer?: number) {
        let blockItem = this.getEmpty();
        if (!blockItem) {
            var string_0 = "位置满了，请合成或者拖到右下角回收";
            this.gameTips(string_0);
            return;
        }
        blockItem.getComponent("block").setNumber(numlv, type, timer); //关键的一步 添加不同等级的鸟
    }

    /**根据上次记录生成鸟的位置 */
    CreateBirdOfLast() {
        var isHaveBird = dataManager.ins().isHaveBird; //是否有鸟,以及鸟的等级等（37级以下包括37）；
        var Birds = this.birdBornFather.children;
        for (let i = 0; i < Birds.length; i++) {
            if (isHaveBird[i] > 0 && isHaveBird[i] < 48) {
                Birds[i].getComponent("block").setNumber(isHaveBird[i]);
            }
        }
    }

    /**是否有奖励的鸟 */
    isBird_reward() {
        if (dataManager.ins().bird_admin != 1) return;
        let blockItem0 = this.getEmpty();
        if (!blockItem0) return;
        var self = this;
        var funSuc = function (ret) {
            if (ret.id < 48 && ret.id > 0) {
                self.addBird(ret.id, 2);
            }
        }
        var funErr = function (ret) { }
        let params = {}
        try {
            cfgManager.ins().http.sendRequest('/api/game/birdAdmin', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    /**是否有限时分红龙 */
    isHave_XsLong() {
        let xianShi: Array<number> = dataManager.ins().fenhong_breakerBird;
        xianShi.forEach((value: number) => {
            this.addBird(47, 3, value);
        })

    }

    /**所有游戏中的的提示，弹框的克隆 */
    gameTips(str: string, isSpecial = false) {
        var canvas = cc.find("Canvas");
        let gameTip = cc.instantiate(this.game_Tips);
        gameTip.getComponent("gameTips").initMessage(str, isSpecial);
        gameTip.parent = canvas;
    }

    /**添加APP的监听 */
    AddAppListen() {
        try {
            var self = this;
            api.addEventListener({
                name: "refreshGameEvent"
            },
                function (ret, err) {
                    console.log(JSON.stringify(ret));
                    console.log(JSON.stringify(err));
                    console.log(cfgManager.ins().videocallback);
                    var type = ret.value.type;
                    switch (type) {
                        case "videoEnd": //看完视频
                            self.check_video_back(); //检查看视频的回调
                            break;
                        case "closeSound": //离开首页
                            dataManager.ins().isHoutai = true; //关闭音效
                            let ispauseGame = cc.game.isPaused();
                            if (!ispauseGame) {
                                console.log("暂停游戏");
                                dataManager.ins().now_time = Number(new Date().getTime() / 1000);
                                cc.game.pause();
                            }
                            break;
                        case "openSound": //点击首页
                            dataManager.ins().isHoutai = false;
                            let ispauseGame_1 = cc.game.isPaused();
                            if (ispauseGame_1) {
                                console.log("恢复暂停");
                                cc.game.resume();
                                let now_times = Number(new Date().getTime() / 1000);
                                dataManager.ins().rest_time -= (now_times - dataManager.ins().now_time);
                            }
                            break;
                        case "addGold": //金币刷新
                            let num_0 = ret.value.params.num;
                            let goldadd = new BigVal(num_0);
                            dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, goldadd); //金币总数量
                            cfgManager.ins().Tops.initCoinOfTotal();
                            break;
                        case "fhbc": //fhbc刷新
                            let num_1 = ret.value.params.num;
                            dataManager.ins().FHBC = Number(num_1); //fhbc
                            cfgManager.ins().Tops.initFHBC();
                            break;
                        case "addFhbc": //fhbc加
                            let num_2 = ret.value.params.num;
                            dataManager.ins().FHBC = dataManager.ins().FHBC + Number(num_2); //fhbc
                            cfgManager.ins().Tops.initFHBC();
                            break;
                        case "conversionDragon": //变异龙
                            let dragon_costNum = Number(ret.value.dragonType.price);
                            if (isNaN(dragon_costNum)) {
                                break;
                            }
                            if (ret.value.dragonType.level == 0) { //邀请券
                                dataManager.ins().inviteJuan -= dragon_costNum;
                            } else {//mbc
                                dataManager.ins().FHBC -= dragon_costNum;
                                cfgManager.ins().Tops.initFHBC();
                            }
                            break;
                    }
                }
            );
        } catch (e) {
            console.log("添加视频监听");
        }
    }

    /**进入游戏检查视频回调用的方法 */
    check_video_back() {
        var type = cfgManager.ins().videocallback; //类型
        if (type == "") return;
        var num_back = cfgManager.ins().videoCallvalue; //价值
        switch (type) {
            case "quan": //转盘券
                var call = function () {
                    dataManager.ins().NumOfTurntables = dataManager.ins().NumOfTurntables + Number(num_back);
                    cfgManager.ins().showFrameBack(1, num_back);
                    dataManager.ins().addQuan_Video = dataManager.ins().addQuan_Video - 1;
                };
                this.sendWatchAndAward(call, 1); //看完视频的接口（转盘券）
                break;
            case "box": //宝箱
                var call1 = function () {
                    cfgManager.ins().showFrameBack(2, num_back);
                };
                this.sendWatchAndAward(call1, 2, num_back); //看完视频的接口（宝箱）
                break;
            case "coin": //金币
                var call2 = function () {
                    let coin_back = new BigVal(num_back);
                    dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, coin_back); //把金币加上
                    cfgManager.ins().Tops.initCoinOfTotal(); //显示金币总数
                    cfgManager.ins().showFrameBack(3, coin_back); //显示奖励的弹框
                };
                this.sendMes_videoback(call2, 3); //看完视频的接口（宝箱）
                break;
            case "speed": //加速
                var call3 = function () {
                    cfgManager.ins().Bottom.speed_video_back(num_back);
                }.bind(this);
                this.sendMes_videoback(call3, 4); //看完视频的接口（宝箱）
                break;
            case "coins": //飞天宝箱
                var call4 = function () {
                    let coin_back = new BigVal(num_back);
                    dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, coin_back); //把金币加上
                    cfgManager.ins().Tops.initCoinOfTotal(); //显示金币总数
                    cfgManager.ins().Box.HomingOfBox(); //箱子归位
                    cfgManager.ins().showFrameBack(3, coin_back); //显示奖励的弹框
                }.bind(this);
                this.sendMes_videoback(call4, 9); //看完视频的接口（宝箱）
                break;
            case "offlineCoin": //离线奖励
                var call2 = function () {
                    let coin_back = new BigVal(num_back);
                    dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, coin_back); //把金币加上
                    cfgManager.ins().Tops.initCoinOfTotal(); //显示金币总数
                    cfgManager.ins().showFrameBack(3, coin_back); //显示奖励的弹框
                };
                this.sendWatchAndAward(call2, 3); //看完视频的接口（宝箱）
                break;
            case "superTurnTable": //超级转盘
                let PopUp = cc.find(uiFormPath.PopUp);
                let superTurnTableNode = PopUp.getChildByName("DlgSuperTurnTable");
                if (!superTurnTableNode) {
                    console.log("no find superTurnTableNode")
                } else {
                    superTurnTableNode.getComponent(DlgSuperTurnTable).videoCallback();
                }
                break;
        }
    }

    /**看完视频参数的加减(宝箱和转盘券) */
    sendMes_videoback(call, type_0, numo?: number) {
        var self = this;
        var funSuc = function (ret) {
            if (type_0 <= 4 || type_0 == 9) {
                dataManager.ins().NumberOfVideosLeft = dataManager.ins().NumberOfVideosLeft - 1;
                self.Watch_restTime(); //限定视频时间
            } else {
                dataManager.ins().inviteJuan = dataManager.ins().inviteJuan - 1;
                dataManager.ins().restOfJuan = dataManager.ins().restOfJuan - 1;
            }
            call();
        }
        var funErr = function (ret) {
            let string_0 = "网络连接回调失败，请稍后重试";
            self.gameTips(string_0);
        }
        let params = { //几倍宝箱
            type: type_0,
            num: numo
        }
        try {
            cfgManager.ins().http.sendRequest("/portal/game/videoReward", params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 上报看视频及给奖励
     * @param call 
     * @param type 
     * @param numo 
     */
    sendWatchAndAward(cb, type, num = 0) {
        let video_type = dataManager.ins().video_type;
        let model_type = "";
        let videoAwardType = 0;
        if (type == 3) { //离线视频
            model_type = "offline_earnings";
            videoAwardType = 3;
        } else if (type == 1) { //幸运转盘---增加转盘券
            model_type = "lucky_turnplate"
            videoAwardType = 1;
        } else if (type == 2) { //幸运转盘---宝箱
            model_type = "lucky_turnplate"
            videoAwardType = 2;
        }

        let videoParam = {
            type: videoAwardType,
            num: num,
            ad_type: video_type,
        }

        this.sendVideoRecord(video_type, model_type, videoParam, cb);
    }

    sendVideoRecord(video_type, model_type, videoParam, cb) {
        let self = this;
        let suc = (msg) => {
            self.sendVideoAward(videoParam, cb);
        }
        let fail = () => {
            var string_0 = "观看广告上报失败";
            cfgManager.ins().gameManager.gameTips(string_0);
        }
        baseHandle.ins()._mainHandle.sendWatchVideoRecode(model_type, video_type, suc, fail)
    }

    /**向服务器请求获取奖励*/
    sendVideoAward(videoParam, cb) {
        var self = this;
        var funSuc = function (ret) {
            if (typeof cb == "function") {
                cb();
            }
        }
        var funErr = function (ret) {
            var string_0 = "请勿重复点击";
            cfgManager.ins().gameManager.gameTips(string_0);
        }
        try {
            baseHandle.ins()._mainHandle.sendVideoAward(videoParam, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    /*
     *测试接口 
     */
    testWatchVideoFunc(str?) {
        this.check_video_back();
    }

    /**看视频的间隔 */
    Watch_restTime() {
        dataManager.ins().resttime_video = 15;
        var callback = function () {
            if (dataManager.ins().resttime_video == 0) {
                this.unschedule(callback);
            }
            dataManager.ins().resttime_video--;
        }
        this.schedule(callback, 1);
    }
    // update (dt) {}

    //获取一些通用的请求
    sendHttpGetMsg() {
        baseHandle.ins()._mainHandle.sendGetTuLongNotice(); //获取通用请求
        baseHandle.ins()._superTurnTableHandle.sendGetSuperTurnTable(); //获取所有的转盘奖励
    }

}

