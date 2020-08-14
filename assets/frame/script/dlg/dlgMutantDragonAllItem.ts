import { loader_mgr } from "../common/load/loader_mgr";
import cfgManager from "../game/CfgManager";
import BigVal from "../common/bigval/BigVal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class dlgMutantDragonAllItem extends cc.Component {

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Label)
    nameLabel: cc.Label = null; //名称
    // @property(cc.Label)
    // nameLabel: cc.Label = null; //名称

    @property(cc.Label)
    priceLabel: cc.Label = null; //购买价格
    @property(cc.Label)
    outputLabel: cc.Label = null; //每日产出
    @property(cc.Label)
    dayLabel: cc.Label = null; //使用天数
    @property(cc.Label)
    useNumLabel: cc.Label = null; //使用数量限制

    /**数据初始化 */
    init(info) {

        // if (rank == 0) {
        //     this.own_kuang.spriteFrame = this.cup_SprList[0]; //框
        //     if (userMessage.rank < 100) {
        //         this.user_labindex.string = userMessage.rank;
        //     } else {
        //         this.user_labindex.string = "+999";
        //     }
        // } else if (rank == 1) {
        //     this.user_indexImage.spriteFrame = this.cup_SprList[1];
        // } else if (rank == 2) {
        //     this.user_indexImage.spriteFrame = this.cup_SprList[2];
        // } else if (rank == 3) {
        //     this.user_indexImage.spriteFrame = this.cup_SprList[3];
        // }
        // if (rank !== 0) {
        //     this.user_labindex.string = userMessage.rank; //排名   
        // }
        // this.loadingHead(this.user_Headplayer, userMessage.avatar); //头像
        // var gold = new BigVal(userMessage.gold).getTotalStr();
        // this.user_labTotalcoin.string = gold; //总金币
        // if (String(userMessage.nickname).length > 6) {
        //     this.user_labname.string = String(userMessage.nickname).slice(0, 6) + "..."; //玩家名字
        // } else {
        //     this.user_labname.string = String(userMessage.nickname);
        // }
        // let dlgLv = Number(userMessage.level);
        // this.user_labbestBird.string = cfgManager.ins().getBirdName(dlgLv) + "  LV " + zhuanghuan(dlgLv);
    }


    /**加载头像 */
    public async loadingHead(container: cc.Sprite, remoteUrl: string) {
        container.spriteFrame = null;
        if (remoteUrl === "") return;
        let pngs = await loader_mgr.ins().loadExternalAsset(remoteUrl, "png");
        container.spriteFrame = new cc.SpriteFrame(pngs)
    }

    // update (dt) {}
}
