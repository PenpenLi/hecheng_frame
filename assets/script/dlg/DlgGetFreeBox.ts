import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import BigVal from "../common/bigval/BigVal"
import { Game } from "../game/Game";
import { G_baseData } from "../data/baseData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {
    @property(cc.Label)
    LabGetCoins: cc.Label = null;

    /**观看视频*/
    @property(cc.Node)
    BtnLookVideo: cc.Node = null;
    /**试用邀请券*/
    @property(cc.Node)
    btnUserQuan: cc.Node = null;

    getprice: BigVal = new BigVal("0");

    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner)

    _open() {
        this.BtnLookVideo.on("click", this.BtnWatchVideo, this);
        this.btnUserQuan.on("click", this.BtnUserQuan, this);
        this.initBOX();
    }

    /**初始化 */
    initBOX() {
        if (G_baseData.userData.NumberOfVideosLeft > 0) { //剩余视频次数
            this.BtnLookVideo.active = true;
            this.btnUserQuan.active = false;
            let nodes = this.BtnLookVideo.getChildByName("cishu");
            nodes.getComponent(cc.Label).string = G_baseData.userData.strOfLookVideo();
        } else {
            this.BtnLookVideo.active = false;
            this.btnUserQuan.active = true;
        }
        this.LabGetCoins.string = " "; //防止显示问题（数据加载延迟）
        this.sendMessBOX(); //向服务器发送消息获得宝箱金币数量
    }

    /**观看视频的BUTTON */
    BtnWatchVideo() {
        if (G_baseData.userData.resttime_video > 0) {
            var str = G_baseData.userData.strTimeOfVideo();
            Game.gameManager.gameTips(str)
            return;
        }
        //接入弹出广告sdk
        this.BtnClose();
        Game.ApiManager.videocallback = "coins";
        Game.ApiManager.videoCallvalue = this.getprice.Num;
        Game.ApiManager.LOOK_VIDEO_GAME("9");
    }

    /**使用邀请券的按钮 */
    BtnUserQuan() {
        this.BtnClose();
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
            var box = cc.find("Canvas/UIROOT/FlyBox");
            box.getComponent("BoxMove").HomingOfBox();
            Game.gameManager.showFrameBack(3, self.getprice); //显示奖励的弹框
        };
        Game.gameManager.sendMes_videoback(call, 10);
    }

    /**向服务器发送消息获得宝箱金币数量 */
    sendMessBOX() {
        var self = this;
        var funSuc = function (ret) {
            if (ret.code == 0) {
                self.getprice = new BigVal(ret.data.add_num);
                self.LabGetCoins.string = "+" + self.getprice.geteveryStr();
            }
        }
        var funErr = function (ret) {
            self.getprice = new BigVal("1000");
            self.LabGetCoins.string = "+" + self.getprice.geteveryStr();
        }
        let params = {
            type: 2
        }
        try {
            Game.HttpManager.sendRequest('/api/game/receiveGold', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    BtnClose() {
        super._close();
    }

    _hide() {
        this.BtnLookVideo.off("click", this.BtnWatchVideo, this);
        this.btnUserQuan.off("click", this.BtnUserQuan, this);
    }
}
