import dataManager from "./dataManager";
import websocketConfig from "./websockeConfig";
import cfgManager from "./CfgManager"
import { uiManager } from "../common/ui/uiManager";
import { NetManager } from "../common/net/NetManager";
import { UI_CONFIG_NAME } from "../common/config/gameConfigs";

var instance: pictureManager = null;

var num_newstep: number = 0;
const { ccclass, property } = cc._decorator;

@ccclass
export default class pictureManager extends cc.Component {

    /**合成特效 */
    @property(cc.Prefab)
    starEffects: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    HeadImage: cc.SpriteAtlas = null;

    /**long的头像 */
    birdTuji: cc.SpriteFrame[] = [];

    @property(cc.SpriteAtlas)
    smallHeadImage: cc.SpriteAtlas = null;
    /**车头的集合*/
    carHeads: cc.SpriteFrame[] = [];

    /**金币的对象池 */
    coinPool: cc.NodePool = null;

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;
    stPos: cc.Vec2 = null;
    edPos: cc.Vec2 = null;

    @property(cc.Prefab)
    daoPerfab: cc.Prefab = null;

    static getIns(): pictureManager {
        return instance;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        instance = this;
        setTimeout(() => {
            this.loadtuji();
        }, 0)
        this.scheduleOnce(() => {
            this.initFlyCoin();
        }, 2)
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.schedule(() => {
            websocketConfig.ins().save_game_gold();
        }, 2)
    }

    // onKeyDown(event: cc.Event.EventKeyboard) {
    //     switch (event.keyCode) {
    //         case cc.macro.KEY.a:
    //             console.log("鸟窝的等级", dataManager.ins().isHaveBird);
    //             break;
    //         case cc.macro.KEY.s:
    //             uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 15, 3);
    //             break;
    //         case cc.macro.KEY.d:
    //             uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "60分钟");
    //             break;
    //         case cc.macro.KEY.f:
    //             uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 15, 0);
    //             break;
    //     }
    // }

    /**新手指引第一步 */
    guideFrist() {
        // if (window.dd_isDebug) {
        //     return;
        // }
        // if (dataManager.ins().isxinshou != 0) return;
        try {
            var mask = cc.find("Canvas/beginnerGuide/beginnerGuide_1");
            var hand = mask.getChildByName("hand");
            var tips1 = mask.getChildByName("labtips").getComponent(cc.Label);
            num_newstep += 1;
            var mask2 = cc.find("Canvas/beginnerGuide/beginnerGuide_2");
            console.log('yindao',num_newstep);
            switch (num_newstep) {
                case 1: //第一步买鸟
                    mask.active = true;
                    break;
                case 2: //拖动
                    mask.active = false;
                    mask2.active = true;
                    break;
                case 3: //继续购买角色
                    mask.active = false;
                    mask2.active = false;
                    break;
                case 4:
                    mask.active = true;
                    tips1.string = "点这里可以继续购买角色";
                    hand.x += 5;
                    hand.y += 30;
                    break;
                case 5:
                    tips1.string = "角色越多赚钱越多";
                    hand.x -= 5;
                    hand.y -= 30;
                    break;
                case 6:
                    tips1.string = "角色越多赚钱越多";
                    hand.x += 5;
                    hand.y += 30;
                    break;
                case 7:
                    cfgManager.ins().openHongbao(7); //新手红包
                    mask.active = false;
                    mask2.active = false;
                    dataManager.ins().isxinshou = 1;
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**加载车头图标 */
    loadtuji() {
        let carHead = this.smallHeadImage.getSpriteFrames();
        for (let i = 0; i < carHead.length; i++) {//排序
            let index = parseInt(carHead[i].name);
            this.carHeads[index - 1] = carHead[i];
        }
        let birdTujis = this.HeadImage.getSpriteFrames();
        for (let i = 0; i < birdTujis.length; i++) {//排序
            let index = parseInt(birdTujis[i].name);
            this.birdTuji[index - 1] = birdTujis[i];
        }
    }

    /**初始化金币位置 */
    initFlyCoin() {
        //设定自身的位置（适配不同手机高度金币生成的位置）
        let canvas = cc.find("Canvas");
        this.node.setPosition(cc.v2(360, Math.floor(canvas.height / 2)))
        this.stPos = cc.v2(0, -200);
        if (!cfgManager.ins().Tops) return;
        let totalcoinnode = cfgManager.ins().Tops.labTotalCoins.node;
        let pos1 = totalcoinnode.getParent();
        let pos2 = pos1.getParent();
        let pos3 = pos2.getParent();
        let pos4 = pos3.getPosition().add(pos2.getPosition()).add(pos1.getPosition()).add(totalcoinnode.getPosition())
        this.edPos = pos4.add(cc.v2(-90, -50));
        this.coinPool = new cc.NodePool();
        this.initCoinPool();
    }

    /**初始化金币落袋对象池 */
    initCoinPool(count: number = 20) {
        for (let i = 0; i < count; i++) {
            let coin = cc.instantiate(this.coinPrefab);
            this.coinPool.put(coin);
        }
    }

    /**回收金币特效 */
    playAnim() {
        if (!cfgManager.ins().Tops) return;
        let randomCount = Math.random() * 15 + 10;
        this.playCoinFlyAnim(randomCount, this.stPos, this.edPos);
    }

    /**金币生成及执行动画 */
    playCoinFlyAnim(count: number, stPos: cc.Vec2, edPos: cc.Vec2, r: number = 130) {
        // 确保当前节点池有足够的金币
        if (this.coinPool === null) {
            return;
        }
        const poolSize = this.coinPool.size();
        const reCreateCoinCount = poolSize > count ? 0 : count - poolSize;
        this.initCoinPool(reCreateCoinCount);

        // 生成圆，并且对圆上的点进行排序
        let points = this.getCirclePoints(r, stPos, count);
        let coinNodeList = points.map(pos => {
            let coin = this.coinPool.get();
            coin.setPosition(stPos);
            this.node.addChild(coin);
            return {
                node: coin,
                stPos: stPos,
                mdPos: pos,
                edPos: edPos,
                dis: (pos as any).sub(edPos).mag()
            };
        });
        coinNodeList = coinNodeList.sort((a, b) => {
            if (a.dis - b.dis > 0) return 1;
            if (a.dis - b.dis < 0) return -1;
            return 0;
        });

        // 执行金币落袋的动画
        coinNodeList.forEach((item, idx) => {
            cc.tween(item.node)
                .to(0.3, { position: item.mdPos })
                .delay(idx * 0.01)
                .to(0.5, { position: item.edPos })
                .call(() => { this.coinPool.put(item.node) })
                .start();
        });
    }
    /**
     * 以某点为圆心，生成圆周上等分点的坐标
     *
     * @param {number} r 半径
     * @param {cc.Vec2} pos 圆心坐标
     * @param {number} count 等分点数量
     * @param {number} [randomScope=80] 等分点的随机波动范围
     * @returns {cc.Vec2[]} 返回等分点坐标
     */
    getCirclePoints(r: number, pos: cc.Vec2, count: number, randomScope: number = 60): cc.Vec2[] {
        let points = [];
        let radians = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            let x = pos.x + r * Math.sin(radians * i);
            let y = pos.y + r * Math.cos(radians * i);
            points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        }
        return points;
    }

}
