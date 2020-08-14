import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import cfgManager from "../game/CfgManager";
import dataManager from "../game/dataManager";
import BigVal from "../common/bigval/BigVal"

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


    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner)
    // onLoad () {}
    _open() {
        this.Btnlookvideo.on("click", this.BtnWatchVideo, this);
        this.BtnUserQuan.on("click", this.Btnuserquano, this);
        this.Btnsure.on("click", this.btnSure, this);
        this.initOffLineCoin();
    }

    /**初始化值 */
    initOffLineCoin() {
        let price = dataManager.ins().offLineCoin;
        this.labOffLineCoin.string = "+" + price.geteveryStr();

        //无限视频
        this.Btnlookvideo.active = true;
        this.BtnUserQuan.active = false;
        this.Btnlookvideo.getChildByName("cishu").getComponent(cc.Label).string = dataManager.ins().strOfLookVideo();

        // if (dataManager.ins().NumberOfVideosLeft > 0) { //剩余视频次数
        //     this.Btnlookvideo.active = true;
        //     this.BtnUserQuan.active = false;
        //     this.Btnlookvideo.getChildByName("cishu").getComponent(cc.Label).string = dataManager.ins().strOfLookVideo();
        // } else {
        //     this.Btnlookvideo.active = false;
        //     this.BtnUserQuan.active = true;
        // }
    }

    /**关闭按钮 */
    btnClose() {
        super._close();
    }

    /**确定按钮 */
    btnSure() {
        this.btnClose();
        let price = dataManager.ins().offLineCoin;
        dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, price); //把金币加上
        cfgManager.ins().Tops.initCoinOfTotal(); //显示金币总数
    }

    /**观看视频 */
    BtnWatchVideo() {
        if (dataManager.ins().resttime_video > 0) {
            var str = dataManager.ins().strTimeOfVideo();
            cfgManager.ins().gameManager.gameTips(str)
            return;
        }
        this.btnClose();
        let price_v = BigVal.Mul(dataManager.ins().offLineCoin, new BigVal("2"));
        cfgManager.ins().videocallback = "offlineCoin";
        cfgManager.ins().videoCallvalue = price_v.Num;
        cfgManager.ins().LOOK_VIDEO_GAME();
    }

    /**使用邀请券 */
    Btnuserquano() {
        this.btnClose();
        if (dataManager.ins().inviteJuan <= 0) {
            cfgManager.ins().gameManager.gameTips("邀请券不足");
            return;
        }
        if (dataManager.ins().restOfJuan <= 0) {
            cfgManager.ins().gameManager.gameTips("当日使用邀请券达到上限");
            return;
        }
        var call = function () {
            let price_q = BigVal.Mul(dataManager.ins().offLineCoin, new BigVal("2"));
            dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, price_q); //把金币加上
            cfgManager.ins().Tops.initCoinOfTotal(); //显示金币总数
            cfgManager.ins().showFrameBack(3, price_q); //显示奖励的弹框
        };
        cfgManager.ins().gameManager.sendMes_videoback(call, 7);
    }

    _hide() {
        this.Btnlookvideo.off("click", this.BtnWatchVideo, this);
        this.BtnUserQuan.off("click", this.Btnuserquano, this);
        this.Btnsure.off("click", this.btnSure, this);
    }

}
