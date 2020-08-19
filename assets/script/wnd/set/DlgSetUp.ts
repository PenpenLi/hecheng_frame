import baseUi from "../../frameWork/ui/baseUi"
import { uiFormType, uiFormPath, isUseBanner, widdleType } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import { G_baseData } from "../../data/baseData";
import musicManager from "../../frameWork/music/musicManager"
import { Game } from "../../game/Game";
import { Global_Var } from "../../common/globalVar/GlobalVar";
const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {
    /**按钮图片 */
    @property(cc.SpriteFrame)
    setUPtuji: cc.SpriteFrame[] = [];

    /**按钮 */
    @property(cc.Button)
    btnCloup: cc.Button[] = [];

    formType = new uiType(uiFormType.PopUp, isUseBanner.openBanner, widdleType.short)
    _open() {
        var num1 = G_baseData.userData.isBool[0];
        this.btnCloup[0].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[num1];
        var num2 = G_baseData.userData.isBool[1];
        this.btnCloup[1].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[num2];
        var num3 = G_baseData.userData.isBool[2];
        this.btnCloup[2].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[num3];

        this.btnCloup[0].node.on("click", this.onClickoffLine, this);
        this.btnCloup[1].node.on("click", this.onClickTlbc, this);
        this.btnCloup[2].node.on("click", this.onClickMusicClip, this);
        this.btnCloup[3].node.on("click", this.howbinaccount, this);
    }
    /**离线通知 */
    onClickoffLine() {
        var num1 = G_baseData.userData.isBool[0];
        if (num1 == 0) {
            G_baseData.userData.isBool[0] = 1;
            this.btnCloup[0].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[1];

        } else if (num1 == 1) {
            G_baseData.userData.isBool[0] = 0;
            this.btnCloup[0].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[0];
        }
    }
    /**Tlbc通知 */
    onClickTlbc() {
        var num1 = G_baseData.userData.isBool[1];
        if (num1 == 0) {
            G_baseData.userData.isBool[1] = 1;
            this.btnCloup[1].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[1];

        } else if (num1 == 1) {
            G_baseData.userData.isBool[1] = 0;
            this.btnCloup[1].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[0];
        }
    }
    /**音效 */
    onClickMusicClip() {
        var num1 = G_baseData.userData.isBool[2];
        if (num1 == 0) {
            musicManager.ins().setmusicVolume(false);
            G_baseData.userData.isBool[2] = 1;
            this.btnCloup[2].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[1];

        } else if (num1 == 1) {
            musicManager.ins().setmusicVolume(true);
            G_baseData.userData.isBool[2] = 0;
            this.btnCloup[2].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[0];
        }
    }
    /**如何绑定账号 */
    howbinaccount() {
        super._close();
        Game.ApiManager.btnHowbinaccount();
    }

    _hide() {
        this.btnCloup[0].node.off("click", this.onClickoffLine, this);
        this.btnCloup[1].node.off("click", this.onClickTlbc, this);
        this.btnCloup[2].node.off("click", this.onClickMusicClip, this);
        this.btnCloup[3].node.off("click", this.howbinaccount, this);
        this.saneSetUpConfig();
    }

    /**保存游戏设置到本地 */
    saneSetUpConfig() {
        var setupNum = Global_Var.getStrFromArray(G_baseData.userData.isBool);
        Global_Var.setStorage('setup', JSON.stringify(setupNum));
    }

    // update (dt) {}
}
