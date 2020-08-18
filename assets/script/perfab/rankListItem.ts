import BigVal from "../common/bigval/BigVal";
import { loaderMgr } from "../common/load/loaderMgr"
import { Game } from "../game/Game";
import { G_baseData } from "../data/baseData";

var zhuanghuan = function (num: number) {
    if (num > 38) {
        num = 38;
    }
    return num;
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class rankListItem extends cc.Component {

    /**玩家自己的框 */
    @property(cc.Sprite)
    own_kuang: cc.Sprite = null;
    /**前几名的奖杯 */
    @property(cc.Sprite)
    user_indexImage: cc.Sprite = null;
    /**玩家名次 */
    @property(cc.Label)
    user_labindex: cc.Label = null;
    /**用户的头像 */
    @property(cc.Sprite)
    user_Headplayer: cc.Sprite = null;
    /**用户名 */
    @property(cc.Label)
    user_labname: cc.Label = null;
    /**最高等级的鸟 */
    @property(cc.Label)
    user_labbestBird: cc.Label = null;
    /**总金币 */
    @property(cc.Label)
    user_labTotalcoin: cc.Label = null;

    /**奖杯数组 */
    @property(cc.SpriteFrame)
    cup_SprList: cc.SpriteFrame[] = [];


    /**数据初始化 */
    init(rank, userMessage) {
        if (rank == 0) {
            this.own_kuang.spriteFrame = this.cup_SprList[0]; //框
            if (userMessage.rank < 100) {
                this.user_labindex.string = userMessage.rank;
            } else {
                this.user_labindex.string = "+999";
            }
        } else if (rank == 1) {
            this.user_indexImage.spriteFrame = this.cup_SprList[1];
        } else if (rank == 2) {
            this.user_indexImage.spriteFrame = this.cup_SprList[2];
        } else if (rank == 3) {
            this.user_indexImage.spriteFrame = this.cup_SprList[3];
        }
        if (rank !== 0) {
            this.user_labindex.string = userMessage.rank; //排名   
        }
        this.loadingHead(this.user_Headplayer, userMessage.avatar); //头像
        var gold = new BigVal(userMessage.gold).getTotalStr();
        this.user_labTotalcoin.string = gold; //总金币
        if (String(userMessage.nickname).length > 6) {
            this.user_labname.string = String(userMessage.nickname).slice(0, 6) + "..."; //玩家名字
        } else {
            this.user_labname.string = String(userMessage.nickname);
        }
        let dlgLv = Number(userMessage.level);
        this.user_labbestBird.string = G_baseData.petData.getBirdName(dlgLv) + "  LV " + zhuanghuan(dlgLv);
    }


    /**加载头像 */

    public async loadingHead(container: cc.Sprite, remoteUrl: string) {
        container.spriteFrame = null;
        if (remoteUrl === "") return;
        let pngs = await loaderMgr.ins().loadExternalAsset(remoteUrl, "png");
        container.spriteFrame = new cc.SpriteFrame(pngs)
    }

    // update (dt) {}
}
