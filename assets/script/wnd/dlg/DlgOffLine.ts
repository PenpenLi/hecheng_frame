import baseUi from "../../frameWork/ui/baseUi"
import { uiFormType, uiFormPath, isUseBanner, widdleType } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import { G_baseData } from "../../data/baseData";
import BigVal from "../../common/bigval/BigVal"
import { Game } from "../../game/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgOffLine extends baseUi {

    /**离线金币的文本框 */
    @property(cc.Label)
    labOffLineCoin: cc.Label = null;
    /**看视频 */
    @property(cc.Node)
    Btnlookvideo: cc.Node = null;
    /**使用邀请券 */
    @property(cc.Node)
    BtnUserQuan: cc.Node = null;
    /**使用邀请券 */
    @property(cc.Node)
    Btnsure: cc.Node = null;


    formType = new uiType(uiFormType.PopUp, isUseBanner.openBanner)
    // onLoad () {}
    _open() {
        this.Btnlookvideo.on("click", this.BtnWatchVideo, this);
        this.BtnUserQuan.on("click", this.Btnuserquano, this);
        this.Btnsure.on("click", this.btnSure, this);
        this.initOffLineCoin();
    }

    /**初始化值 */
    initOffLineCoin() {
        let price = G_baseData.userData.offLineCoin;
        this.labOffLineCoin.string = "+" + price.geteveryStr();

        if (G_baseData.userData.NumberOfVideosLeft > 0) { //剩余视频次数
            this.Btnlookvideo.active = true;
            this.BtnUserQuan.active = false;
            this.Btnlookvideo.getChildByName("cishu").getComponent(cc.Label).string = G_baseData.userData.strOfLookVideo();
        } else {
            this.Btnlookvideo.active = false;
            this.BtnUserQuan.active = true;
        }

    }

    /**关闭按钮 */
    btnClose() {
        super._close();
    }

    /**确定按钮 */
    btnSure() {
        this.btnClose();
    }

    /**观看视频 */
    BtnWatchVideo() {
        if (G_baseData.userData.resttime_video > 0) {
            var str = G_baseData.userData.strTimeOfVideo();
            Game.gameManager.gameTips(str)
            return;
        }
        this.btnClose();
        let price_v = BigVal.Mul(G_baseData.userData.offLineCoin, new BigVal("2"));
        Game.ApiManager.videocallback = "coin";
        Game.ApiManager.videoCallvalue = price_v.Num;
        Game.ApiManager.LOOK_VIDEO_GAME("3");
    }

    /**使用邀请券 */
    Btnuserquano() {
        this.btnClose();
        if (G_baseData.userData.inviteJuan <= 0) {
            Game.gameManager.gameTips("邀请券不足");
            return;
        }
        if (G_baseData.userData.restOfJuan <= 0) {
            Game.gameManager.gameTips("当日使用邀请券达到上限");
            return;
        }
        var call = function () {
            let price_q = BigVal.Mul(G_baseData.userData.offLineCoin, new BigVal("2"));
            Game.gameManager.showFrameBack(3, price_q); //显示奖励的弹框
        };
        Game.gameManager.sendMes_videoback(call, 7);
    }

    _hide() {
        this.Btnlookvideo.off("click", this.BtnWatchVideo, this);
        this.BtnUserQuan.off("click", this.Btnuserquano, this);
        this.Btnsure.off("click", this.btnSure, this);
    }

}
