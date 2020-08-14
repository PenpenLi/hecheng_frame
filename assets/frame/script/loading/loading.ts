import dataManager from "../game/dataManager";
import BigVal from "../common/bigval/BigVal";
import http from "../common/http/http"

const { ccclass, property } = cc._decorator;

@ccclass
export default class loading extends cc.Component {

    @property(cc.Sprite)
    SprLogo: cc.Sprite = null;

    @property(cc.Label)
    LabProgress: cc.Label = null;

    HTTP: http = new http();

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.senMsgSure();
        this.getQueryVariable();
        setTimeout(() => {
            this.sendMesageMain();
        }, 1)
        cc.director.preloadScene("Game", (completedCount, totalCount, item) => {
            var p = completedCount / totalCount;
            if (this.SprLogo.fillRange < p) {
                this.SprLogo.fillRange = p;
                this.LabProgress.string = (p * 99).toFixed(0) + " %";
            }
        }, () => {
            console.log("预加载完成")
        });
    }

    /**去前端交互确定进入游戏 */
    senMsgSure() {
        try {
            api.sendEvent({
                name: 'installGame',
            });
        } catch (e) {
            console.log("去前段交互确定进入游戏");
        }
    }

    /**获取TOKEN 值 */
    getQueryVariable() {
        var query = window.location.search.substring(1); //获取当前连接中？后的参数
        console.log("多多世界token链接：", query);
        var vars = query.split("&");
        var pair = vars[0].split("=");
        if (pair[0] == "token") {
            // dataManager.ins().token = pair[1];
            let token = pair[1];
            let index = token.lastIndexOf(".")
            if (index >= 0) {
                token = token.slice(0, index);
            }
            dataManager.ins().token = token;
        }
        console.log("多多世界token：", dataManager.ins().token);
        this.GetGameData();
    }

    /**获取游戏设置数据 */
    GetGameData() {
        var setupNum = JSON.parse(cc.sys.localStorage.getItem('setup'));
        if (setupNum == null) return;
        dataManager.ins().getArrayFromStr(setupNum, dataManager.ins().isBool);
        if (dataManager.ins().isBool[2] === 0) {
            cc.audioEngine.setEffectsVolume(0);
        }
    }

    /**登录给服务器发送请求 */
    sendMesageMain() {
        let self = this;
        let complete = false;
        let fnRequest = function () {
            self.HTTP.sendRequest('/api/game/index', null, function (ret) {
                complete = true;
                self.getMainCanshu(ret);
            }, function (err) {
                console.log("发生错误err", err)
            });
            setTimeout(fn, 5000);
        }
        var fn = function () {
            if (!complete) {
                fnRequest();
            }
        }
        fn();
    }

    /**进入游戏后的赋值 */
    getMainCanshu(obj) {
        try {
            console.log('ssssssssssssssss', obj);
            dataManager.ins().setPlayerKey(obj.id); //获取玩家唯一的key
            dataManager.ins().FHBC = Number(obj.fhbc); //fhbck
            dataManager.ins().FENHONG = Number(obj.fenhong); //分红
            dataManager.ins().BestBirdOfLv = Number(obj.level_bird); //最高等级

            dataManager.ins().TotalCoins = new BigVal(obj.gold); //金币总数量
            dataManager.ins().offLineCoin = new BigVal((obj.offline_gold).toString()); //离线金币
            dataManager.ins().BOX_NUM = obj.box; //宝箱数量
            dataManager.ins().NumberOfVideosLeft = obj.video_num; //剩余视频次数
            dataManager.ins().addQuan_Video = obj.ticket_turn_num; //增加转盘券剩余观看视频次数
            dataManager.ins().NumOfTurntables = obj.ticket; //转盘券剩余次数；
            dataManager.ins().inviteJuan = obj.invite_ticket; //邀请券次数
            dataManager.ins().restOfJuan = obj.ticket_use_num; //每天使用邀请券次数

            dataManager.ins().FHBC_LIST = obj.fhbc_list; //FHBC列表
            dataManager.ins().buy_level = obj.buy_level; //当前购买的等级
            dataManager.ins().buy_price = new BigVal(obj.buy_price); //当前购买的价格

            dataManager.ins().bird_admin = obj.bird_admin; //是否有奖励的鸟
            dataManager.ins().rec_time = obj.rec_time; //上次领取金币时间
            dataManager.ins().now_time = obj.now_time; //刷新时间

            dataManager.ins().dao_num = obj.fenhong_breaker.breaker_num;//屠龙刀数量
            if (obj.fenhong_breaker.breaker_notice) {
                dataManager.ins().dao_notice = obj.fenhong_breaker.breaker_notice;//屠龙刀描述
            }
            dataManager.ins().fenhong_breakerBird = obj.fenhong_breaker.birds;//拥有限时分红龙剩余时间(s)数组

            dataManager.ins().isxinshou = 0;//
            // dataManager.ins().isxinshou = obj.is_novice; //新手指导
            dataManager.ins().video_coin = new BigVal(obj.bird_top); //看视频返还的最高金币
            this.BirdPosition_get(obj); //鸟的位置信息
        } catch (e) {
            console.log(e);
        }
    }

    /**获取鸟的位置信息 */
    BirdPosition_get(obj) {
        var str = null;
        var birdPositon = JSON.parse(cc.sys.localStorage.getItem(dataManager.ins().PlayerId));
        var birdPositonNet = obj.is_have_bird;
        if (!birdPositon) {
            str = birdPositonNet;
        } else {
            let isbool = this.comparePosition(birdPositon, birdPositonNet);
            if (isbool) {
                str = birdPositon;
            } else {
                str = birdPositonNet;
            }
        }
        dataManager.ins().getArrayFromStr(str, dataManager.ins().isHaveBird); //鸟的位置
        cc.director.loadScene("Game");
    }

    /**冒泡排序 */
    NumBsort(str) {
        var arr = [];
        dataManager.ins().getArrayFromStr(str, arr);
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                // 相邻元素两两对比，元素交换，大的元素交换到后面
                if (arr[j] < arr[j + 1]) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    /**服务器和本地数据进行比较 */
    comparePosition(str, str2) {
        var islast = true; //默认读本地
        var array1 = this.NumBsort(str); //本地
        var array2 = this.NumBsort(str2); //服务器
        for (let i = 0; i < 12; i++) {
            if (array1[i] != array2[i]) {
                islast = false;
            }
        }
        return islast;
    }
}
