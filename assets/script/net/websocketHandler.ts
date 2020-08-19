import SingletonClass from "../frameWork/base/SingletonClass";
import { NetManager } from "../frameWork/websocket/NetManager";
import { Game } from "../game/Game";
import { G_baseData } from "../data/baseData";
import { NetNode } from "../frameWork/websocket/NetNode";
import { DefStringProtocol, INetworkTips, NetData } from "../frameWork/websocket/NetInterface";
import { uiManager } from "../frameWork/ui/uiManager";
import { WebSock } from "../frameWork/websocket/WebSock";
/**演示服 */
var url: string = 'wss://mihecheng.teamone.wang:443';
/**本地 */
// var url: string = 'ws://192.168.0.121:9501';
export default class websocketHandler extends SingletonClass {
    public static ins() {
        return super.ins() as websocketHandler;
    }

    URL: string = "";

    constructor() {
        super();
        this.URL = `${window.UrlManager.WebsocketUrl}/?token=${G_baseData.userData.token}`;
        //this.URL = `${window.UrlManager.WebsocketUrl}/?token=${'0'}`;
    }

    /**设定长连接监听 */
    addWebSocket(callback) {
        let Node = new NetNode();
        Node.init(new WebSock(), new DefStringProtocol(), new NetTips());
        Node.setResponseHandler(0, (cmd: number, data: NetData) => {
            let res = JSON.parse(data as string);
            if (typeof callback == "function") {
                callback(res);
            }
        });
        NetManager.getInstance().setNetNode(Node);
        NetManager.getInstance().connect({ url: this.URL, autoReconnect: -1 })
    }

    webSocketClose(){
        NetManager.getInstance().close();
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
            G_baseData.petData.saveBirdLocalPosition();
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

class NetTips implements INetworkTips {
    //TODO tips需要剥离出去
    connectTips(isShow: boolean): void {
        if (isShow) {
            uiManager.ins().waiting.showtips("网络开小差了")
        } else {
            uiManager.ins().waiting.hidetips(true);
        }
    }
    reconnectTips(isShow: boolean): void {
        if (isShow) {
            uiManager.ins().waiting.showtips("网络重接中")
        } else {
            uiManager.ins().waiting.hidetips(true);
        }
    }
    requestTips(isShow: boolean): void {
    }
}

type objtype = {
    method: any,
    params: any,
    token?: any
}

