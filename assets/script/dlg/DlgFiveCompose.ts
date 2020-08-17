import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import pictureManager from "../game/pictureManager";
import { Game } from "../game/Game";
import websocketHandler from "../game/websocketHandler";
import { EventDispatch, Event_Name } from "../common/event/EventDispatch";
import { G_baseData } from "../data/baseData";




const JIN_BIRD = 38; //金
const MU_BIRD = 39; //木
const SHUI_BIRD = 40; //水
const HUO_BIRD = 41; //火
const TU_BIRD = 42; //土
const FENGHONG_BIRD = 47; //分红
//五龙合成的记录
var isFiveCompose = [0, 0, 0, 0, 0]; //可以根据上面两个数据得到参数
const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {

    /**金木水火土 */
    @property(cc.SpriteFrame)
    fiveBirdTuji: cc.SpriteFrame[] = [];

    /**五个鸟的节点 */
    @property(cc.Node)
    concent: cc.Node = null;
    /**开始点击开始的按钮 */
    @property(cc.Node)
    btnStart: cc.Node = null;
    //记录五种鸟是否齐全
    FIVE_BIRD_NUM: number = 0;


    formType = new uiType(uiFormType.PopUp);

    _open() {
        var circleNode = this.btnStart.getChildByName("circleNode");
        cc.tween(circleNode)
            .by(2, { angle: -720 })
            .repeatForever()
            .start();
        this.scheduleOnce(() => {
            this.checkOfFive()
        }, 0.1);
    }
    /**根据两个数组得到五龙合成数组的数据 */
    initFivecompose() {
        var isHaveBird = G_baseData.petData.isHaveBird; //鸟的等级
        for (var i = 0; i < isFiveCompose.length; i++) {
            isFiveCompose[i] = 0; //记录五行鸟的数组归零
        }
        for (let i = 0; i < isHaveBird.length; i++) { //给金怒水火土的数组赋值
            var num_bestbird = isHaveBird[i];
            switch (num_bestbird) {
                case JIN_BIRD: //金
                    isFiveCompose[0] += 1;
                    break;
                case MU_BIRD: //木
                    isFiveCompose[1] += 1;
                    break;
                case SHUI_BIRD: //水
                    isFiveCompose[2] += 1;
                    break;
                case HUO_BIRD: //火
                    isFiveCompose[3] += 1;
                    break;
                case TU_BIRD: //土
                    isFiveCompose[4] += 1;
                    break;

            }
        }
    }

    /**检测是否满足合成条件 */
    checkOfFive() {
        this.btnStart.on("click", this.OnBtnClickStart, this);
        this.initFivecompose(); //初始化五龙合成的数组
        var birdSprTuji = this.concent.children;
        for (var i = 0; i < isFiveCompose.length; i++) {
            if (isFiveCompose[i] == 0) {
                birdSprTuji[i].getComponent(cc.Sprite).spriteFrame = this.fiveBirdTuji[i];
            } else {
                birdSprTuji[i].getComponent(cc.Sprite).spriteFrame = pictureManager.getIns().birdTuji[37 + i]
                this.FIVE_BIRD_NUM += 1;
            }
        }
        if (this.FIVE_BIRD_NUM == 5) {
            this.btnStart.getComponent(cc.Button).interactable = true; //条件满足开启button按钮 可点击
            this.indexBirdfive();
            console.log("this.Five_index_Array", this.Five_index_Array)
        } else {
            this.btnStart.getComponent(cc.Button).interactable = false; //条件不满足关闭button按钮 不可点击
        }
    }

    OnBtnClickStart() {
        websocketHandler.ins().saveComposeFive();
        let call: Function = (num: number) => {
            if (num === 0) {
                this.addBestBird();
                EventDispatch.ins().remove(Event_Name.composeFive, call)
            } else {
                Game.gameManager.gameTips("请稍后重试");
                this.btnClose(); //关闭弹框
                EventDispatch.ins().remove(Event_Name.composeFive, call)
            }
        }
        EventDispatch.ins().add(Event_Name.composeFive, call, this)
    }

    Five_index_Array: Array<number> = [-1, -1, -1, -1, -1];
    /**记录五龙的索引方法 */
    indexBirdfive() {
        var isHaveBird = G_baseData.petData.isHaveBird; //鸟的等级
        for (let i = 0; i < isHaveBird.length; i++) { //查出金木水火土五种鸟的父级
            var num_bird = isHaveBird[i];
            switch (num_bird) {
                case JIN_BIRD: //金
                    this.Five_index_Array[0] = i;
                    break;
                case MU_BIRD: //木
                    this.Five_index_Array[1] = i;
                    break;
                case SHUI_BIRD: //水
                    this.Five_index_Array[2] = i;
                    break;
                case HUO_BIRD: //火
                    this.Five_index_Array[3] = i;
                    break;
                case TU_BIRD: //土
                    this.Five_index_Array[4] = i;
                    break;
            }
        }
    }

    /**添加奖励分红凤凰 */
    addBestBird() {
        var BirdFather = Game.gameManager.birdBornFather;
        for (let i = 0; i < 5; i++) {
            console.log("鸟窝是", this.Five_index_Array[i]);
            var del_bird = BirdFather.children[this.Five_index_Array[i]].getChildByName("Bird");
            del_bird.getComponent("blockitem").delYourself(); //调用自己身上的删除方法
        }
        setTimeout(() => {
            Game.gameManager.addBird(47, 2);
            this.btnClose(); //关闭弹框
        }, 1000)
    }

    btnClose() {
        super._close();
    }
    _hide() {
        this.FIVE_BIRD_NUM = 0;
        this.btnStart.off("click", this.OnBtnClickStart, this);
        this.btnStart.getChildByName("circleNode").stopAllActions();
    }

    // update (dt) {}
}
