import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager";
import BigVal from "../common/bigval/BigVal"



const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {

    /**显示金币数*/
    @property(cc.Label)
    LabGetCoins: cc.Label = null;
    /**邀请券按钮*/
    @property(cc.Node)
    BtnJuan: cc.Node = null;
    /**视频按钮*/
    @property(cc.Node)
    BtnWatchVideo: cc.Node = null;

    video_coin: BigVal = new BigVal("0")

    formType = new uiType(uiFormType.PopUp1, isUseBananer.openbanner, widdleType.long)


    _open() {
        this.BtnWatchVideo.on("click", this.btnWatch, this);
        this.BtnJuan.on("click", this.User_yaoqingjuan, this);
        this.initNotCoin();
    }


    /**金币初始化 */
    initNotCoin() {
        if (dataManager.ins().NumberOfVideosLeft > 0) { //剩余视频次数
            this.BtnWatchVideo.active = true;
            this.BtnJuan.active = false;
            this.BtnWatchVideo.getChildByName("cishu").getComponent(cc.Label).string = dataManager.ins().strOfLookVideo();
        } else {
            this.BtnWatchVideo.active = false;
            this.BtnJuan.active = true;
        }
        this.LabGetCoins.string = "";
        this.sendMessCoin(); //向服务器获取金币数据
    }

    btnClose() {
        super._close();
    }

    /**观看视频接口 */
    btnWatch() {
        if (dataManager.ins().resttime_video > 0) {
            var str = dataManager.ins().strTimeOfVideo();
            cfgManager.ins().gameManager.gameTips(str);
            return;
        }
        this.btnClose();
        cfgManager.ins().videocallback = "coin";
        cfgManager.ins().videoCallvalue = this.video_coin.Num;
        cfgManager.ins().LOOK_VIDEO_GAME();
    }
    /**用邀请券 */
    User_yaoqingjuan() {
        this.btnClose();
        console.log("邀请券");
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
            dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, self.video_coin); //把金币加上
            cfgManager.ins().Tops.initCoinOfTotal(); //显示金币总数
            cfgManager.ins().showFrameBack(3, self.video_coin); //显示奖励的弹框
        };
        cfgManager.ins().gameManager.sendMes_videoback(call, 7);
    }

    /**向服务器获取金币数据 */
    sendMessCoin() {
        var self = this;
        var funSuc = function (ret) {
            self.video_coin = new BigVal(ret.num);
            self.LabGetCoins.string = "+" + self.video_coin.geteveryStr();
        }
        var funErr = function (ret) {
            self.video_coin = new BigVal("1000");
            self.LabGetCoins.string = "+" + self.video_coin.geteveryStr();
        }
        let params = {}
        try {
            cfgManager.ins().http.sendRequest('/api/game/get_last_gold', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    _hide() {
        this.BtnWatchVideo.off("click", this.btnWatch, this);
        this.BtnJuan.off("click", this.User_yaoqingjuan, this);
    }

}
