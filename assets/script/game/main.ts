import { uiManager } from "../common/ui/uiManager";
import { uiFormType, UI_CONFIG_NAME, uiFormPath, musicPath } from "../common/base/gameConfigs";
import BigVal from "../common/bigval/BigVal";
import userData from "../data/userData";
import boxMove from "./BoxMove";

//长连接
import { WebSock } from "../common/net/WebSock";
import { NetManager } from "../common/net/NetManager";
import { NetNode } from "../common/net/NetNode";
import { DefStringProtocol, NetData, INetworkTips } from "../common/net/NetInterface";
import websockeConfig from "./websockeConfig";
import pictureManager from "./pictureManager";
import musicManager from "../common/music/musicManager";
import { Game } from "./Game";
import { EventDispatch, Event_Name } from "../common/event/EventDispatch";
import { G_baseData } from "../data/baseData";

var callbackShop: Function = function () { };
const { ccclass, property } = cc._decorator;

class NetTips implements INetworkTips {
    connectTips(isShow: boolean): void {
        console.log("------", uiManager.ins())
        if (isShow) {
            uiManager.ins().waiting.showtips("网络开小差了")
        } else {
            uiManager.ins().waiting.hidetips(true);
        }
    }

    reconnectTips(isShow: boolean): void {
        if (isShow) {
            uiManager.ins().waiting.showtips("网络重接中")
        } else {
            uiManager.ins().waiting.hidetips(true);
        }
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
        Game.HttpManager.GetHttpUrl();
        this.SetGame();
        this.initGame();
    }

    SetGame() {
        Game.gameManager = this;
        Game.ParentItem = cc.find("Canvas/birdMoveFther");
        Game.Box = cc.find("Canvas/UIROOT/FlyBox").getComponent(boxMove);
    }

    /**游戏初始化 */
    initGame() {
        this.addWebSocket();
        this.AddAppListen();

        let manager = cc.director.getCollisionManager(); // 获取碰撞检测类
        manager.enabled = true; //开启碰撞检测
        // manager.enabledDebugDraw = true;

        //加载上框和下框
        uiManager.ins().show(UI_CONFIG_NAME.Tops);
        uiManager.ins().show(UI_CONFIG_NAME.Bottom);
        this.drawBgBlocks();
    }

    start() {
        this.scheduleOnce(() => {
            this.CreateBirdOfLast();
            this.isHave_XsLong();
        }, 0.5)
        pictureManager.getIns().guideFrist();
        Game.ApiManager.sendMessOfGuanggaoType();//获取广告类型
        Game.ApiManager.openGuangGao();
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
        if (res) {
            let type: string = res.method;
            let data: any = res.data;
            let err: any = res.error;
            switch (type) {
                case "bird.buy":
                    if (data) {
                        if (data.scene === "home") {
                            this.initMenuBuy(data.recommend);
                        } else if (data.scene === "shop") {
                            if (data.pay === "gold") {
                                callbackShop(data.shop.price);
                                this.initMenuBuy(data.recommend);
                            } else if (data.pay === "fhbc") {
                                userData.ins().FHBC = userData.ins().FHBC - G_baseData.petData.shop_buy_Fhbc;
                                Game.Tops.initFHBC();
                                this.initMenuBuy(data.recommend);
                            }
                            Game.Tops.initCoinOfTotal();
                        }
                    }
                    break;
                case 'gold.refresh':
                    {
                        if (err) return;
                        if (data) {
                            userData.ins().RefrushGold(data.gold, data.timestamp);
                            Game.Tops.initCoinOfTotal();
                        }
                    }
                    break;
                case 'bird.compose38':
                    {
                        if (err) {
                            EventDispatch.ins().fire(Event_Name.composeBest, 0)
                            return;
                        }
                        if (data) {
                            let reward_id: number = Number(data.bird);
                            EventDispatch.ins().fire(Event_Name.composeBest, reward_id)
                        }
                    }
                    break;
                case 'bird.compose47':
                    if (err) {
                        EventDispatch.ins().fire(Event_Name.composeFive, 1)
                        return;
                    }
                    EventDispatch.ins().fire(Event_Name.composeFive, 0)
                    break;
                case 'server.auth'://403
                    NetManager.getInstance().close();
                    Game.HttpManager.lostToken();
                    break;
                case 'bird.offer'://奖励的鸟
                    this.isBird_reward(data);
                    break;
            }
        }
    }

    RestartGame() {
        cc.tween(this.node)
            .delay(2)
            .call(() => {
                //cc.game.
                NetManager.getInstance().close();
                cc.director.loadScene('Loading');
            })
            .start();

    }

    /**主界面购买健的刷新+每秒产比的刷新 */
    initMenuBuy(res: any) {
        G_baseData.petData.buy_level = Number(res.bird);
        G_baseData.petData.buy_price = new BigVal(res.price);
        Game.Bottom.initmessBtnBuy();
        Game.Tops.initCoinOfSecond();
        websockeConfig.ins().save_Birds_local();
    }

    /**生成鸟窝 */
    private drawBgBlocks() {
        this.birdBornFather.getComponent(cc.Widget).updateAlignment();
        console.log("this.birdBornFather.height", this.birdBornFather.height);
        let catFatherHeigth = Math.floor(this.birdBornFather.height);
        if (catFatherHeigth >= 750) {
            G_baseData.petData.scaleBlock = 1;
        } else {
            G_baseData.petData.scaleBlock = Number((catFatherHeigth / 780).toFixed(1));
            console.log("缩放比例", G_baseData.petData.scaleBlock);
        }
        //记录鸟窝的编号的
        var num0: number = 0;
        let x = -250;
        //Y默认220
        let y = 220 + 190 * 2 * G_baseData.petData.scaleBlock;
        // //分布12个格子
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                let block = cc.instantiate(this.blockFaps);
                this.birdBornFather.addChild(block);

                block.scaleX = G_baseData.petData.scaleBlock;
                block.scaleY = G_baseData.petData.scaleBlock;
                block.setPosition(cc.v2(x, y));
                block.getComponent("block").init(num0++);
                x += 170;
            }
            y -= 180 * G_baseData.petData.scaleBlock;
            x = -250;
        }
    }

    /**获取空的地方 */
    public getEmpty(): cc.Node {
        var emptyBlock: cc.Node = null;
        var children = this.birdBornFather.children;
        for (var i = 0; i < children.length; ++i) {
            if (children[i].childrenCount == 0) {
                emptyBlock = children[i];
                //返回空的方格子
                return emptyBlock;
            }
        }
        return emptyBlock;
    }

    /**购买鸟（主界面0，商店（金币1/钻石2），） */
    buyBird(type: number, shopnum?: number, call?: Function) {
        let blockItem0 = this.getEmpty();
        if (!blockItem0) {
            var string_0 = "位置满了，请合成或者拖到右下角回收";
            this.gameTips(string_0);
            return;
        }
        switch (type) {
            case 0:
                pictureManager.getIns().guideFrist();
                let birdFather_0 = this.addBird(G_baseData.petData.buy_level);
                if (birdFather_0) {
                    userData.ins().TotalCoins = BigVal.Sub(userData.ins().TotalCoins, G_baseData.petData.buy_price); //总金币减少
                    Game.Tops.initCoinOfTotal(2);
                    websockeConfig.ins().saveBuyMess(G_baseData.petData.buy_level, "gold", "home")
                }
                break;
            case 1:
                callbackShop = call;
                let birdFather_1 = this.addBird(shopnum);
                if (birdFather_1) {
                    userData.ins().TotalCoins = BigVal.Sub(userData.ins().TotalCoins, G_baseData.petData.shop_buy_price); //总金币减少
                    Game.Tops.initCoinOfTotal(2);
                    websockeConfig.ins().saveBuyMess(shopnum, "gold", "shop")
                }
                break;
            case 2:
                let birdFather_2 = this.addBird(shopnum);
                if (birdFather_2) {
                    websockeConfig.ins().saveBuyMess(shopnum, "fhbc", "shop")
                }
                break;
        }
        musicManager.ins().playEffectMusic(musicPath.buyshopclip)
    }

    /**
     * 购买成功后添加鸟 
     * @param numlv 等级 
     * @param type type=2奖励的鸟有奖励弹框
     * @param weizhiindex 传入鸟的位置信息
     */
    public addBird(numlv: number, type?: number, timer?: number) {
        let blockItem = this.getEmpty();
        if (!blockItem) {
            var string_0 = "位置满了，请合成或者拖到右下角回收";
            this.gameTips(string_0);
            return;
        }
        blockItem.getComponent("block").setNumber(numlv, type, timer); //关键的一步 添加不同等级的鸟
        return blockItem;
    }


    /**根据上次记录生成鸟的位置 */
    CreateBirdOfLast() {
        var isHaveBird = G_baseData.petData.isHaveBird; //是否有鸟,以及鸟的等级等（37级以下包括37）；
        var Birds = this.birdBornFather.children;
        for (let i = 0; i < Birds.length; i++) {
            if (isHaveBird[i] > 0 && isHaveBird[i] < 48) {
                Birds[i].getComponent("block").setNumber(isHaveBird[i]);
            }
        }
    }

    /**是否有奖励的鸟 */
    isBird_reward(res: any) {
        let num = Number(res.bird);
        let birdFather_0 = this.addBird(num, 2);
        if (birdFather_0) {
            websockeConfig.ins().saveSureRewardBird(num);
            websockeConfig.ins().save_Birds_local();
        } else {
            websockeConfig.ins().saveSureRewardBird(0);
        }
    }


    /**是否有限时分红龙 */
    isHave_XsLong() {
        let xianShi =  G_baseData.petData.fenhong_breakerBird;
        for (let index = 0; index < xianShi.length; index++) {
            this.addBird(47, 3, xianShi[index]);
        }
    }

    /**所有游戏中的的提示，弹框的克隆 */
    gameTips(str: string) {
        var canvas = cc.find("Canvas");
        let gameTip = cc.instantiate(this.game_Tips);
        gameTip.getComponent("gameTips").initMessage(str);
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
                    // console.log(JSON.stringify(ret));
                    // console.log(JSON.stringify(err));
                    // console.log(Game.ApiManager.videocallback);
                    var type = ret.value.type;
                    switch (type) {
                        case "videoEnd": //看完视频
                            self.check_video_back(); //检查看视频的回调
                            break;
                        case "closeSound": //离开首页
                            userData.ins().isHoutai = true; //关闭音效
                            break;
                        case "openSound": //点击首页
                            userData.ins().isHoutai = false;
                            let ispauseGame_1 = cc.game.isPaused();
                            if (ispauseGame_1) {
                                // console.log("恢复暂停");
                                cc.game.resume();
                            }
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

    /**进入游戏检查视频回调用的方法 */
    check_video_back() {
        var type = Game.ApiManager.videocallback; //类型
        if (type == "") return;
        var num_back = Game.ApiManager.videoCallvalue; //价值
        switch (type) {
            case "quan": //转盘券
                var call = function () {
                    userData.ins().NumOfTurntables = userData.ins().NumOfTurntables + Number(num_back);
                    Game.gameManager.showFrameBack(1, num_back);
                    userData.ins().addQuan_Video = userData.ins().addQuan_Video - 1;
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
                    websockeConfig.ins().save_speedDouble(num_back);
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
                    userData.ins().NumberOfVideosLeft = userData.ins().NumberOfVideosLeft - 1;
                    self.Watch_restTime(); //限定视频时间
                } else {
                    userData.ins().inviteJuan = userData.ins().inviteJuan - 1;
                    userData.ins().restOfJuan = userData.ins().restOfJuan - 1;
                }
                if (ret.data.amount != 0) {
                    userData.ins().RefrushGold(ret.data.amount.toString(), ret.data.update_time);
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
        userData.ins().resttime_video = 15;
        var callback = function () {
            if (userData.ins().resttime_video == 0) {
                this.unschedule(callback);
            }
            userData.ins().resttime_video--;
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

}

