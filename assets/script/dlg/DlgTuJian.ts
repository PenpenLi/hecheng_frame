import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/base/gameConfigs";
import AdaptationManager, { AdaptationType } from "../common/ui/AdaptationManager";
import uiType from "../common/ui/uitype";
import dataManager from "../game/dataManager";
import pictureManager from "../game/pictureManager"

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgTUjian extends baseUi {
    /**第一个滑动的龙 */
    @property(cc.Node)
    upDowmMessage: cc.Node = null;
    /**预制体 */
    @property(cc.Prefab)
    tuJianItem: cc.Prefab = null;
    /**预制体父节点 */
    @property(cc.Node)
    content: cc.Node = null;
    /**分红龙 */
    @property(cc.Sprite)
    fenhongNode: cc.Sprite = null;

    //图集
    @property(cc.SpriteFrame)
    tuji: cc.SpriteFrame[] = [];

    /** 上*/
    @property(cc.Node)
    btnmoveUp: cc.Node = null;
    /** 下*/
    @property(cc.Node)
    btnmovedown: cc.Node = null;

    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner, widdleType.long)

    onLoad() {
        if (this.content.childrenCount <= 9) {
            for (let i = 1; i < 10; i++) {
                let item = cc.instantiate(this.tuJianItem);
                this.content.addChild(item);
            }
        }
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.topandBottom, this.node, 150);
    }


    _open() {
        this.btnmoveUp.on("click", this.Btnup, this);
        this.btnmovedown.on("click", this.BtnDown, this);

        this.upDowmMessage.x = 109;
        this.upDowmMessage.y = -150;
        this.initshuxin();
    }

    /**刷新 */
    initshuxin() {
        if (dataManager.ins().CheckItemSelf(47)) {
            this.fenhongNode.spriteFrame = pictureManager.getIns().birdTuji[46];
        } else {
            this.fenhongNode.spriteFrame = this.tuji[0];
        }
        for (let i = 1; i < 10; i++) {
            this.content.children[i].getComponent("tujianItem").init(i);
        }
    }
    /**往上划动 */
    Btnup() {
        console.log("向上划动");
        cc.tween(this.upDowmMessage)
            .to(0.5, { position: cc.v2(109, 150) })
            .start();
    }
    /**往下划动 */
    BtnDown() {
        cc.tween(this.upDowmMessage)
            .to(0.5, { position: cc.v2(109, -150) })
            .start();
    }

    _hide() {
        this.btnmoveUp.off("click", this.Btnup, this);
        this.btnmovedown.off("click", this.BtnDown, this);
    }


}
