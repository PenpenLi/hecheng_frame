// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { uiManager } from "../../frameWork/ui/uiManager";
import BigVal from "../../common/bigval/BigVal";
import { G_baseData } from "../../data/baseData";
import { UI_CONFIG_NAME } from "../../common/gameConfig/gameConfigs";
import { Game } from "../../game/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class timedCoinAwardLayer extends cc.Component {

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    awardSpr: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    _time = 0; //时间
    _isCd = false; //是否倒计时
    test = true;
    onLoad() {
        this.node.on("click", this.clickTimedCoinAward.bind(this), this);
    }

    start() {
        this.initTimedCoinAward();
    }

    /**进入游戏时的右上角首次金币时间的更新 */
    initTimedCoinAward() {
        G_baseData.userData.rest_time = 3600 - (G_baseData.userData.now_time + (parseInt((new Date().getTime() / 1000).toString()) - G_baseData.userData.LocolIndexTime) - G_baseData.userData.rec_time);
        this.showCoinTips();
    }

    /**右上方提示玩家收获金币的按钮 */
    showCoinTips() {
        if (G_baseData.userData.rest_time <= 0 || this.test) {
            this.test = false;
            this._isCd = false;
            this.node.getComponent(cc.Button).interactable = true;
            let tween = cc.tween()
                .to(0.1, { scale: 1.3 })
                .to(0.1, { scale: 1 })
                .to(0.1, { scale: 1.6 })
                .to(0.1, { scale: 1 })
                .delay(5)
            tween.clone(this.node).repeatForever().start();
        } else {
            //显示倒计时
            this._isCd = true;
            this.node.stopAllActions();
            this.node.getComponent(cc.Button).interactable = false;
        }
    }

    /**填零方法 */
    addZone(num) {
        let a = num.toString();
        if (a.length < 2) {
            a = "0" + a;
        }
        return a;
    }

    //update 更新倒计时
    update(dt) {
        if (this._isCd == false) {
            return;
        }
        this._time += dt;
        if (this._time < 1) {
            return
        }
        this._time = 0;
        let cd_time = G_baseData.userData.rest_time = 3600 - (G_baseData.userData.now_time + (parseInt((new Date().getTime() / 1000).toString()) - G_baseData.userData.LocolIndexTime) - G_baseData.userData.rec_time);
        if (cd_time <= 0) {
            this.timeLabel.string = '领取';
            this.showCoinTips(); //剩余时间为零
            return;
        }
        let min = Math.floor(G_baseData.userData.rest_time / 60);
        let sec = Math.floor(G_baseData.userData.rest_time % 60);
        var str_time = this.addZone(min) + ":" + this.addZone(sec);
        this.timeLabel.string = str_time;
    }

    /**
     * 点击定时金币奖励按钮
     */
    clickTimedCoinAward() {
        /**初始化值 */
        let initOFRigthCoin = (price) => {
            let _nowtime = parseInt((new Date().getTime() / 1000).toString());
            G_baseData.userData.now_time = _nowtime;
            G_baseData.userData.rec_time = _nowtime;
            G_baseData.userData.LocolIndexTime = _nowtime;
            var coins = new BigVal(price);
            uiManager.ins().show(UI_CONFIG_NAME.DlgRigthCoins, "+" + coins.geteveryStr());
        }
        var funSuc = (ret) => {
            Game.Console.Log(ret)
            G_baseData.userData.RefreshGold(ret.data.amount, ret.data.update_time);
            if (ret.code == 0) {
                initOFRigthCoin(ret.data.add_num);
            }
        }
        var funErr = (ret) => {
            Game.gameManager.gameTips('金币领取失败，请检查网络连接或联系游戏客服，错误信息：' + JSON.stringify(ret));
        }
        let params = {
            type: 1,
        }
        try {
            Game.HttpManager.sendRequest('/api/game/receiveGold', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    // update (dt) {}
}
