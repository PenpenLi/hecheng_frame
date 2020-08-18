import { Game } from "./Game";
import { uiManager } from "../common/ui/uiManager";
import { UI_CONFIG_NAME, uiFormPath } from "../common/base/gameConfigs";
import { G_baseData } from "../data/baseData";

var instance: pictureManager = null;

var num_newstep: number = 0;
const { ccclass, property } = cc._decorator;

@ccclass
export default class pictureManager extends cc.Component {

    /**合成特效 */
    @property(cc.Prefab)
    starEffects: cc.Prefab = null;

    /**聚宝盆 */
    @property(cc.Node)
    juBaoPen: cc.Node = null;

    /**金币的对象池 */
    coinPool: cc.NodePool = null;

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;
    stPos: cc.Vec2 = null;
    edPos: cc.Vec2 = null;

    static getIns(): pictureManager {
        if (!!!instance) {
            instance = new pictureManager();
        }
        return instance;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        instance = this;
        this.scheduleOnce(() => {
            this.initFlyCoin();
            //this.initDao();
        }, 2)
    }

    /**合成鸟时的特效 */
    GetStarEffect(self: cc.Node) {
        let sterPer = cc.instantiate(this.starEffects);
        sterPer.parent = self;
        let heigth = this.node.height / 2;
        sterPer.setPosition(cc.v2(0, heigth));
    }

    jindu: cc.Sprite = null;
    pen: cc.Button = null;
    /**屠龙刀模块初始化 */
    initDao() {
        this.jindu = this.juBaoPen.getChildByName("jindubg").getChildByName("jindu1").getComponent(cc.Sprite);
        this.pen = this.juBaoPen.getChildByName("pen").getComponent(cc.Button);
        this.pen.node.on("click", () => {
            uiManager.ins().show(UI_CONFIG_NAME.DlgXianshFhView);
        }, this);
        let tween = cc.tween()
            .to(3, { position: cc.v2(-460, 170) })
            .to(3, { position: cc.v2(-230, 120) })
            .to(3, { position: cc.v2(0, 170) })
            .to(3, { position: cc.v2(230, 120) })
            .to(3, { position: cc.v2(460, 170) })
            .to(0, { position: cc.v2(-460, 170) })
        tween.clone(this.pen.node.parent).repeatForever().start();
        this.shuaxinDao();
    }

    /**更新屠龙刀模块 */
    shuaxinDao() {
        let num_dao = G_baseData.userData.dao_num;
        console.log("当前剩余屠龙刀" + num_dao);
        if (num_dao < 100) {
            this.jindu.fillRange = num_dao / 100;
            this.pen.interactable = false;
        } else {
            this.jindu.fillRange = 100;
            this.pen.interactable = true;
        }
    }

  

    /**初始化金币位置 */
    initFlyCoin() {
        //设定自身的位置（适配不同手机高度金币生成的位置）
        let canvas = cc.find("Canvas");
        this.node.setPosition(cc.v2(360, Math.floor(canvas.height / 2)))
        this.stPos = cc.v2(0, -200);
        let totalcoinnode = Game.Tops.labTotalCoins.node;
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
