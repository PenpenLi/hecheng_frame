import { Game } from "./Game";
import { G_baseData } from "../data/baseData";


export class ApiManager {

    /**视频回调类型 */
    videocallback: any = null;
    /**视频回调参数 */
    videoCallvalue: any = null;

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
            Game.Console.Log("首页弹出广告");
        }
    }

    /**去前段交互确定进入游戏 */
    sengMessSure() {
        try {
            api.sendEvent({
                name: 'installGame',
            });
        } catch (e) {
            Game.Console.Log("去前段交互确定进入游戏");
        }
    }

    /**分享好友 */
    sendShareFriend() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'shareFrame'
                } //打开视频
            });
        } catch (e) {
            Game.Console.Log("分享好友");
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
            Game.Console.Log("hongbao");
        }
    }

    /**炫耀一下 */
    sendXaunyao() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'shareFrame'
                } //打开视频
            });
        } catch (e) {
            Game.Console.Log("炫耀一下");
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
            Game.Console.Log("点击活动");
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
            Game.Console.Log("点击消息");
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
            Game.Console.Log("怎么玩");
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
                        propertyNum: G_baseData.userData.FHBC.toFixed(3)
                    }
                } //打开视频
            });
        } catch (e) {
            Game.Console.Log("点击fhbc");
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
            Game.Console.Log("分红");
        }
    }

    /**如何绑定账号 */
    btnHowbinaccount() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'focusWeiXinMark'
                } //打开视频
            });
        } catch (e) {
            Game.Console.Log("如何绑定账号");
        }
    }

    rewardType: string = "";
    /**判断运行环境 */
    runningType: boolean = false;
    /**传参广告类型 0穿山甲 1优亮汇*/
    ad_type: number = 0;
    /**看视频跳链接 */
    LOOK_VIDEO_GAME(rewardType: string = "", rewardnum: string = "") {
        let adtype = 0;
        this.ad_type = this.getRandomNumVedio(this.guanggao_type);
        if (this.ad_type === 1 || this.ad_type === 2) {
            this.youLianghuiSend();
            adtype = this.ad_type;
            this.ad_type = 1;
        } else {
            adtype = this.ad_type;
        }
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'ad',
                    fnStr: 'showVideoAD',
                    lx: adtype,
                    key1: rewardType,
                    key2: rewardnum,
                    key3: G_baseData.userData.uuid
                } //打开视频
            });
        } catch (e) {
            Game.Console.Log("看视频跳链接", G_baseData.userData.uuid);
        }
    }

    /**++++++++++++++++++++优亮汇广告提前掉 */
    youLianghuiSend() {
        var funSuc = function () { }
        var funErr = function () { }
        let params = {
            create_time: Math.round(Number(new Date()) / 1000)
        }
        try {
            Game.HttpManager.sendRequest('/portal/incentive/hui_record', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    /**广告类型0穿山甲 1优亮汇  */
    guanggao_type: number = 1;
    /**是否两条联播 */
    adver_type: number = 1;
    /**获取广告类型 广告类型:0=穿山甲;1=优量汇, 2=同时开*/
    sendMessOfGuanggaoType() {
        var self = this;
        var funSuc = function (ret) {
            if (ret.code == 0) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    self.guanggao_type = ret.data.adver_switch;
                    self.adver_type = ret.data.adver_type;
                } else if (cc.sys.os === cc.sys.OS_IOS) {
                    self.guanggao_type = ret.data.ios_adver_switch;
                    self.adver_type = ret.data.ios_adver_type;
                } else {
                    self.guanggao_type = 0;
                    self.adver_type = 1;
                }
            }
        }
        var funErr = function (ret) {
            console.error("获取广告失败")
        }
        setTimeout(() => {
            Game.HttpManager.sendRequest('/api/game/get_advertising', null, funSuc, funErr);
        }, 0)
    }

    openBannerAD_num: number = 0;
    bannerAdTimer: any = null;
    /**打开banner广告 */
    openBannerAD() {
        this.openBannerAD_num = this.getRandomNumbanner(this.guanggao_type);
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
            Game.Console.Log("打开banner广告1", this.openBannerAD_num);
        }
        if (this.bannerAdTimer) {
            clearTimeout(this.bannerAdTimer);
            this.bannerAdTimer = null;
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
            Game.Console.Log("关闭banner广告");
        }
    }


    showNativeAD_num: number = 0;
    /**打开原生广告 */
    showNativeAD(call?: Function) {
        if (this.runningType) {
            this.showNativeAD_num = 0;
        } else {
            this.showNativeAD_num = this.getRandomNumbanner(this.guanggao_type);
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
            Game.Console.Log("打开原生和banner广告", this.showNativeAD_num);
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
            Game.Console.Log("关闭原生和banner广告", this.showNativeAD_num);
        }
    }

    /**获取banner类型 */
    getRandomNumbanner(num: number) {
        let banneetype = null;
        switch (num) {
            case 0:
            case 1:
                banneetype = num;
                break;
            case 2:
                let nums = Math.random();
                if (0.5 <= nums) {
                    banneetype = 0;
                } else {
                    banneetype = 1;
                }
                break;
        }
        return banneetype;
    }
    /**获取视频类型 */
    getRandomNumVedio(num: number) {
        let vedioType = 0;
        switch (num) {
            case 0:
            case 1:
                vedioType = num;
                break;
            case 2:
                if (this.adver_type === 1) {
                    vedioType = G_baseData.userData.NumberOfVideosLeft % 2;
                } else {
                    vedioType = 2;
                }
                break;
        }
        return vedioType;
    }

    /**首页摇一摇广告 */
    openYaoyiYao(type: string) {
        try {
            api.sendEvent({
                name: 'yyy',
                extra: {
                    type: type,
                } //打开首页广告
            });
        } catch (e) {
            Game.Console.Log("首页弹出广告");
        }
    }

    /** 摇一摇震屏 */
    Shake() {
        try {
            api.sendEvent({
                name: 'shake',
            });
        } catch (e) {
            Game.Console.Log("摇一摇震动");
        }
    }

    GameRestart() {
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'GameRestart',
                } //
            });
        } catch (e) {
            Game.Console.Log("游戏重启");
        }
    }

}