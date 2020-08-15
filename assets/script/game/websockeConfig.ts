import SingletonClass from "../common/base/SingletonClass";
import { NetManager } from "../common/net/NetManager";
import dataManager from "../game/dataManager";
import { Game } from "./Game";
/**演示服 */
var url: string = 'wss://mihecheng.teamone.wang:443';
/**本地 */
// var url: string = 'ws://192.168.0.121:9501';
export default class websocketConfig extends SingletonClass {
    public static ins() {
        return super.ins() as websocketConfig;
    }

    URL: string = "";

    constructor() {
        super();
        this.URL = `${UrlManager.WebsocketUrl}/?token=${dataManager.ins().token}`;
        //this.URL = `${UrlManager.WebsocketUrl}/?token=${'0'}`;
    }

    /**长连接的方法(购买)*/
    Long_save(apiname, params): string {
        let obj: objtype = { method: apiname, params: params };
        // let data = encodeURIComponent(JSON.stringify(obj));
        return JSON.stringify(obj);
    }

    /**
     * 普通合成
     * @param num1lv 合成后的等级
     */
    saveComposeMess(num1lv: number) {
        let param = {
            bird: num1lv
        }
        Game.Console.Log("bird.compose", param)
        let message = this.Long_save("bird.compose", param);
        NetManager.getInstance().send(message);
    }

    /**心跳 */
    sendHearbeat() {
        let param = {}
        let message = this.Long_save("server.ping", param);
        return message;
    }

    /**位置交换 */
    saveChangeMess(num1: number, num2: number) {
        let param = {
            bird: `${num1}#${num2}`
        }
        Game.Console.Log("bird.move", param);
        let message = this.Long_save("bird.move", param);
        NetManager.getInstance().send(message);
    }

    /**
     * 删除宠物
     * @param weizhi "weizhi_lv"
     */
    saveDelBird(lv: number) {
        let param = {
            bird: lv
        }
        Game.Console.Log("bird.trash", param);
        let message = this.Long_save("bird.trash", param);
        NetManager.getInstance().send(message);
    }


    /**
     * 购买
     * @param lv 等级
     * @param paytype 类型gold\fhbc(默认金币)
     * @param sencetype 途径home/shop(默认主界面)
     */
    saveBuyMess(lv: number, paytype: string = "gold", sencetype = "home") {
        let param = {
            bird: lv,
            pay: paytype,
            scene: sencetype
        }
        Game.Console.Log("bird.buy", param);
        let message = this.Long_save("bird.buy", param);
        NetManager.getInstance().send(message);
    }


    /**
     * 高级合成接口（38）
     */
    saveComposeBest() {
        let param = null;
        Game.Console.Log("bird.compose38", param);
        let message = this.Long_save("bird.compose38", param);
        NetManager.getInstance().send(message);
    }

    /**五龙合成 */
    saveComposeFive() {
        let param = null;
        Game.Console.Log("bird.compose47", param);
        let message = this.Long_save("bird.compose47", param);
        NetManager.getInstance().send(message);
    }

    /**情侣合成 */
    saveComposeQinglv() {
        let param = null;
        Game.Console.Log("bird.cpdidi", param);
        let message = this.Long_save("bird.cpdidi", param);
        NetManager.getInstance().send(message);
    }

    /**本地游戏保存 */
    save_Birds_local() {
        setTimeout(function () {
            dataManager.ins().localBirdsave();
        }, 100);
    }

    /**加速 */
    save_speedDouble(timer: number) {
        let param = {
            duration: timer
        };
        Game.Console.Log("bird.booster", param);
        let message = this.Long_save("bird.booster", param);
        NetManager.getInstance().send(message);
    }


    /**获取金币的计时器 */
    _autoGetGold: any = null;
    /**计时器间隔时间 */
    goldtimer: number = 5000;
    /**金币主动获取*/
    saveAutoGold() {
        if (this._autoGetGold !== null) {
            clearInterval(this._autoGetGold);
            this._autoGetGold = null;
            this._autoGetGold = setInterval(() => {
                Game.Console.Log("金币的刷新时间");
            }, this.goldtimer);
        } else {
            this._autoGetGold = setInterval(() => {
                Game.Console.Log("金币的刷新时间");
            }, this.goldtimer);
        }
    }

    /**确定奖励鸟领取 */
    saveSureRewardBird(birdLv: number) {
        let param = {
            bird: birdLv
        };
        Game.Console.Log("bird.claim", param);
        let message = this.Long_save("bird.claim", param);
        NetManager.getInstance().send(message);
    }
}


type objtype = {
    method: any,
    params: any,
    token?: any
}

