import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import dataManager from "../game/dataManager";
import musicManager from "../common/music/musicManager"
const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {
    /**按钮图片 */
    @property(cc.SpriteFrame)
    setUPtuji: cc.SpriteFrame[] = [];

    /**按钮 */
    @property(cc.Button)
    btnCloup: cc.Button[] = [];

    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner, widdleType.short)
    _open() {
        var num1 = dataManager.ins().isBool[0];
        this.btnCloup[0].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[num1];
        var num2 = dataManager.ins().isBool[1];
        this.btnCloup[1].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[num2];
        var num3 = dataManager.ins().isBool[2];
        this.btnCloup[2].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[num3];

        this.btnCloup[0].node.on("click", this.onClickoffLine, this);
        this.btnCloup[1].node.on("click", this.onClickTlbc, this);
        this.btnCloup[2].node.on("click", this.onClickMusicClip, this);
        this.btnCloup[3].node.on("click", this.howbinaccount, this);
    }
    /**离线通知 */
    onClickoffLine() {
        var num1 = dataManager.ins().isBool[0];
        if (num1 == 0) {
            dataManager.ins().isBool[0] = 1;
            this.btnCloup[0].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[1];

        } else if (num1 == 1) {
            dataManager.ins().isBool[0] = 0;
            this.btnCloup[0].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[0];
        }
    }
    /**Tlbc通知 */
    onClickTlbc() {
        var num1 = dataManager.ins().isBool[1];
        if (num1 == 0) {
            dataManager.ins().isBool[1] = 1;
            this.btnCloup[1].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[1];

        } else if (num1 == 1) {
            dataManager.ins().isBool[1] = 0;
            this.btnCloup[1].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[0];
        }
    }
    /**音效 */
    onClickMusicClip() {
        var num1 = dataManager.ins().isBool[2];
        if (num1 == 0) {
            musicManager.ins().setmusicVolume(false);
            dataManager.ins().isBool[2] = 1;
            this.btnCloup[2].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[1];

        } else if (num1 == 1) {
            musicManager.ins().setmusicVolume(true);
            dataManager.ins().isBool[2] = 0;
            this.btnCloup[2].getComponent(cc.Sprite).spriteFrame = this.setUPtuji[0];
        }
    }
    /**如何绑定账号 */
    howbinaccount() {
        super._close();
        // cc.sys.openURL('fenghuangguoduscheme://?type=focusWeiXinMark');
        try {
            api.sendEvent({
                name: 'gameEvent',
                extra: {
                    type: 'focusWeiXinMark'
                } //打开视频
            });
        } catch (e) {
            console.log(e);
        }
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
        var setupNum = dataManager.ins().getStrFromArray(dataManager.ins().isBool);
        cc.sys.localStorage.setItem('setup', JSON.stringify(setupNum));
    }

    // update (dt) {}
}
