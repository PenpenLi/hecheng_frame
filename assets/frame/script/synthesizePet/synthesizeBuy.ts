// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import tsAddLayer from "../common/tsAddLayer";
import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager";
import BigVal from "../common/bigval/BigVal";
import musicManager from "../common/music/musicManager";
import { NetManager } from "../common/net/NetManager";
import { musicPath } from "../common/config/gameConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class synthesizeBuy extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    _tsAddLayer: tsAddLayer;
    onLoad() {

    }

    start() {

    }

    initGame() {
        this._tsAddLayer = tsAddLayer.getIns();
    }

    /**购买宠物（主界面0，商店（金币1/钻石2），） */

    /**
     * 购买宠物
     * @param type 购买类型 
     * @param buyPetLevel 购买宠物的等级  
     * @param call 回调
     */
    buyPet(type: number, buyPetLevel?: number, call?: Function) {
        let self = this;
        let blockItem0 = this._tsAddLayer.judgeHaveEmptyNest();
        if (!blockItem0) {
            var string_0 = "位置满了，请合成或者拖到右下角回收";
            this._tsAddLayer.showGameTips(string_0);
            return;
        }
        let param: {} = {};
        let data: string = "";
        switch (type) {
            case 0:
                this._tsAddLayer.guideFirst();
                this._tsAddLayer.addPet(dataManager.ins().buy_level);
                dataManager.ins().TotalCoins = BigVal.Sub(dataManager.ins().TotalCoins, dataManager.ins().buy_price); //总金币减少
                cfgManager.ins().Tops.initCoinOfTotal();
                param = {
                    id: dataManager.ins().buy_level,
                    type: type
                }
                data = this._tsAddLayer._websocketTs.Long_save("buy", param);
                break;
            case 1:
                // shopBuyLv = buyPetLevel;
                // callbackShop = call;
                param = {
                    id: buyPetLevel,
                    type: type
                }
                data = this._tsAddLayer._websocketTs.Long_save("buy", param);
                break;
            case 2:
                // shopBuyLv = buyPetLevel;
                param = {
                    id: buyPetLevel,
                    type: type
                }
                break;
        }

        param = {
            id: buyPetLevel,
            type: type
        }

        data = this._tsAddLayer._websocketTs.Long_save("buy", param);
        musicManager.ins().playEffectMusic(musicPath.buyshopclip)
        setTimeout(() => {
            self._tsAddLayer._websocketTs.sendMsg(data);
        }, 0);
    }

    // update (dt) {}
}
