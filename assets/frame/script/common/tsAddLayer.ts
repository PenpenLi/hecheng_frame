// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


/**
 * @author SungKT
 * @data 2020/8/13
 * @description 
 * 所有模块之间调用尽量通过此脚本去调用，不要通过import相互调用。
 */

import { LocalStorage } from "./base/LocalStorage";
import { loader_mgr } from "./load/loader_mgr";
import beginnerGuideLayer from "../beginnerGuide/beginnerGuideLayer";
import { Module_Config } from "./config/moduleConfig";
import synthesizePetLayer from "../synthesizePet/synthesizePetLayer";
import synthesizeBuy from "../synthesizePet/synthesizeBuy";
import websocketConfig from "../game/websockeConfig";

const { ccclass, property } = cc._decorator;

let instance: tsAddLayer = null;
@ccclass
export default class tsAddLayer extends cc.Component {

    storage: LocalStorage = null;
    // LIFE-CYCLE CALLBACKS:

    _synthesizePetTs: synthesizePetLayer = null; //宠物移动合成相关
    _synthesizeBuyTs: synthesizeBuy = null;// 宠物购买相关 与_synthesizePetTs同时关联

    _websocketTs: websocketConfig = null;

    static getIns(): tsAddLayer {
        return instance;
    }

    onLoad() {
        instance = this;
        console.log("tsAddLayer")
        this.storage = LocalStorage.ins();
        this.initWebSocket();
    }

    start() {

    }

    /*****************存储相关*********************** */

    /**
     * 本地存储
     * @param key 
     * @param value 
     */
    setLocal(key: string, value) {
        this.storage.setLocal(key, value);
    }

    /**
     * 获取本地存储信息
     * @param key 
     * @param defaultValue 
     */
    getLocal(key: string, defaultValue?) {
        let sto = this.storage.getLocal(key, defaultValue);
        return sto;
    }

    /**********webSocket模块*************** */
    initWebSocket() {
        this._websocketTs = websocketConfig.ins();
    }

    /**********http模块*************** */

    /*****************引导相关*********************** */
    /**
     * 新手引导模块
     */
    guideFirst() {
        if (!Module_Config.Beginner_Guide) return;
        let guideNode = cc.find("beginnerGuide", this.node);
        if (!!!guideNode) return;
        let guideTs = guideNode.getComponent(beginnerGuideLayer);
        if (!!!guideTs) return;
        guideTs.guideFirst();
    }

    /*****************合成相关*********************** */

    /**
     * 初始化合成模块
     * _synthesizePetTs与_synthesizeBuyTs同时初始化
     */
    initSynthesizePetLayer() {
        if (!Module_Config.Synthesize_Pet) return;
        let synthesizeNode = cc.find("UIROOT/synthesizePetLayer", this.node);
        if (!!!synthesizeNode) return;
        let synthesizeTs = synthesizeNode.getComponent(synthesizePetLayer);
        let synthesizeBuyTs = synthesizeNode.getComponent(synthesizeBuy);
        if (!!!synthesizeTs || !!!synthesizeBuyTs) { //必须同时有效
            return
        }
        this._synthesizePetTs = synthesizeTs;
        this._synthesizeBuyTs = synthesizeBuyTs;
        this._synthesizePetTs.initGame();
        this._synthesizeBuyTs.initGame();
    }

    addPet(petLevel: number) {

    }

    judgeHaveEmptyNest() {
        let isEmpty = this._synthesizePetTs.getEmpty();
        return isEmpty;
    }

    /**购买鸟（主界面0，商店（金币1/钻石2），） */
    buyPet(type: number, shopNum?: number, call?: Function) {
        if (!this._synthesizeBuyTs) return;
        this._synthesizeBuyTs.buyPet(type, shopNum, call)
    }


    /**
     * 宠物商店
     */
    initSynthesizeShopLayer() {

    }

    /**
     * 外层宠物购买
     */
    initSynthesizeOutBuyLayer() {

    }


    /************弹文字**** */
    showGameTips(text) {

    }




    // /** */



    // update (dt) {}
}
