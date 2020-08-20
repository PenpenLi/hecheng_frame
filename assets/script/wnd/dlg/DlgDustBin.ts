import baseUi from "../../frameWork/ui/baseUi"
import { uiFormType, uiFormPath, musicPath } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import BigVal from "../../common/bigval/BigVal";
import pictureManager from "../../game/pictureManager"
import musicManager from "../../frameWork/music/musicManager";
import blockitem from "../../perfab/blockitem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgDusBin extends baseUi {

    @property(cc.Label)
    CostOfMoney: cc.Label = null;

    /**取消Button */
    @property(cc.Button)
    BtnCancel: cc.Button = null;
    /**确定Button */
    @property(cc.Button)
    BtnMakeSure: cc.Button = null;

    /**承接变量（鸟） */
    private birds: cc.Node = null;

    /**是否确认回收 */
    isSureLost: boolean = false;

    formType = new uiType(uiFormType.PopUp)
    _open(...param: any) {
        this.BtnCancel.node.on("click", this.BtnClose, this);
        this.BtnMakeSure.node.on("click", this.BtnsureLost, this);
        this.showOfMessage(param[0][0], param[0][1])
    }

    /**展现自身的信息 */
    showOfMessage(CostOfMoney: BigVal, bird: cc.Node) {
        this.birds = bird; //标记了是那个鸟
        this.CostOfMoney.string = '+' + CostOfMoney.geteveryStr();
    }
    // hide() {
    //     console.log("我是设置里面的hide")
    // }

    /**不回收鸟 */
    BtnClose() {
        super._close();
    }

    /**确定回收鸟 */
    BtnsureLost() {
        this.isSureLost = true;
        super._close();
        pictureManager.getIns().playAnim();
        musicManager.ins().playEffectMusic(musicPath.addcoinclip)
        this.birds.getComponent(blockitem).BtnRecovery()
    }

    //重写父类的关闭方法
    _hide() {
        console.log("重写")
        this.BtnCancel.node.off("click", this.BtnClose, this);
        this.BtnMakeSure.node.off("click", this.BtnsureLost, this);
        if (!this.isSureLost) {
            this.birds.getComponent(blockitem).BtnNotRecovery();
        }
    }


    /** */
    // update (dt) {}
}
