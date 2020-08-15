import { uiFormType, isUseBananer, widdleType } from "../base/gameConfigs";

export default class uiType {
    /**UI窗体（位置）类型*/
    public UIForm_Type = uiFormType.Normal;
    /**是否调用bananer广告 */
    public isopenbanner = isUseBananer.none;
    /**弹框大小 */
    public kuang_sizetype = widdleType.none;

    constructor(formtype?: uiFormType, isopen?: isUseBananer, sizetype?: widdleType) {
        this.UIForm_Type = formtype || this.UIForm_Type;
        this.isopenbanner = isopen || this.isopenbanner;
        this.kuang_sizetype = sizetype || this.kuang_sizetype;
    }

}