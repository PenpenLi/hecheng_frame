

import { Game } from "../game/Game";
import { EventDispatch, Event_Name } from "../event/EventDispatch";
import { G_baseData } from "../data/baseData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class guideWindow extends cc.Component {
    step: number = 0;

    @property(cc.Node)
    mask: cc.Node = null;
    @property(cc.Node)
    hand: cc.Node = null;
    @property(cc.Label)
    tips: cc.Label = null;
    @property(cc.Node)
    mask2: cc.Node = null;
    onLoad() {
    }
    
    /**新手指引第一步 */
    guideFirst() {
        if (G_baseData.userData.isxinshou != 0) return;
        try {
            // this.mask = cc.find("Canvas/this.mask");
            // this.hand = this.mask.getChildByName("this.hand");
            // this.tips = this.mask.getChildByName("labtips").getComponent(cc.Label);
            // this.mask2 = cc.find("Canvas/this.mask2");
            this.step += 1;
            switch (this.step) {
                case 1: //第一步买鸟
                    this.mask.active = true;
                    break;
                case 2: //拖动
                    this.mask.active = false;
                    this.mask2.active = true;
                    break;
                case 3: //继续购买角色
                    this.mask.active = false;
                    this.mask2.active = false;
                    break;
                case 4:
                    this.mask.active = true;
                    this.tips.string = "点这里可以继续购买角色";
                    this.hand.x += 5;
                    this.hand.y += 30;
                    break;
                case 5:
                    this.tips.string = "角色越多赚钱越多";
                    this.hand.x -= 5;
                    this.hand.y -= 30;
                    break;
                case 6:
                    this.tips.string = "角色越多赚钱越多";
                    this.hand.x += 5;
                    this.hand.y += 30;
                    break;
                case 7:
                    Game.ApiManager.openHongbao(7); //新手红包
                    this.mask.active = false;
                    this.mask2.active = false;
                    G_baseData.userData.isxinshou = 1;
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }
}

