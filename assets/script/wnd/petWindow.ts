import { musicPath } from "../common/base/gameConfigs";
import BigVal from "../common/bigval/BigVal";

//长连接
import musicManager from "../common/music/musicManager";
import { Game } from "../game/Game";
import { EventDispatch, Event_Name } from "../event/EventDispatch";
import { G_baseData } from "../data/baseData";
import websocketHandler from "../net/websocketHandler";

var callbackShop: Function = function () { };
const { ccclass, property } = cc._decorator;

@ccclass
export default class petWindow extends cc.Component {

    @property(cc.Node)
    birdBornFather: cc.Node = null;

    @property(cc.Prefab)
    blockFaps: cc.Prefab = null;

    onLoad() {

    }

    start() {

    }

    /**游戏初始化 */
    initGame() {
        let manager = cc.director.getCollisionManager(); // 获取碰撞检测类
        manager.enabled = true; //开启碰撞检测
        // manager.enabledDebugDraw = true;

        this.setBlockScale();
        this.drawBgBlocks();

        this.scheduleOnce(() => {
            this.CreateBirdOfLast();
            this.isHave_XsLong();
        }, 0.5)
    }

    /**
     * 设置鸟窝的缩放比例
     */
    private setBlockScale() {
        this.birdBornFather.getComponent(cc.Widget).updateAlignment();
        let catFatherHeight = Math.floor(this.birdBornFather.height);
        if (catFatherHeight >= 750) {
            G_baseData.petData.scaleBlock = 1;
        } else {
            G_baseData.petData.scaleBlock = Number((catFatherHeight / 780).toFixed(1));
            console.log("缩放比例", G_baseData.petData.scaleBlock);
        }
    }

    /**生成鸟窝 */
    private drawBgBlocks() {
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
                Game.gameManager.guideFirst();
                let birdFather_0 = this.addBird(G_baseData.petData.buy_level);
                if (birdFather_0) {
                    G_baseData.userData.TotalCoins = BigVal.Sub(G_baseData.userData.TotalCoins, G_baseData.petData.buy_price); //总金币减少
                    Game.Tops.initCoinOfTotal(2);
                    websocketHandler.ins().saveBuyMess(G_baseData.petData.buy_level, "gold", "home")
                }
                break;
            case 1:
                callbackShop = call;
                let birdFather_1 = this.addBird(shopnum);
                if (birdFather_1) {
                    G_baseData.userData.TotalCoins = BigVal.Sub(G_baseData.userData.TotalCoins, G_baseData.petData.shop_buy_price); //总金币减少
                    Game.Tops.initCoinOfTotal(2);
                    websocketHandler.ins().saveBuyMess(shopnum, "gold", "shop")
                }
                break;
            case 2:
                let birdFather_2 = this.addBird(shopnum);
                if (birdFather_2) {
                    websocketHandler.ins().saveBuyMess(shopnum, "fhbc", "shop")
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
            websocketHandler.ins().saveSureRewardBird(num);
            websocketHandler.ins().save_Birds_local();
        } else {
            websocketHandler.ins().saveSureRewardBird(0);
        }
    }

    /**是否有限时分红龙 */
    isHave_XsLong() {
        let xianShi = G_baseData.petData.fenhong_breakerBird;
        for (let index = 0; index < xianShi.length; index++) {
            this.addBird(47, 3, xianShi[index]);
        }
    }

    //通知消息
    gameTips(str) {
        EventDispatch.ins().fire(Event_Name.MAIN_MSG, { type: "gameTips", value: str })
    }
}

