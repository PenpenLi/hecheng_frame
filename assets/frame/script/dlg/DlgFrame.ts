import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import BigVal from "../common/bigval/BigVal";
import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager"

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

    formType = new uiType(uiFormType.PopUp1, isUseBananer.openbanner, widdleType.short)
    // onLoad () {}
    _open(param) {
        this.btnCloup[0].node.on("click", this.BtnClose, this);
        this.btnCloup[1].node.on("click", this.clickBtnVideo, this);
        this.btnCloup[2].node.on("click", this.click_YaoQingJuan, this);
        if (param[0] === 0) { //转盘
            this.initMessage(param[1], param[2]);
        } else if (param[0] === -1) { //超级转盘
            this.AfterOfFrame(param[1], 1)//奖励只有mbc
        } else {
            this.initvideoBack(param[1], param[2]); //默认param[0]==1;
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
            var coins = new BigVal(rewardnum);
            let str6 = "+" + coins.geteveryStr();
            this.LabReward.string = str6;
            this.LabReward.fontSize = 40;

            this.btnCloup[0].node.active = true;
            this.btnCloup[1].node.active = false;
            this.btnCloup[2].node.active = false;

            dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, coins); //把金币加上
            this.scheduleOnce(function () {
                cfgManager.ins().Tops.initCoinOfTotal();
            }, 0.5);
        } else if (index == 1) { //钻石
            let str = "MBC*" + rewardnum;
            this.LabReward.string = str;
            this.LabReward.fontSize = 40;

            this.btnCloup[0].node.active = true;
            this.btnCloup[1].node.active = false;
            this.btnCloup[2].node.active = false;

            dataManager.ins().FHBC = dataManager.ins().FHBC + Number(rewardnum);
            this.scheduleOnce(function () {
                cfgManager.ins().Tops.initFHBC();
            }, 0.5);

        } else if (index == 2) { //宝箱
            let str = "发财了，下次奖励翻" + rewardnum + "倍";
            this.LabReward.string = str;
            this.LabReward.fontSize = 30;

            //视频无限
            this.btnCloup[0].node.active = false;
            this.btnCloup[1].node.active = true;
            this.btnCloup[2].node.active = false;
            // let nodes = this.btnCloup[1].node.getChildByName("cishu");
            // nodes.getComponent(cc.Label).string = dataManager.ins().strOfLookVideo();

            // if (dataManager.ins().NumberOfVideosLeft > 0) {
            //     this.btnCloup[0].node.active = false;
            //     this.btnCloup[1].node.active = true;
            //     this.btnCloup[2].node.active = false;
            //     let nodes = this.btnCloup[1].node.getChildByName("cishu");
            //     nodes.getComponent(cc.Label).string = dataManager.ins().strOfLookVideo();
            // } else {
            //     //补写视频次数不足逻辑,邀请券
            //     this.btnCloup[0].node.active = false;
            //     this.btnCloup[1].node.active = false;
            //     this.btnCloup[2].node.active = true;
            // }
        }
    }

    BtnClose() {
        super._close();
    }

    /**观看视频的方法 */
    clickBtnVideo() {
        if (dataManager.ins().resttime_video > 0) {
            var str = dataManager.ins().strTimeOfVideo();
            cfgManager.ins().gameManager.gameTips(str)
            return;
        }
        this.BtnClose();
        // 转盘宝箱双倍看视频 
        cfgManager.ins().videocallback = "box";
        cfgManager.ins().videoCallvalue = box;
        cfgManager.ins().LOOK_VIDEO_GAME();
        // cfgManager.ins().gameManager.testWatchVideoFunc(); //测试
    }

    /**使用邀请券的方法 */
    click_YaoQingJuan() {
        if (dataManager.ins().inviteJuan <= 0) {
            cfgManager.ins().gameManager.gameTips("邀请券不足");
            return;
        }
        if (dataManager.ins().restOfJuan <= 0) {
            cfgManager.ins().gameManager.gameTips("当日使用邀请券达到上限");
            return;
        }
        var self = this;
        var call = function () {
            self.initvideoBack(2, box);
        };
        cfgManager.ins().gameManager.sendMes_videoback(call, 6, box)
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
        }

    }

}
