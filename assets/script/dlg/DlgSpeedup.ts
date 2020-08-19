import baseUi from "../frameWork/ui/baseUi"
import { uiFormType, uiFormPath, isUseBanner, widdleType } from "../common/gameConfig/gameConfigs";
import uiType from "../frameWork/ui/uitype";
import { G_baseData } from "../data/baseData";
import { Game } from "../game/Game";
import websocketHandler from "../net/websocketHandler";


/**花费钻石数量*/
const reduceOfjewel: number = 60;
/**钻石的时间*/
const jewelOfTime: number = 60;
//视频的时间
const VideosOfTime: number = 200;

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgSpeed extends baseUi {

    @property(cc.Node)
    BtnFhbc: cc.Node = null; //观看fhbc的按钮

    @property(cc.Node)
    BtnwatchVideo: cc.Node = null; //观看视频的按钮
    @property(cc.Node)
    btnUserQuan: cc.Node = null; //使用券观看视频

    formType = new uiType(uiFormType.PopUp, isUseBanner.openBanner, widdleType.short)

    _open() {
        this.BtnFhbc.on("click", this.BtnCostOfFHBC, this);
        this.BtnwatchVideo.on("click", this.BtnWatchVideo, this);
        this.btnUserQuan.on("click", this.CostYaoQingjuan, this);
        this.getBtnSpeed();
    }

    /**获得打开加速框的Button */
    getBtnSpeed() {
        if (G_baseData.userData.NumberOfVideosLeft > 0) {
            this.BtnwatchVideo.active = true;
            this.btnUserQuan.active = false;
            let node = this.BtnwatchVideo.getChildByName("tips");
            node.getComponent(cc.Label).string = G_baseData.userData.strOfLookVideo();
        } else {
            this.btnUserQuan.active = true;
            this.BtnwatchVideo.active = false;
        }
    }

    /**关闭按钮 */
    BtnClose() {
        super._close();
    }

    /**FHBC加速按钮,花费金币的按钮 */
    BtnCostOfFHBC() {
        //补写花费的逻辑
        this.BtnClose();
        if (G_baseData.userData.FHBC > reduceOfjewel) {
            this.sendMessSpeed();
        } else {
            Game.gameManager.gameTips("MBC余额不足");
        }
    }

    /**给网络发送信息花费FHBC */
    sendMessSpeed() {
        var funSuc = function (ret) {
            if (ret.code == 0) {
                G_baseData.userData.FHBC = G_baseData.userData.FHBC - reduceOfjewel; //成功减去FHBC数量
                Game.Tops.initFHBC(); //FHBC刷新
                Game.Bottom.speed_video_back(jewelOfTime)
                websocketHandler.ins().save_speedDouble(reduceOfjewel);
            }
        }
        var funErr = function (ret) {
            Game.gameManager.gameTips("加速失败");
        }
        let params = {}
        Game.HttpManager.sendRequest('/api/game/speed', params, funSuc, funErr);
    }

    /**视频加速功能 +或者thbc*/
    BtnWatchVideo() {
        if (G_baseData.userData.resttime_video > 0) {
            var str = G_baseData.userData.strTimeOfVideo();
            Game.gameManager.gameTips(str);
            return;
        }
        this.BtnClose();
        //调用看视频的接口
        Game.ApiManager.videocallback = "speed";
        Game.ApiManager.videoCallvalue = VideosOfTime;
        Game.ApiManager.LOOK_VIDEO_GAME("4");
    }

    /**花费邀请券 */
    CostYaoQingjuan() {
        this.BtnClose();
        if (G_baseData.userData.inviteJuan <= 0) {
            Game.gameManager.gameTips("邀请券数量不足");
            return;
        }
        if (G_baseData.userData.restOfJuan <= 0) {
            Game.gameManager.gameTips("当日使用邀请券达到上限");
            return;
        }
        var call = function () {
            Game.Bottom.speed_video_back(jewelOfTime)
        };
        Game.gameManager.sendMes_videoback(call, 8);
    }


    _hide() {
        this.BtnFhbc.off("click", this.BtnCostOfFHBC, this);
        this.BtnwatchVideo.off("click", this.BtnWatchVideo, this);
        this.btnUserQuan.off("click", this.CostYaoQingjuan, this);
    }
}
