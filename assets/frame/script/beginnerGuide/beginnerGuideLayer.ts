// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import cfgManager from "../game/CfgManager";
import dataManager from "../game/dataManager";

const { ccclass, property } = cc._decorator;
var num_newStep: number = 0;
@ccclass
export default class beginnerGuideLayer extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    onLoad() { }

    start() {

    }

    /**新手指引第一步 */
    guideFirst() {
        // if (window.dd_isDebug) {
        //     return;
        // }
        if (dataManager.ins().isxinshou != 0) return;
        try {
            var mask = cc.find("beginnerGuide_1", this.node);
            var hand = mask.getChildByName("hand");
            var tips1 = mask.getChildByName("labtips").getComponent(cc.Label);
            num_newStep += 1;
            var mask2 = cc.find("beginnerGuide_2", this.node);
            this.node.active = true;
            switch (num_newStep) {
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


    // update (dt) {}
}
