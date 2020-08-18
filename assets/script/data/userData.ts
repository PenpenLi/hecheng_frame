import BigVal from "../common/bigval/BigVal";
import SingletonClass from "../common/base/SingletonClass";

/**基本的用户数据 */
export default class userData extends SingletonClass {

    public static ins() {
        return super.ins() as userData;
    }

    token: string = "1234567890";
    uuid: string = "";

    PlayerId: string = "";    //玩家Id
    FHBC: number = 0; //货币--FHBC

    //金币总数
    TotalCoins: BigVal = new BigVal("100000000");

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

    //转盘剩余次数
    NumOfTurntables: number = 1;

    /**观看视频次数*/
    NumberOfVideosLeft: number = 0;

    /**观看视频剩余时间*/
    resttime_video: number = 0;

    //看视频返的价格
    video_coin: BigVal = new BigVal("80");
    //是新手
    isxinshou: number = 1;

    //记录fhbc列表
    FHBC_LIST: Array<object> = [];

    //设置里的三个按
    isBool: Array<number> = [1, 1, 1];

    //防止后台音效
    isHoutai: boolean = false;

    //(网络加载时)是否生产金币
    isAddCoin_bird: boolean = true;

    //防止快速点击
    is_Click_end: boolean = true;

    //距下一次领取金币剩余时间差；
    rec_time: number = 0;
    now_time: number = 3590;
    LocolIndexTime: number = 0;
    rest_time: number = 0;

    /**当前屠龙刀数量 */
    dao_num: number = 180;

    /**是否断开连接（403) */
    isCloseWebSocket: boolean = false;

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

    /**主界面是否可以购买 */
    isCanBuy(cost: BigVal) {
        if (BigVal.isBiggerEqual(this.TotalCoins, cost)) { //消耗金币
            return true;
        } else {
            return false;
        }
    }

    /**获得玩家Key值 */
    setPlayerKey(id) {
        let key = "user_" + String(id);
        this.PlayerId = key;
    }

    Last_GoldRefrush_Time: number = 0;
    /** 
     * 更新金币数量 
     * 如果时间戳过老、金币没有变化，则返回false
     * 如果可以更新，返回true，则自动将主页金币刷新到最新
    */
    RefreshGold(gold, timestamp) {
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