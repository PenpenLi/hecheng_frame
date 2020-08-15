import BigVal from "../common/bigval/BigVal";
import SingletonClass from "../common/base/SingletonClass";

/**基本的数据管理类 */
export default class dataManager extends SingletonClass {

    public static ins() {
        return super.ins() as dataManager;
    }
    //1234567890
    //20ac8557babee5e7ba803068df66f88b
    token: string = "1234567890";
    uuid: string = "";

    FHBC: number = 0;
    //金币总数
    TotalCoins: BigVal = new BigVal("100000000");

    //每一次金币的总数
    everyCions: BigVal = new BigVal("80");
    //玩家Id
    PlayerId: string = "";

    /**离线金币*/
    offLineCoin: BigVal = new BigVal("0");

    //宝箱剩余次数
    BOX_NUM: number = 2;
    //邀请券
    inviteJuan: number = 100;

    //当前还可以使用邀请卷的数量（默认10张）
    restOfJuan: number = 1;

    //看视频增加邀请券默认4
    addQuan_Video: number = 4;

    //分红
    FENHONG: number = 1.72;

    //是否有奖励的鸟（1有）
    bird_admin: number = 0;

    //转盘剩余次数
    NumOfTurntables: number = 1;

    /**观看视频次数*/
    NumberOfVideosLeft: number = 0;

    /**观看视频剩余时间*/
    resttime_video: number = 0;

    //当前购买等级
    buy_level: number = 1;

    //主界面购买的价格
    buy_price: BigVal = new BigVal("80");
    /**商店购买金币的价格*/
    shop_buy_price: BigVal = new BigVal("80");
    //商店购买钻石的价格
    shop_buy_Fhbc: number = 0;

    //看视频返的价格
    video_coin: BigVal = new BigVal("80");
    //是新手
    isxinshou: number = 1;

    //记录fhbc列表
    FHBC_LIST: Array<object> = [];

    //记录不同鸟的等级(38--42 金木水火土 43算力 44红包 45 情侣 46 情侣女 47 分红)
    isHaveBird: Array<number> = [38, 39, 40, 41, 42, 3, 4, 37, 37, 45, 45, 0]; //传入数据
    //最高等级的
    BestBirdOfLv: number = 1;

    //设置里的三个按
    isBool: Array<number> = [1, 1, 1];

    //防止后台音效
    isHoutai: boolean = false;

    //(网络加载时)是否生产金币
    isAddCoin_bird: boolean = true;

    //防止快速点击
    is_Click_end: boolean = true;

    //防止多指滑动鸟
    isMoveBird: boolean = true;

    //是否开启加速模式
    isSpeedUp: boolean = false;

    //距下一次领取金币剩余时间差；
    rec_time: number = 0;
    now_time: number = 3590;
    LocolIndexTime: number = 0;
    rest_time: number = 0;

    /**鸟巢的缩放倍数（默认是1）*/
    scaleBlock: number = 1;

    /**当前屠龙刀数量 */
    dao_num: number = 180;

    /**限时分红的时间数组 */
    fenhong_breakerBird: Array<number> = [];


    /**是否断开连接（403) */
    isCloseWebSocket: boolean = false;

    /**根据鸟的标记做实际等级的转换 */
    returnBirdLV(num: number): number {
        if (num < 38) return num;
        switch (Number(num)) {
            case 38: //金
                num = 38;
                break;
            case 39: //木
                num = 38;
                break;
            case 40: //水
                num = 38;
                break;
            case 41: //火
                num = 38;
                break;
            case 42: //土
                num = 38;
                break;
            case 43: //算力
                num = 39;
                break;
            case 44: //红包
                num = 40;
                break;
            case 45: //情侣男
                num = 41;
                break;
            case 46: //情侣女
                num = 41;
                break;
            case 47: //分红
                num = 42;
                break;
        }
        return num;
    }

    /**显示图片等级的鸟 */
    showBirdLV(num: number): string {
        if (num < 38) {
            num = num;
        } else {
            num = 38;
        }
        return num.toString();
    }

    /**转换时间 */
    getTime(time_chonwu: number): string {
        let str_time: string = null;
        if (86400 < time_chonwu) {
            let day: number = Math.floor(time_chonwu / 86400);
            let hour: number = Math.floor((time_chonwu % 86400) / 3600);
            str_time = this.addZone(day) + "天" + this.addZone(hour) + "时";
        } else if (86400 > time_chonwu && time_chonwu > 3600) {
            let hour: number = Math.floor(time_chonwu / 3600);
            let min: number = Math.floor((time_chonwu % 3600) / 60);
            str_time = this.addZone(hour) + "时" + this.addZone(min) + "分";
        } else {
            let min: number = Math.floor(time_chonwu / 60);
            let sec: number = time_chonwu % 60;
            str_time = this.addZone(min) + "分" + this.addZone(sec) + "秒";
        }
        return str_time;
    }

    /**填零方法 */
    addZone(num): string {
        let a = num.toString();
        if (a.length < 2) {
            a = "0" + a;
        }
        return a;
    }

    /**剩余视频次数文字转换 */
    strOfLookVideo() {
        var num = this.NumberOfVideosLeft;
        let str = "每日更新两次，中午12点，凌晨0点（剩余" + num + "次）";
        return str;
    }

    /**观看视频剩余时间 */
    strTimeOfVideo() {
        var num = this.resttime_video;
        let str = "不能频繁观看视频，请于" + num + "秒后再试";
        return str;
    }

    /**检查是否满足条件(图鉴) */
    CheckItemSelf(num: number) {
        let shuzu = this.isHaveBird;
        for (let i = 0, count = shuzu.length; i < count; i++) {
            if (num === shuzu[i]) {
                return true;
            }
        }
        return false;
    }

    /**主界面是否可以购买 */
    isCanBuy(cost: BigVal) {
        if (BigVal.isBiggerEqual(this.TotalCoins, cost)) { //消耗金币
            return true;
        } else {
            return false;
        }
    }

    /**把数组转换成字符串 */
    getStrFromArray(Arraystr) {
        let str = "";
        for (let i = 0; i < Arraystr.length; i++) {
            if (i < Arraystr.length - 1) {
                str += Arraystr[i] + "#";
            } else {
                str += Arraystr[i];
            }
        }
        return str;
    }

    /**把字符串转换成数组 */
    getArrayFromStr(str: string, Arraystr: Array<number>) {
        let Array_str = str.split("#");
        for (let i = 0; i < Array_str.length; i++) {
            Arraystr[i] = Number(Array_str[i]);
        }
    }

    /**获得玩家Key值 */
    setPlayerKey(id) {
        let key = "user_" + String(id);
        this.PlayerId = key;
    }

    /**保存鸟的本地数据 */
    localBirdsave() {
        var str = this.getStrFromArray(this.isHaveBird);
        cc.sys.localStorage.setItem(this.PlayerId, JSON.stringify(str));
    }

    Last_GoldRefrush_Time: number = 0;
    /** 
     * 更新金币数量 
     * 如果时间戳过老、金币没有变化，则返回false
     * 如果可以更新，返回true，则自动将主页金币刷新到最新
    */
    RefrushGold(gold, timestamp) {
        if (timestamp > this.Last_GoldRefrush_Time) {
            this.Last_GoldRefrush_Time = timestamp;
            if (gold != this.TotalCoins.Num) {
                this.TotalCoins = new BigVal(gold);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

}