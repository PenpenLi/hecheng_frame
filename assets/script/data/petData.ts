import BigVal from "../common/bigval/BigVal";
import SingletonClass from "../common/base/SingletonClass";
import { G_baseData } from "./baseData";
import { loader_mgr } from "../common/load/loader_mgr";
import { Global_Var } from "../common/base/GlobalVar";

/**宠物数据 */
export default class petData extends SingletonClass {
    public static ins() {
        return super.ins() as petData;
    }

    //每一次金币的总数
    everyCions: BigVal = new BigVal("80");

    //是否有奖励的鸟（1有）
    bird_admin: number = 0;

    //当前购买等级
    buy_level: number = 1;

    //主界面购买的价格
    buy_price: BigVal = new BigVal("80");
    /**商店购买金币的价格*/
    shop_buy_price: BigVal = new BigVal("80");
    //商店购买钻石的价格
    shop_buy_Fhbc: number = 0;

    //记录不同鸟的等级(38--42 金木水火土 43算力 44红包 45 情侣 46 情侣女 47 分红)
    isHaveBird: Array<number> = [38, 39, 40, 41, 42, 3, 4, 37, 37, 45, 45, 0]; //传入数据
    //最高等级的
    BestBirdOfLv: number = 1;

    //防止多指滑动鸟
    isMoveBird: boolean = true;

    //是否开启加速模式
    isSpeedUp: boolean = false;

    /**鸟巢的缩放倍数（默认是1）*/
    scaleBlock: number = 1;

    /**限时分红的时间数组 */
    fenhong_breakerBird: Array<number> = [];

    /** 名字的集合*/
    birdName: {} = null; //鸟的名字
    birdSprList: cc.SpriteFrame[] = []; //鸟的头像合集
    smallBirdSprList: cc.SpriteFrame[] = [];//鸟的小头像合集

    /**加载数据表 */
    public async LogCfg() {
        this.birdName = await loader_mgr.ins().loadName("namejson/birdName");
    }

    /**鸟的名字 */
    getBirdName(id: number) {
        if (!this.birdName) {
            this.LogCfg();
            return "龙";
        }
        var birdName = this.birdName[id - 1].birdName;
        return birdName;
    }

    /**回收鸟的价格 */
    getBirdrecePrice(birdlv: number) {
        var price = this.birdName[birdlv - 1].recePrice;
        return price;
    }

    /**定位宠物的锚点 */
    initanchor_chongwu(chongwu: cc.Node, birdlv: number) {
        if (!this.birdName) {
            console.log("表加载失败");
            return;
        }
        chongwu.x = this.birdName[birdlv - 1].anchorChongwu.x;
        chongwu.y = this.birdName[birdlv - 1].anchorChongwu.y;
    }

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
    showBirdLv(num: number): string {
        if (num < 38) {
            num = num;
        } else {
            num = 38;
        }
        return num.toString();
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

    /**保存鸟的本地数据 */
    saveBirdLocalPosition() {
        var str = this.isHaveBird.join("#");
        Global_Var.setStorage(G_baseData.userData.PlayerId, JSON.stringify(str));
    }
}