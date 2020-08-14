import SingletonClass from "../common/base/SingletonClass";
import { NetManager } from "../common/net/NetManager";
import dataManager from "./dataManager"
// /**正式服 */
// //var url: string = 'ws://123.56.163.35:9502';
// /**演示服 */
//  var url: string = "ws://114.215.43.99:9503";

var url = window.dd_webSocketUrl;

export default class websocketConfig extends SingletonClass {
    public static ins() {
        return super.ins() as websocketConfig;
    }

    URL: string = "";

    constructor() {
        super();
        this.URL = url;
    }

    /**长连接的方法(购买)*/
    Long_save(apiname, params): string {
        let obj: objtype = { apiName: apiname, params: params, token: dataManager.ins().token };
        let data = encodeURIComponent(JSON.stringify(obj));
        return data;
    }

    /**提交服务器保存金币信息 */
    save_game_gold() {
        if (dataManager.ins().isCloseWebSocket) return;
        var gold = dataManager.ins().TotalCoins.Num;
        var param = {
            gold: gold,
        }
        let message = this.Long_save("gold", param);
        NetManager.getInstance().send(message);
    }

    /**提交服务器保存位置信息 */
    save_game_xinxi() {
        var str = dataManager.ins().getStrFromArray(dataManager.ins().isHaveBird);
        var param = {
            bird: str,
        }
        let message = this.Long_save("renovate", param);
        NetManager.getInstance().send(message);
    }

    /**服务器保存位置信息 */
    One_save_game() {
        setTimeout(() => {
            this.save_game_xinxi(); //服务器保存位置
            dataManager.ins().localBirdsave(); //本地保存位置
        }, 100);
    }
    /**本地游戏保存 */
    save_Birds_local() {
        setTimeout(function () {
            dataManager.ins().localBirdsave();
        }, 100);
    }

    /**首次连接发送事件 */
    sendMessageFrist() {
        let param = {};
        let message = this.Long_save("startBind", param);
        NetManager.getInstance().send(message);
    }

    /**发送长连接*/
    sendMsg(message) {
        NetManager.getInstance().send(message);
    }
}


type objtype = {
    apiName: any,
    params: any,
    token: any
}