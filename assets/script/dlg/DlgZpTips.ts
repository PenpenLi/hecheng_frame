import baseUi from "../common/ui/baseUi"
import { uiFormType, UI_CONFIG_NAME, isUseBananer, widdleType } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import userData from "../data/userData";
import { Game } from "../game/Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {

    /**观看视频按钮*/
    @property(cc.Node)
    btnGetVideo: cc.Node = null;

    /**用邀请券按钮*/
    @property(cc.Node)
    btnGetQuan: cc.Node = null;


    formType = new uiType(uiFormType.PopUp1, isUseBananer.openbanner, widdleType.short)


    _open() {
        this.initZP();
        this.btnGetVideo.on("click", this.WatchOfVideo, this);
        this.btnGetQuan.on("click", this.UserOfQuan, this);
    }

    /**初始化按钮 */
    initZP() {
        if (userData.ins().NumberOfVideosLeft > 0) {
            this.btnGetVideo.active = true;
            this.btnGetQuan.active = false;
            this.btnGetVideo.getChildByName("cishu").getComponent(cc.Label).string = userData.ins().strOfLookVideo();
        } else {
            this.btnGetVideo.active = false;
            this.btnGetQuan.active = true;
            var num = userData.ins().inviteJuan;
            this.btnGetQuan.getChildByName("Tips").getComponent(cc.Label).string = "邀请好友获得邀请券" + "(" + num + ")";
        }
    }

    /**观看视频点击观看*/
    WatchOfVideo() {
        this.btnClose();
        if (userData.ins().resttime_video > 0) { //观看视频的时间限制（15秒）
            var str = userData.ins().strTimeOfVideo();
            Game.gameManager.gameTips(str);
            return;
        }
        if (userData.ins().addQuan_Video <= 0) {
            Game.gameManager.gameTips("今天获取转盘券次数已达上限");
            return;
        }
        Game.ApiManager.videocallback = "quan";
        Game.ApiManager.videoCallvalue = 5;
        Game.ApiManager.LOOK_VIDEO_GAME("1");
    }

    /**使用邀请券 */
    UserOfQuan() {
        this.btnClose();
        if (userData.ins().inviteJuan <= 0) {
            Game.gameManager.gameTips("邀请券数量不足");
            return;
        }
        if (userData.ins().addQuan_Video <= 0) {
            Game.gameManager.gameTips("今天获取转盘券次数已达上限");
            return;
        }
        if (userData.ins().restOfJuan <= 0) {
            Game.gameManager.gameTips("当日使用邀请券达到上限");
            return;
        }
        var self = this;
        var call = function () {
            userData.ins().NumOfTurntables = userData.ins().NumOfTurntables + 5;
            userData.ins().addQuan_Video = userData.ins().addQuan_Video - 1;
            self.show_btn_back();
        };
        Game.gameManager.sendMes_videoback(call, 5); //成功回调
    }


    /**增加完奖励的转盘按钮的显示及次数的增加 */
    show_btn_back() {
        Game.gameManager.shuaxinShowQaun();
    }


    /**关闭按钮 */
    btnClose() {
        super._close();
    }

    _hide() {
        this.btnGetVideo.off("click", this.WatchOfVideo, this);
        this.btnGetQuan.off("click", this.UserOfQuan, this);
    }

}
