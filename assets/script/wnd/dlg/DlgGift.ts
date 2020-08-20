import baseUi from "../../frameWork/ui/baseUi"
import { uiFormType, uiFormPath, isUseBanner, widdleType } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import { G_baseData } from "../../data/baseData";
import { Game } from "../../game/Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends baseUi {

    /** 当前剩余邀请券*/
    @property(cc.Label)
    inviteNum: cc.Label = null;
    @property(cc.Button)
    btnShare: cc.Button = null;


    formType = new uiType(uiFormType.PopUp, isUseBanner.openBanner, widdleType.short)


    _open() {
        this.btnShare.node.on("click", this.btnShareFriend, this);
        let str = `当前剩余(${G_baseData.userData.inviteJuan})张邀请券`;
        this.inviteNum.string = str;
    }

    /**分享好友 */
    btnShareFriend() {
        super._close();
        Game.ApiManager.sendShareFriend();
    }

    // update (dt) {}
}