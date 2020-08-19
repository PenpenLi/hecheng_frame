import { uiFormType, isUseBanner, widdleType } from "../../common/gameConfig/gameConfigs";

export default class uiType {
    /**UI窗体（位置）类型*/
    public UIForm_Type = uiFormType.Normal;
    /**是否调用bananer广告 */
    public isopenbanner = isUseBanner.none;
    /**弹框大小 */
    public kuang_sizetype = widdleType.none;

    constructor(formtype?: uiFormType, isopen?: isUseBanner, sizetype?: widdleType) {
        this.UIForm_Type = formtype || this.UIForm_Type;
        this.isopenbanner = isopen || this.isopenbanner;
        this.kuang_sizetype = sizetype || this.kuang_sizetype;
    }

}