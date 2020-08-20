import baseUi from "../../frameWork/ui/baseUi"
import { UI_CONFIG_NAME, uiFormType, uiFormPath, isUseBanner, widdleType } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import { G_baseData } from "../../data/baseData";
import { uiManager } from "../../frameWork/ui/uiManager";
import { Game } from "../../game/Game";
import { EventDispatch, Event_Name } from "../../frameWork/event/EventDispatch";
const { ccclass, property } = cc._decorator;

@ccclass
export default class dlgZhuanPan extends baseUi {
    /**显示转盘剩余次数的文本框 */
    @property(cc.Label)
    LabZpOfNum: cc.Label = null;
    /**圆盘 */
    @property(cc.Node)
    diskOfPan: cc.Node = null;
    /**开始按钮 */
    @property(cc.Button)
    clickBtnStart: cc.Button = null;
    /**增加转盘卷按钮 */
    @property(cc.Button)
    btnAddquan: cc.Button = null;

    /**轮盘是否开始转动*/
    isRolling: boolean = false;

    formType = new uiType(uiFormType.PopUp, isUseBanner.openBanner, widdleType.long)

    onLoad() {
        EventDispatch.ins().add(Event_Name.TurnTable_AddZhuanPanQuan, this.watchVideoCb, this)
    }

    onDestroy() {
        EventDispatch.ins().remove(Event_Name.TurnTable_AddZhuanPanQuan, this.watchVideoCb)
    }

    _open() {
        this.clickBtnStart.node.on("click", this.BtnStart, this);
        this.btnAddquan.node.on("click", this.showZpTips, this);
    }


    // LIFE-CYCLE CALLBACKS:
    start() {
        if (G_baseData.userData.NumOfTurntables < 0) {
            G_baseData.userData.NumOfTurntables = 0;
        }
        this.LabZpOfNum.string = G_baseData.userData.NumOfTurntables.toString();
        this.isRolling = false;
    }

    /**开始转盘的逻辑 */
    BtnStart() {
        var ResidueOfnum = G_baseData.userData.NumOfTurntables; //剩余次数
        if (ResidueOfnum <= 0) {
            Game.gameManager.gameTips("转盘券数量不足");
            this.clickBtnStart.interactable = false;
            return;
        }
        this.sendMessageZP(); //发消息
    }

    GoldMsg = null;

    /**网络接口获取奖励的类型 */
    sendMessageZP() {
        var self = this;
        var funSuc = (ret) => {
            if (ret.code == 0) {
                Game.Console.Log('转盘回调', ret);
                let data = ret.data;
                this.GoldMsg = {
                    gold: data.gold,
                    update_time: data.update_time
                }
                self.isRolling = true;
                self.clickBtnStart.interactable = false;
                G_baseData.userData.NumOfTurntables = data.ticket;
                self.LabZpOfNum.string = G_baseData.userData.NumOfTurntables.toString();
                //num值从服务器获取
                let rewardnum = data.num;

                self.RotaOfStart(data.id, rewardnum);
            }
        }
        var funErr = function (ret) {
            var string_0 = "请勿重复点击";
            Game.gameManager.gameTips(string_0);
        }
        let params = {};
        try {
            Game.HttpManager.sendRequest('/api/game/turntable', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }

    }

    /**转盘开始转动时的逻辑 */
    RotaOfStart(indexOfNum: number, rewardnum) {
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
            this.clickBtnStart.interactable = true;
            this.diskOfPan.angle = -(Math.abs(this.diskOfPan.angle) % 360);
            this.showOfReward(indexOfNum, rewardnum);
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
    showOfReward(indexOfNum, rewardnum) {
        this.isRolling = false;
        if (this.GoldMsg.gold != 0) {
            G_baseData.userData.RefreshGold(this.GoldMsg.gold, this.GoldMsg.update_time);
        }
        this.GoldMsg = null;
        //参数0打开第一种
        uiManager.ins().show(UI_CONFIG_NAME.DlgFrame, 0, indexOfNum, rewardnum);
    }

    /**显示增加次数的弹框 */
    showZpTips() {
        uiManager.ins().show(UI_CONFIG_NAME.DlgZpTips);
    }

    /**看视频回调奖励 */
    watchVideoCb() {
        this.clickBtnStart.getComponent(cc.Button).interactable = true;
        this.LabZpOfNum.string = G_baseData.userData.NumOfTurntables.toString();
    }

    _hide() {
        this.clickBtnStart.node.off("click", this.BtnStart, this);
        this.btnAddquan.node.off("click", this.showZpTips, this);
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
