// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { G_baseData } from "../../data/baseData";
import mainTimedGemItem from "./mainTimedGemItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class mainTimedGemLayer extends cc.Component {

    @property(cc.ProgressBar)
    FHBC_Progress: cc.ProgressBar = null;

    @property(cc.Node)
    JewelClick: cc.Node = null;

    @property({
        type: cc.Prefab,
        tooltip: "指预件：prefab/mainTimedGemItem"
    })
    gemItemPfb: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.showJewelClick();
    }

    /**FHBC界面的更新 */
    private showJewelClick() {
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
            let jewel = cc.instantiate(this.gemItemPfb);
            jewel.getComponent(mainTimedGemItem).initSelf(G_baseData.userData.FHBC_LIST.shift()); //shift删除数组第一个元素并返回自身
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

    /**
     * 领取更新视图
     */
    updateGemView() {
        if (this.JewelClick.getChildByName("click_0").childrenCount == 1) {
            this.showJewelClick();
        }
    }

    // update (dt) {}
}
