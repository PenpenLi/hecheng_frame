import dataManager from "../../game/dataManager";
// //var url0 = "http://www.bjhyldkj.cn";//正式服
// var url0 = "http://duoduoshijie.vmall99.com"; //演示服  _注意视频回调接口的更换
var url0 = window.dd_httpUrl;
import aes = require("./aes.js");
console.log("htttp", url0);
export default class HTTP {
    // sendRequest
    public isstart: boolean = true;

    public sendRequest(url: string, param: any, funSuc: Function, funErr: Function, method: string = "POST") {
        var self = this;
        var key = aes.getKey();
        var rsa = RSA(key);
        // alert("ssssssssssss"+ dataManager.ins().token)
        console.log("多多发送请求", url0, url, JSON.stringify(param))
        param = aes.AESEnc(key, JSON.stringify(param)); //对传入的参数进行加密,(先转换为字符串)
        let datas = {
            _rsa: rsa,
            _cipher: param
        }
        let xhr = new XMLHttpRequest();
        url = url0 + url;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    let res_0 = JSON.parse(xhr.responseText);
                    let res = JSON.parse(aes.AESDec(key, res_0.data)); //解密
                    console.log("多多回包code:", res_0.code, "@@@@data:", JSON.stringify(res));
                    if (res_0.code == 0) {
                        funSuc(res);
                    } else if (res_0.code == 403) {
                        self.lostToken();
                    } else {
                        funErr(res);
                    }
                }
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader("token", dataManager.ins().token);
        xhr.send(JSON.stringify(datas));

        return xhr;
    }

    /**
     * 废弃 所有接口均用post提交
     * @param url 
     * @param param 
     * @param funSuc 
     * @param funErr 
     * @param method 
     */
    public sendRequestGet(url: string, param: any, funSuc: Function, funErr: Function, method: string = "POST") {
        var self = this;
        var key = aes.getKey();
        var rsa = RSA(key);
        param = aes.AESEnc(key, JSON.stringify(param)); //对传入的参数进行加密,(先转换为字符串)
        let datas = {
            _rsa: rsa,
            _cipher: param
        }
        // let datas = param
        let url1 = url0 + url + "?";
        for (let key in datas) {
            url1 += (key + "=" + datas[key] + "&");
        }
        url1 = url1.substring(0, url1.length - 1)
        var xhr = new XMLHttpRequest();//第一步：建立所需的对象
        xhr.open('GET', url1, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader("token", dataManager.ins().token);
        xhr.send();//第三步：发送请求  将请求参数写在URL中

        /**
         * 获取数据后的处理程序
         */
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let res_0 = JSON.parse(xhr.responseText);
                let res = JSON.parse(aes.AESDec(key, res_0.data)); //解密
                if (res_0.code == 0) {
                    funSuc(res);
                } else if (res_0.code == 403) {
                    self.lostToken();
                } else {
                    funErr(res);
                }
            }
        };
        return xhr;
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
    //         'token': dataManager.ins().token
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
            console.log("token过期403");
        } finally {
            // cc.game.end();
        }
    }

};

