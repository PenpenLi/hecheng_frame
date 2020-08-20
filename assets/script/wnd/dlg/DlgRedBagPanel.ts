import baseUi from "../../frameWork/ui/baseUi";
import { uiFormType, uiFormPath, musicPath } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import AdaptationManager, { AdaptationType } from "../../frameWork/ui/AdaptationManager";
import { Game } from "../../game/Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgReaBagPanel extends baseUi {

    formType = new uiType(uiFormType.PopUp,)

    @property(cc.Button)
    btncloseHongBao: cc.Button = null;

    @property(cc.Button)
    btnOpenHongBao: cc.Button = null;

    /**红包*/
    redbag: cc.Node = null;

    /**奖励页面 */
    rewardPanel: cc.Node = null;

    /**奖励文字*/
    labreward: cc.Label = null;

    RedType

    /** 
     * 4 摇一摇
     * 5 红包龙
     * 6 情侣
     * 7 新手
     */
    _open(...param) {
        this.RedType = param[0];
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.topandBottom, this.node, 0);
        this.init();
        this.btncloseHongBao.node.on("click", this.closeHongBao, this);
        this.btnOpenHongBao.node.on("click", this.OpenHongBao, this);


    }

    init() {
        this.rewardPanel = this.node.getChildByName("rewardPanel");
        this.redbag = this.node.getChildByName("redbag");
        // this.redbag.getComponent(cc.Animation).play();
        this.rewardPanel.active = false;
        this.redbag.active = true;
    }

    closeHongBao() {
        if (!this.rewardPanel.active) {
            super._close();
        }
    }

    OpenHongBao() {
        this.rewardPanel.active = true;
        this.redbag.active = false;
        var funSuc = function (res) {
            Game.Console.Log(res);
            if (res.code == 0) {
                //红包后续处理方法写在这里
            }
            else {
                //红包有错误
            }
        }
        var funerr = function (res) {
            Game.gameManager.gameTips("点击太快了")
        }
        var param = {
            id: this.RedType.toString()
        }
        Game.HttpManager.sendRequest("/api/user/receiveRedPacket", param, funSuc, funerr)

    }

    _hide() {
        this.btncloseHongBao.node.off("click", this.closeHongBao, this);
        this.btnOpenHongBao.node.off("click", this.OpenHongBao, this);
    }


}