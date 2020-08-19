import BigVal from "../common/bigval/BigVal";
import { Game } from "./Game";
import { GIFCache } from "../common/gif/GIF";
import { G_baseData } from "../data/baseData";
import { Global_Var } from "../common/globalVar/GlobalVar";

const { ccclass, property } = cc._decorator;

/**加载提示 */
let tipStr: string = "加载中";
@ccclass
export default class loading extends cc.Component {

    @property(cc.Sprite)
    SprLogo: cc.Sprite = null;

    @property(cc.Label)
    LabProgress: cc.Label = null;

    TBl_isOk = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();
    }

    AssetOk = false;
    /**初始化游戏数据 */
    init() {
        this.loadData();
        GIFCache.getInstance()
        Game.ReloadGame();
        Game.ApiManager.sengMessSure();

        this.GetGameData();
        this.getQueryVariable();
        cc.director.preloadScene("Game", null, () => {
            console.log("预加载完成")
        });
        cc.loader.loadResDir("prefab/Preload", cc.Prefab, (completedCount, totalCount, item) => {
            var p = completedCount / totalCount;
            if (this.SprLogo.fillRange < p) {
                this.SprLogo.fillRange = p;
                this.LabProgress.string = (p * 99).toFixed(0) + " %";

            }
        }, (err, res) => {
            this.sendMesageMain();
            this.AssetOk = true;
            this.LoadGame();
            // cc.director.loadScene("Game");
        })
    }

    //初始化所有的数据层数据
    loadData() {
        let self = this;
        G_baseData.loadBaseData();
        let result = G_baseData.loadTBlData();
        result.then(() => {
            self.TBl_isOk = true;
            self.LoadGame();
        })
    }

    /**获取游戏设置数据 */
    GetGameData() {
        var setupNum = Global_Var.getStorage('setup');
        if (setupNum == null) return;
        Global_Var.getArrayFromStr(setupNum, G_baseData.userData.isBool);
        if (G_baseData.userData.isBool[2] === 0) {
            cc.audioEngine.setEffectsVolume(0);
        }
    }

    /**获取TOKEN 值 */
    getQueryVariable() {
        var query = window.location.search.substring(1); //获取当前连接中？后的参数
        var vars = query.split("&");
        var pair = vars[0].split("=");
        if (pair[0] == "token") {
            G_baseData.userData.token = pair[1];
        }
    }

    /**登录给服务器发送请求 */
    sendMesageMain() {
        let self = this;
        let complete = false;
        let fnRequest = function () {
            Game.HttpManager.sendRequest('/api/game/index', null, (ret) => {
                if (ret.code == 0) {
                    complete = true;
                    self.getMainCanshu(ret.data);
                }
            }, (err) => {
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
            let _userData = G_baseData.userData;
            _userData.uuid = obj.id;
            _userData.setPlayerKey(obj.id); //获取玩家唯一的key
            _userData.FHBC = Number(obj.fhbc); //fhbck
            _userData.FENHONG = Number(obj.fenhong); //分红
            G_baseData.petData.BestBirdOfLv = Number(obj.level_bird) > 0 ? Number(obj.level_bird) : 1; //最高等级

            _userData.TotalCoins = new BigVal(obj.gold); //金币总数量
            _userData.offLineCoin = new BigVal((obj.offline_gold).toString()); //离线金币
            _userData.BOX_NUM = obj.box; //宝箱数量
            _userData.NumberOfVideosLeft = obj.video_num; //剩余视频次数
            _userData.addQuan_Video = obj.ticket_turn_num; //增加转盘券剩余观看视频次数
            _userData.NumOfTurntables = obj.ticket; //转盘券剩余次数；
            _userData.inviteJuan = obj.invite_ticket; //邀请券次数
            _userData.restOfJuan = obj.ticket_use_num; //每天使用邀请券次数

            _userData.FHBC_LIST = obj.fhbc_list; //FHBC列表
            G_baseData.petData.buy_level = obj.buy_level; //当前购买的等级
            G_baseData.petData.buy_price = new BigVal(obj.buy_price); //当前k购买的价格

            G_baseData.petData.bird_admin = obj.bird_admin; //是否有奖励的鸟
            _userData.rec_time = obj.rec_time; //上次领取金币时间
            _userData.now_time = obj.now_time; //刷新时间
            _userData.LocolIndexTime = parseInt((new Date().getTime() / 1000).toString());

            _userData.isxinshou = obj.is_novice; //新手指导
            _userData.video_coin = new BigVal(obj.bird_top); //看视频返还的最高金币
            this.BirdPosition_get(obj); //鸟的位置信息
        } catch (e) {
            console.log(e);
        }
    }

    /**获取鸟的位置信息 */
    BirdPosition_get(obj) {
        var str = null;
        var birdPositon = Global_Var.getStorage(G_baseData.userData.PlayerId);
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
        Global_Var.getArrayFromStr(str, G_baseData.petData.isHaveBird); //鸟的位置
        G_baseData.petData.fenhong_breakerBird = obj.fenhong_compose;

        this.MsgOK = true;
        this.LoadGame();
    }

    MsgOK = false;

    LoadGame() {
        if (this.AssetOk == true && this.MsgOK == true && this.TBl_isOk == true) {
            cc.director.loadScene("Game");
        }
    }

    /**冒泡排序 */
    NumBsort(str) {
        var arr = [];
        Global_Var.getArrayFromStr(str, arr);
        var len = arr.length;
        let strarr = [];
        for (var i = 0; i < len; i++) {
            if (arr[i] == 0) {
                continue;
            }
            let key = 'Lv' + arr[i];
            if (strarr[key]) {
                strarr[key]++;
            }
            else {
                strarr[key] = 1;
            }
        }
        return strarr;
    }

    /**服务器和本地数据进行比较 */
    comparePosition(str, str2) {
        var islast = true; //默认读本地
        var array1 = this.NumBsort(str); //本地
        var array2 = this.NumBsort(str2); //服务器
        let arr1count = 0;
        let arr2count = 0;
        for (const key in array1) {
            if (array1[key] != array2[key]) {
                islast = false;
            }
            arr1count++;
        }
        for (const key in array2) {
            arr2count++;
        }
        if (arr1count != arr2count) {
            islast = false;
        }

        return islast;
    }
}
