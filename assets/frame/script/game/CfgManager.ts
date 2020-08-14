import SingletonClass from "../common/base/SingletonClass"
import main from "./main";
import tops from "../dlg/Tops";
import Bottom from "../dlg/Bottom";
import boxMove from "./BoxMove"
import HTTP from "../common/http/http";
import { loader_mgr } from "../common/load/loader_mgr";
import { uiManager } from "../common/ui/uiManager";
import { UI_CONFIG_NAME, uiFormPath } from "../common/config/gameConfigs"
import dataManager from "./dataManager"

export default class cfgManager extends SingletonClass {
    /**HTTP */
    http: HTTP = new HTTP();

    /**视频回调类型 */
    videocallback: any = null;
    /**视频回调参数 */
    videoCallvalue: any = null;

    /**找到场景中的gamemanager */
    gameManager: main = null;

    /**box */
    Box: boxMove = null;

    /**找到场景的tops */
    Tops: tops = null;
    /**找到场景的Bottom */
    Bottom: Bottom = null;

    /**移动时鸟的父级 */
    ParentItem: cc.Node = null;

    /** 名字的集合*/
    birdName: {} = null;



    /**判断运行环境 */
    runningType: boolean = false;

    public static ins() {
        return super.ins() as cfgManager;
    }

    constructor() {
        super();
        this.gameManager = cc.find("gameManager").getComponent(main);
        this.ParentItem = cc.find("Canvas/birdMoveFther");
        this.Box = cc.find("Canvas/UIROOT/FlyBox").getComponent(boxMove);
    }

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

    /**看完 视频 获得奖励的弹框 */
    showFrameBack(index: number, num: any) {
        if (index == 1) {
            this.shuaxinShowQaun();
        } else {
            //参数1打开第二种
            uiManager.ins().show(UI_CONFIG_NAME.DlgFrame, 1, index, num)
        }
    }

    /**看完视频刷新转盘券*/
    shuaxinShowQaun() {
        let PopUp = cc.find(uiFormPath.PopUp);
        let zhuangpan = PopUp.getChildByName("DlgZhuanPan");
        if (!zhuangpan) {
            console.log("no find")
        } else {
            zhuangpan.getComponent("DlgZhuanPan").callbackReward();
        }
    }

    /**首页弹出广告 */
    openGuangGao() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'imageTextCartFrame',
                } //打开首页广告
            });
        } catch (e) {
            console.log("首页弹出广告");
        }
    }

    /**分享好友 */
    sendShareFriend() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'shareFrame'
                } //分享好友
            });
        } catch (e) {
            console.log("分享好友");
        }
    }

    /**弹出红包接口 */
    openHongbao(num?: number) {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'redPacket',
                    id: num,
                } //打开红包
            });
        } catch (e) {
            console.log("hongbao");
        }
    }

    /**点击活动 */
    clickactive_0() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'activity'
                } //打开视频
            });
        } catch (e) {
            console.log("点击活动");
        }
    }

    /**点击消息 */
    clickMessage_0() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'message'
                } //打开视频
            });
        } catch (e) {
            console.log("点击消息");
        }
    }

    /**摇一摇 */
    clickYaoAgain() {
        //看完视频的接口（宝箱）
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'HomeEvent',
                } //打开首页广告
            });
        } catch (e) {
            console.log("摇一摇");
        }
    }

    /**怎么玩 */
    btnClickPlay() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'course'
                } //打开视频
            });
        } catch (e) {
            console.log("怎么玩");
        }
    }

    /**点击左上角FHBC */
    btnClickLeftJewel() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'property',
                    params: {
                        type: 0,
                        propertyNum: dataManager.ins().FHBC.toFixed(3)
                    }
                } //打开视频
            });
        } catch (e) {
            console.log("点击fhbc");
        }
    }

    /**点击正上方昨天分红 */
    btnClickFenhong() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'participationInProfit'
                } //打开视频
            });
        } catch (e) {
            console.log("分红");
        }
    }

    /***点击变异龙 */
    btnClickVariationDragon(){
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'variationDragon'
                } //打开视频
            });
        } catch (e) {
            console.log("变异龙");
        } 
    }

    /**传参广告类型 0穿山甲 1优亮汇*/
    ad_type: number = 0;
    /**看视频跳链接 */
    LOOK_VIDEO_GAME() {
        if (this.runningType) {
            this.ad_type = 0;
        } else {
            this.ad_type = dataManager.ins().getRandomNumbanner(this.guanggao_type);
        }
        var adtype = this.ad_type;
        dataManager.ins().video_type = adtype; //暂时没写在视频回调里，使用的的时候，只在记录里使用1次，真正上报和记录的保持一致
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'ad',
                    fnStr: 'showVideoAD',
                    lx: adtype

                } //打开视频
            });
        } catch (e) {
            console.log("看视频跳链接", adtype);
        }
        // this.gameManager.check_video_back();
    }

    /**广告类型 */
    guanggao_type: number = 0;
    /**获取广告类型 广告类型:0=穿山甲;1=优量汇, 2=同时开*/
    sendMessOfGuanggaoType() {
        var self = this;
        var funSuc = function (ret) {
            self.guanggao_type = ret.adver_switch;
            console.log("广告类型", self.guanggao_type);
        }
        var funErr = function (ret) {
            console.error("获取广告失败")
        }
        let params = {}
        try {
            setTimeout(() => {
                this.http.sendRequest('/api/game/get_advertising', params, funSuc, funErr);
            }, 0)
        } catch (e) {
            console.log(e);
        }
    }
    /**判断运行环境+版本号*/
    getRunPlatform() {
        try {
            if (api.systemType === "ios") {
                this.runningType = true;
                console.log('当前运行环境是' + api.systemType);
            }

        } catch (e) {
            console.log("判断当前运行环境");
        }
    }

    openBannerAD_num: number = 0;
    /**打开banner广告 */
    openBannerAD(type?: number, isonlybannner?: true) {
        if (this.runningType) {
            this.openBannerAD_num = 0;
        } else {
            this.openBannerAD_num = dataManager.ins().getRandomNumbanner(this.guanggao_type);
        }
        try {
            let lx_0 = this.openBannerAD_num;
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'ad',
                    fnStr: 'showBannerAD',
                    lx: lx_0
                } //打开视频
            });
        } catch (e) {
            console.log("打开banner广告", this.openBannerAD_num);
        }
    }
    /**关闭banner广告 */
    hideBannerAD(type?: number) {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'ad',
                    fnStr: 'hideBannerAD',
                } //打开视频
            });
        } catch (e) {
            console.log("关闭banner广告", this.openBannerAD_num);
        }
    }

    showNativeAD_num: number = 0;
    /**打开原生广告 */
    showNativeAD(call?: Function) {
        if (this.runningType) {
            this.showNativeAD_num = 0;
        } else {
            this.showNativeAD_num = dataManager.ins().getRandomNumbanner(this.guanggao_type);
        }
        call(this.showNativeAD_num);
        try {
            let lx_0 = this.showNativeAD_num;
            if (lx_0 === 1) { //优亮汇自动打开原生和Banner
                api.sendEvent({
                    name: 'gameEvent',
                    extra: {
                        type: 'ad',
                        fnStr: 'shownativeQian',
                    }
                });
            } else {
                api.sendEvent({ //穿山甲banner
                    name: 'gameEvent',
                    extra: {
                        type: 'ad',
                        fnStr: 'showBannerAD',
                        lx: lx_0
                    } //打开banner
                });
            }
        } catch (e) {
            console.log("打开原生和banner广告", this.showNativeAD_num);
        }
    }

    /**关闭原生广告 */
    hideNativeAD() {
        try {
            if (this.showNativeAD_num === 1) {
                api.sendEvent({ //关闭原生和banner
                    name: "closeanative",
                    extra: {
                        key: 'y'
                    }
                });
            } else {
                api.sendEvent({
                    name: 'gameEvent',
                    extra: {
                        type: 'ad',
                        fnStr: 'hideBannerAD',
                    }
                });
            }
        } catch (e) {
            console.log("关闭原生和banner广告", this.showNativeAD_num);
        }
    }
}
