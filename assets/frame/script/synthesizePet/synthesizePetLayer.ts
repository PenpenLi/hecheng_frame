// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager";
import tsAddLayer from "../common/tsAddLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class synthesizePetLayer extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "鸟巢生成的位置"
    })
    birdBornFather: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "鸟移动的位置"
    })
    birdMoveFather: cc.Node = null;

    @property(cc.Prefab)
    blockPfb: cc.Prefab = null;

    @property(cc.Prefab)
    game_Tips: cc.Prefab = null;

    onLoad() {

    }

    start() {

    }

    /**游戏初始化 */
    public initGame() {
        let manager = cc.director.getCollisionManager(); // 获取碰撞检测类
        manager.enabled = true; //开启碰撞检测
        //TODO 加载bird名字 ????异步 有延时 
        cfgManager.ins().LogCfg();

        this.setBirdScale();
        this.drawBgBlocks();

        // this.AddAppListen();
        // this.addWebSocket();
        this.delayInit();
    }

    /**延迟生成鸟相关 */
    private delayInit() {
        //TODO 是否会出现0.5s时鸟巢仍没有加载完？
        this.scheduleOnce(() => {
            this.CreateBirdOfLast();
            this.isHave_XsLong();
        }, 0.5)

        this.scheduleOnce(() => {
            this.isBird_reward();
        }, 2);
        tsAddLayer.getIns().guideFirst();
    }

    /**
     *
     *小屏手机缩放尺寸
     *????效果 待验证
     */
    private setBirdScale() {
        this.birdBornFather.getComponent(cc.Widget).updateAlignment();
        let catFatherHeight = Math.floor(this.birdBornFather.height);
        let scale = 1;
        if (catFatherHeight < 750) {
            dataManager.ins().scaleBlock = Number((catFatherHeight / 780).toFixed(1));
            console.log("缩放比例", dataManager.ins().scaleBlock);
        }
        dataManager.ins().scaleBlock = scale;
        this.birdMoveFather.scale = scale
    }

    /**生成鸟窝 */
    private drawBgBlocks() {
        //记录鸟窝的编号的
        var num0: number = 0;
        console.log("生成鸟窝")
        const NestBottomY = 240; //最下层鸟巢距底高度（鸟巢贴底对齐）
        const NestYDistance = 180;//相邻鸟巢Y轴坐标差
        const NestLeftX = -250; //鸟巢最左中心点
        const NestXDistance = 170;//相邻鸟巢X轴坐标差

        let x = NestLeftX;
        let y = NestBottomY + NestYDistance * 2 * dataManager.ins().scaleBlock;
        // //分布12个格子
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                let block = cc.instantiate(this.blockPfb);
                this.birdBornFather.addChild(block);
                block.scaleX = dataManager.ins().scaleBlock;
                block.scaleY = dataManager.ins().scaleBlock;
                block.setPosition(cc.v2(x, y));
                block.getComponent("block").init(num0++);
                x += NestXDistance;
            }
            y -= NestYDistance * dataManager.ins().scaleBlock;
            x = NestLeftX;
        }
    }

    /**根据上次记录生成鸟的位置 */
    private CreateBirdOfLast() {
        var isHaveBird = dataManager.ins().isHaveBird; //是否有鸟,以及鸟的等级等（37级以下包括37）；
        var Birds = this.birdBornFather.children;
        for (let i = 0; i < Birds.length; i++) {
            if (isHaveBird[i] > 0 && isHaveBird[i] < 48) {
                Birds[i].getComponent("block").setNumber(isHaveBird[i]);
            }
        }
    }

    /**是否有限时分红龙 */
    private isHave_XsLong() {
        let xianShi: Array<number> = dataManager.ins().fenhong_breakerBird;
        xianShi.forEach((value: number) => {
            this.addBird(47, 3, value);
        })
    }

    /**是否有奖励的鸟 */
    private isBird_reward() {
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

    /**购买成功后添加鸟 */
    public addBird(numlv: number, type?: any, timer?: number) {
        let blockItem = this.getEmpty();
        if (!blockItem) {
            var string_0 = "位置满了，请合成或者拖到右下角回收";
            // this.gameTips(string_0); //TODO 弹框
            return;
        }
        blockItem.getComponent("block").setNumber(numlv, type, timer); //关键的一步 添加不同等级的鸟
    }

    /*************************hhhhhhh****************************** */

    // /**设定长连接监听 */
    // addWebSocket() {
    //     let Node = new NetNode();
    //     Node.init(new WebSock(), new DefStringProtocol(), new NetTips());
    //     Node.setResponeHandler(0, (cmd: number, data: NetData) => {
    //         let res = JSON.parse(data as string);
    //         this.swicthWebsocket(res);
    //     });
    //     NetManager.getInstance().setNetNode(Node);
    //     NetManager.getInstance().connect({ url: websockeConfig.ins().URL, autoReconnect: -1 })
    // }

    // /**根据长连接的返回参数做回应 */
    // swicthWebsocket(res: any) {
    //     if (res.code == 0) {
    //         let typenum = Number(res.msg);
    //         switch (typenum) {
    //             case 0:
    //                 this.initMenuBuy(res);
    //                 break;
    //             case 1:
    //                 dataManager.ins().TotalCoins = BigVal.Sub(dataManager.ins().TotalCoins, dataManager.ins().shop_buy_price); //总金币减少
    //                 cfgManager.ins().Tops.initCoinOfTotal();
    //                 this.addBird(shopBuyLv);
    //                 callbackShop(res.data.shop_price);
    //                 this.initMenuBuy(res);
    //                 break;
    //             case 2:
    //                 this.addBird(shopBuyLv);
    //                 dataManager.ins().FHBC = dataManager.ins().FHBC - dataManager.ins().shop_buy_Fhbc;
    //                 cfgManager.ins().Tops.initFHBC();
    //                 this.initMenuBuy(res);
    //                 break;
    //             case 3:
    //                 // console.log('位置信息保存成功');
    //                 break;
    //             case 4:
    //                 if (res.data.invite_ticket) {
    //                     dataManager.ins().inviteJuan = res.data.invite_ticket;
    //                 }
    //                 if (res.data.mbc) {
    //                     dataManager.ins().FHBC = Number(res.data.mbc);
    //                     cfgManager.ins().Tops.initFHBC();
    //                 }
    //                 // if (res.data.mbc && dataManager.ins().FHBC != Number(res.data.mbc)) {
    //                 //     dataManager.ins().FHBC = Number(res.data.mbc);
    //                 //     cfgManager.ins().Tops.initFHBC();
    //                 // }
    //                 break;
    //             default:
    //                 break;
    //         }
    //     } else if (res.code == 200) { //连接成功
    //         websockeConfig.ins().sendMessageFrist();
    //         dataManager.ins().isCloseWebSocket = false;
    //     } else if (res.code == 401) { //fd过期(断开重连)
    //         console.log("fd过期+++++++401")
    //         NetManager.getInstance().close();
    //         setTimeout(() => {
    //             NetManager.getInstance().connect({ url: websockeConfig.ins().URL, autoReconnect: -1 })
    //         }, 1000)
    //     } else if (res.code == 403) { //token过期
    //         console.log("token过期+++++++403")
    //         dataManager.ins().isCloseWebSocket = true;
    //         NetManager.getInstance().close();
    //         cfgManager.ins().http.lostToken();
    //     } else { //其他情况
    //         console.log("特殊情况", res);
    //     }
    // }

    // /**主界面购买健的刷新+每秒产比的刷新 */
    // initMenuBuy(res: any) {
    //     dataManager.ins().buy_level = res.data.level;
    //     dataManager.ins().buy_price = new BigVal(res.data.price);
    //     cfgManager.ins().Bottom.initmessBtnBuy();
    //     cfgManager.ins().Tops.initCoinOfSecond();
    // }




    // /**购买鸟（主界面0，商店（金币1/钻石2），） */
    // buyPet(type: number, shopnum?: number, call?: Function) {
    //     let blockItem0 = this.getEmpty();
    //     if (!blockItem0) {
    //         var string_0 = "位置满了，请合成或者拖到右下角回收";
    //         // this.gameTips(string_0);
    //         return;
    //     }
    //     let param: {} = {};
    //     let data: string = "";
    //     switch (type) {
    //         case 0:
    //             tsAddLayer.getIns().guideFirst();
    //             dataManager.ins().TotalCoins = BigVal.Sub(dataManager.ins().TotalCoins, dataManager.ins().buy_price); //总金币减少
    //             cfgManager.ins().Tops.initCoinOfTotal();
    //             this.addBird(dataManager.ins().buy_level);
    //             param = {
    //                 id: dataManager.ins().buy_level,
    //                 type: type
    //             }
    //             data = websockeConfig.ins().Long_save("buy", param);
    //             break;
    //         case 1:
    //             shopBuyLv = shopnum;
    //             callbackShop = call;
    //             param = {
    //                 id: shopnum,
    //                 type: type
    //             }
    //             data = websockeConfig.ins().Long_save("buy", param);
    //             break;
    //         case 2:
    //             shopBuyLv = shopnum;
    //             param = {
    //                 id: shopnum,
    //                 type: type
    //             }
    //             data = websockeConfig.ins().Long_save("buy", param);
    //             break;
    //     }
    //     musicManager.ins().playEffectMusic(musicPath.buyshopclip)
    //     setTimeout(() => {
    //         NetManager.getInstance().send(data)
    //     }, 0);
    // }





}


