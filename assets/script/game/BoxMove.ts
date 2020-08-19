import { G_baseData } from "../data/baseData";
import { uiManager } from "../frameWork/ui/uiManager";
import { UI_CONFIG_NAME } from "../common/gameConfig/gameConfigs"


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    actionOfBox: cc.Tween = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.scheduleOnce(function () {
            if (G_baseData.userData.BOX_NUM > 0) {
                this.node.on("touchend", this.showFreebox, this);
                this.MoveAction();
            }
        }, 5);
    }


    //显示弹框的方法
    showFreebox() {
        if (G_baseData.userData.isxinshou == 0) return;
        uiManager.ins().show(UI_CONFIG_NAME.DlgGetFreeBox);
    }

    /**箱子的移动动作 */
    MoveAction() {
        let tween = cc.tween()
            .to(2, { position: cc.v2(-550, 175) })
            .to(3, { position: cc.v2(-320, 220) })
            .to(3, { position: cc.v2(-160, 175) })
            .to(3, { position: cc.v2(0, 220) })
            .to(3, { position: cc.v2(160, 175) })
            .to(3, { position: cc.v2(320, 220) })
            .to(3, { position: cc.v2(530, 175) })
            .to(0, { position: cc.v2(-550, 175) })
        tween.target(1);
        tween.clone(this.node).repeatForever().start();
    }


    /**点击观看视频箱子的操作 */
    HomingOfBox() {
        G_baseData.userData.BOX_NUM = G_baseData.userData.BOX_NUM - 1;
        console.log("箱子归位", G_baseData.userData.BOX_NUM);
        this.node.stopAllActions();
        this.node.position = cc.v3(-550, 175);
        if (G_baseData.userData.BOX_NUM > 0) {
            this.scheduleOnce(() => {
                this.MoveAction();
            }, 10);
        }
    }
    // update (dt) {}
}
