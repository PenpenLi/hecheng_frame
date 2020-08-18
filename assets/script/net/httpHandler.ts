
import { G_baseData } from "../data/baseData";
var url0 = "http://mihecheng.vmall99.com"; //测示服  _注意视频回调接口的更换
import aes = require("./http/aes.js")
import { Game } from "../game/Game";

export default class httpHandler {
    // sendRequest
    public isstart: boolean = true;

    public sendRequest(url: string, param: any, funSuc: Function, funErr: Function) {
        var self = this;
        // var key = aes.getKey();
        // var rsa = RSA(key);
        // param = aes.AESEnc(key, JSON.stringify(param)); //对传入的参数进行加密,(先转换为字符串)
        // let datas = {
        //     _rsa: rsa,
        //     _cipher: param
        // }
        let xhr = new XMLHttpRequest();
        url = this.GetHttpUrl() + url;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var res = JSON.parse(xhr.responseText);

                    Game.Console.Log('http回调', url, param, res, JSON.stringify(res));
                    // res.data = JSON.parse(aes.AESDec(key, res.data)); //解密
                    if (res.code == 0) {
                        funSuc(res);
                    } else if (res.code == 403) {
                        self.lostToken();
                    } else {
                        funErr(res);
                    }
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader("token", G_baseData.userData.token);
        // xhr.send(JSON.stringify(datas));
        xhr.send(JSON.stringify(param));
        return xhr;
    }

    GetFenHongDrongen(cb: Function) {
        this.sendRequest('/portal/game/compose', {}, (res) => {
            let data = res.data;
            if (data.birid == 0 || data.duration == 0) {
                return;
            }
            Game.gameManager.addBird(data.birid, 3, data.duration);
        }, null)
    }

    GetHttpUrl() {
        return window.UrlManager.HttpUrl
    }

    // public sendRequest(url: string, param: any, funSuc: Function, funErr: Function) {
    //     var self = this;
    //     var URL = url0 + url;
    //     if (!self.isstart) {
    //         return;
    //     }
    //     self.isstart = false;
    //     var key = aes.getKey();
    //     var rsa = RSA(key);
    //     param = aes.AESEnc(key, JSON.stringify(param)); //对传入的参数进行加密,(先转换为字符串)
    //     var headers = {
    //         "Content-Type": "application/json;charset=utf-8",
    //         'token': G_baseData.userData.token
    //     };
    //     try {
    //         api.ajax({
    //             method: 'post',
    //             url: URL,
    //             headers: headers,
    //             data: {
    //                 body: {
    //                     _rsa: rsa,
    //                     _cipher: param
    //                 }
    //             }
    //         }, function (res, err) {
    //             self.isstart = true;
    //             if (res) {
    //                 // console.log('游戏url：' + URL);
    //                 res.data = JSON.parse(aes.AESDec(key, res.data)); //解密
    //                 // console.log("游戏加密res", JSON.stringify(res));
    //                 if (res.code == 0) {
    //                     funSuc(res.data);
    //                 } else if (res.code == 403) {
    //                     self.lostToken();
    //                 } else {
    //                     funErr(err);
    //                 }
    //             }
    //             if (err) {
    //                 funErr(err);
    //             }
    //         })
    //     } catch (e) {
    //         console.log('游戏catch：' + JSON.stringify(e))
    //     }
    // }

    /**token过期 */
    lostToken() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: '403',
                }
            });
        } catch (e) {
            Game.Console.Log("token过期403");
        } finally {
            // cc.game.end();
        }
    }
};

