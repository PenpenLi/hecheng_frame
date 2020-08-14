import { uiFormType, isUseBananer, widdleType } from "../config/gameConfigs";
import AdaptationManager, { AdaptationType } from "./AdaptationManager";
import uiType from "./uitype";
import { uiManager } from "./uiManager";
import cfgManager from "../../game/CfgManager";
import dataManager from "../../game/dataManager"

const { ccclass, property } = cc._decorator;

const pop_overlay_bg: string = "panel_overlay_bg";
@ccclass
export default class baseUi extends cc.Component {
    @property(cc.Button)
    btn_close: cc.Button = null;

    public _ui_name: string;
    /**弹框类型 */
    public formType = new uiType();
    private overlay: cc.Node = null;

    /**打开是触发 */
    open(param: any) {
        //固定弹框不需要关闭
        if (this.formType.UIForm_Type !== uiFormType.Fixed) {
            if (this.btn_close) {
                this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtnTouch, this);
            }
            //添加遮罩
            this.overlay = this.node.parent.getChildByName(pop_overlay_bg);
            this.overlay.active = true;
        }
        this.addListenguanGao();
        this._open(param);
    }

    /**判断加入 */


    _open(param: any) {

    }
    // onLoad () {}

    /**关闭是触发 */
    hide() {
        // cc.log("hide", this._ui_name);
        if (this.btn_close) {
            this.btn_close.node.off(cc.Node.EventType.TOUCH_END, this.onCloseBtnTouch, this);
        }
        this.overlay.active = false;
        this.closeListeguangGao();
        this._hide();
    }

    _hide() {
    }



    start() {

    }

    /**关闭按钮 */
    _close() {
        uiManager.ins().hide(this._ui_name);
    }


    onCloseBtnTouch(): void {
        this._close();
    }

    /**弹出广告 */
    addListenguanGao() {
        var calls = (type: number) => {
            //适配弹框大小位置
            if (type === 0) {//banner
                AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.Bottom, this.node, 300);
                this.node.setScale(cc.v2(1, 1));
            } else if (type === 1) {//原生+banner
                AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.Bottom, this.node, 550);
                this.node.setScale(cc.v2(dataManager.ins().scaleBlock, dataManager.ins().scaleBlock));
            }
        }
        if (this.formType.isopenbanner === isUseBananer.openbanner) {
            if (this.formType.kuang_sizetype === widdleType.long) {//只打开banner广告
                cfgManager.ins().openBannerAD();
            } else if (this.formType.kuang_sizetype === widdleType.short) {//原生广告
                cfgManager.ins().showNativeAD(calls);
            }
        }
    }

    /**关闭广告逻辑*/
    closeListeguangGao() {
        if (this.formType.isopenbanner === isUseBananer.openbanner) {
            if (this.formType.kuang_sizetype === widdleType.long) {//只打开banner广告
                cfgManager.ins().hideBannerAD();
            } else if (this.formType.kuang_sizetype === widdleType.short) {//原生广告
                cfgManager.ins().hideNativeAD();
            }
        }
    }
}
