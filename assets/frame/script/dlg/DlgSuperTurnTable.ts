import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager";
import { uiManager } from "../common/ui/uiManager";
import { UI_CONFIG_NAME } from "../common/config/gameConfigs"
import baseHandle from "../common/massage/baseHandle";
import { I_Send_UseSuperTurnTable } from "../common/massage/msgId";
const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {

    /**圆盘 */
    @property(cc.Node)
    diskOfPan: cc.Node = null;

    /**开始按钮 */
    @property(cc.Button)
    clickBtnStart: cc.Button = null;

    /**轮盘是否开始转动*/
    isRolling: boolean = false;
    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner, widdleType.long)

    _open() {
        this.clickBtnStart.node.on("click", this.BtnStart, this);
    }

    // LIFE-CYCLE CALLBACKS:
    start() {
        this.isRolling = false;
        this.showView();
    }

    showView() {
        let awards = dataManager.ins().superTurnTableAwards;
        let children = this.diskOfPan.children;
        for (let i = 0; i < children.length; i++) {
            let parent = children[i];
            let label = cc.find("Label", parent).getComponent(cc.Label);
            label.string = "MBC" + awards[i].money;
        }
    }

    /***
     * 转盘逻辑
     * 1.判断拥有的MBC是否>=10MBC，不足，直接返回
     * 2.MBC充足，看视频
     * 3.看完视频直接转动转盘进行抽奖
     */
    /**开始转盘的逻辑 */
    BtnStart() {
        var mbc = dataManager.ins().FHBC; //剩余次数
        if (mbc < 10) {
            cfgManager.ins().gameManager.gameTips("MBC数量小于10");
            return;
        }
        this.WatchOfVideo();
        // this.videoCallback(); //游戏端测试用（不经过视频直接回调）
    }

    /**观看视频点击观看*/
    WatchOfVideo() {
        if (dataManager.ins().resttime_video > 0) { //观看视频的时间限制（15秒）
            var str = dataManager.ins().strTimeOfVideo();
            cfgManager.ins().gameManager.gameTips(str);
            return;
        }
        cfgManager.ins().videocallback = "superTurnTable";
        cfgManager.ins().videoCallvalue = 1;
        cfgManager.ins().LOOK_VIDEO_GAME();
    }

    /**看视频回调奖励 */
    videoCallback() {
        console.log("看视频回调")
        let video_type = dataManager.ins().video_type;
        this.stopButton(true);
        this.sendVideoRecord(video_type);
    }

    sendVideoRecord(video_type) {
        let self = this;
        let suc = (msg) => {
            self.sendUseTurnTable(video_type);
        }

        let fail = () => {
            self.stopButton(false);
            var string_0 = "观看广告上报失败";
            cfgManager.ins().gameManager.gameTips(string_0);
        }
        baseHandle.ins()._mainHandle.sendWatchVideoRecode("super_turnplate", video_type, suc, fail)
    }

    /**向服务器请求获取奖励*/
    sendUseTurnTable(video_type) {
        var self = this;
        var funSuc = function (ret) {
            let awardNum = dataManager.ins().superTurnTableAwards[ret.id - 1].money;

            dataManager.ins().useSuperTurnTable();    //要扣掉10MBC
            cfgManager.ins().Tops.initFHBC();
            self.RotaOfStart(ret.id, awardNum);
        }
        var funErr = function (ret) {
            self.stopButton(false);
            var string_0 = "请勿重复点击";
            cfgManager.ins().gameManager.gameTips(string_0);
        }
        let params: I_Send_UseSuperTurnTable = {
            ad_type: video_type,
        };
        try {
            // cfgManager.ins().http.sendRequest('/api/game/turntable', params, funSuc, funErr);
            baseHandle.ins()._superTurnTableHandle.sendUseSuperTurnTable(params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    /**转盘开始转动时的逻辑 */
    RotaOfStart(indexOfNum: number, rewardNum) {
        var rollTime = 5,
            rounds = 8,
            anardAngle = 0;
        var awardAngle01 = anardAngle,
            awardAngle02 = anardAngle + 45,
            awardAngle03 = anardAngle + 90,
            awardAngle04 = anardAngle + 135,
            awardAngle05 = anardAngle + 180,
            awardAngle06 = anardAngle + 225,
            awardAngle07 = anardAngle + 270,
            awardAngle08 = anardAngle + 315;
        //开启一个计时器，用来标识结果弹出内容的
        this.scheduleOnce(function () {
            // this.clickBtnStart.interactable = true;
            this.diskOfPan.angle = -(Math.abs(this.diskOfPan.angle) % 360);
            this.showOfReward(rewardNum);
        }, rollTime + 0.3);

        let zhuan = (angleadd: number) => {
            cc.tween(this.diskOfPan)
                .to(rollTime, { angle: -angleadd }, { easing: "quadInOut" })
                .start();
        }
        switch (indexOfNum) {
            case 1:
                zhuan(rounds * 360 + awardAngle01);
                break;
            case 2:
                zhuan(rounds * 360 + awardAngle02);
                break;
            case 3:
                zhuan(rounds * 360 + awardAngle03);
                break;
            case 4:
                zhuan(rounds * 360 + awardAngle04);
                break;
            case 5:
                zhuan(rounds * 360 + awardAngle05);
                break;
            case 6:
                zhuan(rounds * 360 + awardAngle06);
                break;
            case 7:
                zhuan(rounds * 360 + awardAngle07);
                break;
            case 8:
                zhuan(rounds * 360 + awardAngle08);
                break;
        }
    }

    /**显示奖励的弹框 */
    showOfReward(rewardNum) {
        this.stopButton(false);
        uiManager.ins().show(UI_CONFIG_NAME.DlgFrame, -1, rewardNum);
    }

    _hide() {
        this.clickBtnStart.node.off("click", this.BtnStart, this);
    }

    stopButton(stop) {
        this.clickBtnStart.interactable = !stop;
    }

    /**关闭按钮 */
    _close() {
        if (this.isRolling) {
            console.log("页面开始转动")
            return;
        }
        super._close();
    }
}
