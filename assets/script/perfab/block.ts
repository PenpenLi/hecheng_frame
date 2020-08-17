import blockItem from "./blockitem";
import { G_baseData } from "../data/baseData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class block extends cc.Component {

    @property(cc.Prefab)
    prefapBirds: cc.Prefab = null;

    /**鸟窝的标记 */
    birdOfId: number = 0;

    /**是否首次进入 */

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.CHILD_ADDED, this.addChild, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this.removeChild, this);
    }
    /**给每个鸟窝附一个编号 */
    init(num: number) {
        this.birdOfId = num;
    }

    /**开始添加子物体，num值可作为一个参数（龙的等级） */
    setNumber(num: number, type?: number, timer?: number) { //购买+初始化
        let blockIte = cc.instantiate(this.prefapBirds);
        blockIte.parent = this.node;
        blockIte.setPosition(cc.v2(0, 30));
        blockIte.getComponent(blockItem).initOfBird(num, type, timer);
    }

    addChild(node: cc.Node) {
        if (node.getComponent(blockItem)) {
            setTimeout(() => {
                let num_best = node.getComponent(blockItem).num_best;
                G_baseData.petData.isHaveBird[this.birdOfId] = num_best;
            }, 0.1)
        }
    }

    removeChild(node: cc.Node) {
        if (node.getComponent(blockItem)) {
            G_baseData.petData.isHaveBird[this.birdOfId] = 0;
        }
    }


    /**游戏加速的方法 */
    speedUp() {
        try {
            if (this.node.childrenCount > 0) {
                this.node.getChildByName("Bird").getComponent(blockItem).getCoinSpeed(); //鸟唯一的的标记
            }
        } catch (e) {
            console.log(e);
        }
    }

    // update (dt) {}
}
