import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager";
import BigVal from "../common/bigval/BigVal"

const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {
    @property(cc.Label)
    labCoins: cc.Label = null;

    @property(cc.Button)
    btnSure: cc.Button = null;

    formType = new uiType(uiFormType.PopUp)

    _open() {
        this.btnSure.node.on("click", this.btnClose, this);
        dataManager.ins().rest_time = 3600;
        cfgManager.ins().Tops.showCoinTips();
        this.sendMessRigthCoio();
    }

    /**初始化值 */
    initOFRigthCoin(price) {
        var coins = new BigVal(price);
        this.labCoins.string = "+" + coins.geteveryStr();
        dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, coins); //把金币加上
    }

    /**向服务器获取金币数据 */
    sendMessRigthCoio() {
        var self = this;
        var funSuc = function (ret) {
            self.initOFRigthCoin(ret);
        }
        var funErr = function (ret) {
            console.log("读取失败");
            self.initOFRigthCoin("1000");
        }
        let params = {
            type: 1,
        }
        try {
            cfgManager.ins().http.sendRequest('/api/game/receiveGold', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    /**关闭按钮 */
    btnClose() {
        this.btnSure.node.off("click", this.btnClose, this);
        super._close();
    }
    // update (dt) {}
}
