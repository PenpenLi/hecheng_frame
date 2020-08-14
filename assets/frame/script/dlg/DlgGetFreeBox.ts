import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import dataManager from "../game/dataManager"
import BigVal from "../common/bigval/BigVal"
import cfgManager from "../game/CfgManager"
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

    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner, widdleType.short)

    _open() {
        this.BtnLookVideo.on("click", this.BtnWatchVideo, this);
        this.btnUserQuan.on("click", this.BtnUserQuan, this);
        this.initBOX();
    }

    /**初始化 */
    initBOX() {
        if (dataManager.ins().NumberOfVideosLeft > 0) { //剩余视频次数
            this.BtnLookVideo.active = true;
            this.btnUserQuan.active = false;
            let nodes = this.BtnLookVideo.getChildByName("cishu");
            nodes.getComponent(cc.Label).string = dataManager.ins().strOfLookVideo();
        } else {
            this.BtnLookVideo.active = false;
            this.btnUserQuan.active = true;
        }
        this.LabGetCoins.string = " "; //防止显示问题（数据加载延迟）
        this.sendMessBOX(); //向服务器发送消息获得宝箱金币数量
    }

    /**观看视频的BUTTON */
    BtnWatchVideo() {
        if (dataManager.ins().resttime_video > 0) {
            var str = dataManager.ins().strTimeOfVideo();
            cfgManager.ins().gameManager.gameTips(str)
            return;
        }
        //接入弹出广告sdk
        this.BtnClose();
        cfgManager.ins().videocallback = "coins";
        cfgManager.ins().videoCallvalue = this.getprice.Num;
        cfgManager.ins().LOOK_VIDEO_GAME();
    }

    /**使用邀请券的按钮 */
    BtnUserQuan() {
        this.BtnClose();
        if (dataManager.ins().inviteJuan <= 0) {
            cfgManager.ins().gameManager.gameTips("邀请券数量不足");
            return;
        }
        if (dataManager.ins().restOfJuan <= 0) {
            cfgManager.ins().gameManager.gameTips("当日使用邀请券达到上限");
            return;
        }
        var self = this;
        var call = function () {
            var box = cc.find("Canvas/UIROOT/FlyBox");
            box.getComponent("BoxMove").HomingOfBox();

            dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, self.getprice); //把金币加上
            cfgManager.ins().Tops.initCoinOfTotal(); //显示金币总数
            cfgManager.ins().showFrameBack(3, self.getprice); //显示奖励的弹框
        };
        cfgManager.ins().gameManager.sendMes_videoback(call, 10);
    }

    /**向服务器发送消息获得宝箱金币数量 */
    sendMessBOX() {
        var self = this;
        var funSuc = function (ret) {
            self.getprice = new BigVal(ret);
            self.LabGetCoins.string = "+" + self.getprice.geteveryStr();
        }
        var funErr = function (ret) {
            self.getprice = new BigVal("1000");
            self.LabGetCoins.string = "+" + self.getprice.geteveryStr();
        }
        let params = {
            type: 2
        }
        try {
            cfgManager.ins().http.sendRequest('/api/game/receiveGold', params, funSuc, funErr);
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
