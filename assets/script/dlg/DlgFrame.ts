import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import BigVal from "../common/bigval/BigVal";
import { Game } from "../game/Game";
import { G_baseData } from "../data/baseData";

const { ccclass, property } = cc._decorator;

var box: number = 0;
@ccclass
export default class setup extends baseUi {

    /** 确认按钮,观看视频,使用券*/
    @property(cc.Button)
    btnCloup: cc.Button[] = [];

    /**补写中奖的图片资源*/
    @property(cc.Sprite)
    SprReward: cc.Sprite = null;

    /**提示中奖的信息*/
    @property(cc.Label)
    LabReward: cc.Label = null;

    /** 补写中奖的图片资源*/
    @property(cc.SpriteFrame)
    LuckdrawTuji: cc.SpriteFrame[] = [];

    formType = new uiType(uiFormType.PopUp1, isUseBananer.openbanner, widdleType.long)
    // onLoad () {}
    _open(param) {
        this.btnCloup[0].node.on("click", this.BtnClose, this);
        this.btnCloup[1].node.on("click", this.clickBtnVideo, this);
        this.btnCloup[2].node.on("click", this.click_YaoQingJuan, this);
        if (param[0] === 0) {
            this.initMessage(param[1], param[2]);
        } else {
            this.initvideoBack(param[1], param[2]);
        }
    }

    _hide() {
        console.log("注销监听")
        this.btnCloup[0].node.off("click", this.BtnClose, this);
        this.btnCloup[1].node.off("click", this.clickBtnVideo, this);
        this.btnCloup[2].node.off("click", this.click_YaoQingJuan, this);
    }

    /**页面信息的更新初始化 金币0 钻石1 宝箱2*/
    initMessage(index, rewardnum) {
        switch (index) {
            case 1:
                this.AfterOfFrame(rewardnum, 0);
                break;
            case 2:
                this.AfterOfFrame(5, 1);
                break;
            case 3:
                this.AfterOfFrame(rewardnum, 2);
                box = 5;
                break;
            case 4:
                this.AfterOfFrame(rewardnum, 0);
                break;
            case 5:
                this.AfterOfFrame(rewardnum, 0);
                break;
            case 6:
                this.AfterOfFrame(10, 1);
                break;
            case 7:
                this.AfterOfFrame(rewardnum, 0);
                break;
            case 8:
                this.AfterOfFrame(rewardnum, 2);
                box = 10;
                break;
        }

    }

    /**打开界面的显示 */
    AfterOfFrame(rewardnum, index) {
        this.SprReward.spriteFrame = this.LuckdrawTuji[index];
        if (index == 0) { //金币
            //刷新总金币
            Game.Tops.initCoinOfTotal();
            var coins = new BigVal(rewardnum);
            let str6 = "+" + coins.geteveryStr();
            this.LabReward.string = str6;
            this.LabReward.fontSize = 40;

            this.btnCloup[0].node.active = true;
            this.btnCloup[1].node.active = false;
            this.btnCloup[2].node.active = false;
        } else if (index == 1) { //钻石
            let str = "MBC*" + rewardnum;
            this.LabReward.string = str;
            this.LabReward.fontSize = 40;

            this.btnCloup[0].node.active = true;
            this.btnCloup[1].node.active = false;
            this.btnCloup[2].node.active = false;

            G_baseData.userData.FHBC = G_baseData.userData.FHBC + Number(rewardnum);
            this.scheduleOnce(function () {
                Game.Tops.initFHBC();
            }, 0.5);

        } else if (index == 2) { //宝箱
            let str = "发财了，下次奖励翻" + rewardnum + "倍";
            this.LabReward.string = str;
            this.LabReward.fontSize = 30;

            if (G_baseData.userData.NumberOfVideosLeft > 0) {
                console.log("剩余观看视频次数", G_baseData.userData.NumberOfVideosLeft);
                this.btnCloup[0].node.active = false;
                this.btnCloup[1].node.active = true;
                this.btnCloup[2].node.active = false;
                let nodes = this.btnCloup[1].node.getChildByName("cishu");
                nodes.getComponent(cc.Label).string = G_baseData.userData.strOfLookVideo();
            } else {
                //补写视频次数不足逻辑,邀请券
                this.btnCloup[0].node.active = false;
                this.btnCloup[1].node.active = false;
                this.btnCloup[2].node.active = true;
            }
        }
    }

    BtnClose() {

        super._close();
    }

    /**观看视频的方法 */
    clickBtnVideo() {
        if (G_baseData.userData.resttime_video > 0) {
            var str = G_baseData.userData.strTimeOfVideo();
            Game.gameManager.gameTips(str)
            return;
        }
        this.BtnClose();
        Game.ApiManager.videocallback = "box";
        Game.ApiManager.videoCallvalue = box;
        Game.ApiManager.LOOK_VIDEO_GAME("2", `${box}`);
    }

    /**使用邀请券的方法 */
    click_YaoQingJuan() {
        if (G_baseData.userData.inviteJuan <= 0) {
            Game.gameManager.gameTips("邀请券不足");
            return;
        }
        if (G_baseData.userData.restOfJuan <= 0) {
            Game.gameManager.gameTips("当日使用邀请券达到上限");
            return;
        }
        var self = this;
        var call = function () {
            self.initvideoBack(2, box);
        };
        Game.gameManager.sendMes_videoback(call, 6, box)
    }

    /**看完视频回调时的初始化，使用 */
    initvideoBack(type: number, num: any) {
        this.btnCloup[0].node.active = true;
        this.btnCloup[1].node.active = false;
        this.btnCloup[2].node.active = false;
        switch (type) {
            case 1: //转盘券
                this.SprReward.spriteFrame = this.LuckdrawTuji[0];
                let str1 = "恭喜获得" + num + "张转盘券";
                this.LabReward.string = str1;
                this.LabReward.fontSize = 30;
                break;
            case 2: //宝箱
                this.SprReward.spriteFrame = this.LuckdrawTuji[2];
                let str2 = "发财了，下次奖励翻" + num + "倍";
                this.LabReward.string = str2;
                this.LabReward.fontSize = 30;
                break;
            case 3: //金币
                this.SprReward.spriteFrame = this.LuckdrawTuji[0];
                let str3 = "+" + num.geteveryStr();
                this.LabReward.string = str3;
                this.LabReward.fontSize = 40;
                break;
            case 4://mbc
                this.SprReward.spriteFrame = this.LuckdrawTuji[1];
                let str4 = "+" + num;
                this.LabReward.string = str4;
                this.LabReward.fontSize = 40;
                break;
            case 5://算力
                this.SprReward.spriteFrame = this.LuckdrawTuji[3];
                let str5 = "+" + num;
                this.LabReward.string = str5;
                this.LabReward.fontSize = 40;
                break;
        }

    }

}
