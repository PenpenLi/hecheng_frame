import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import userData from "../data/userData";
import BigVal from "../common/bigval/BigVal"
import { Game } from "../game/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {
    @property(cc.Label)
    labCoins: cc.Label = null;

    @property(cc.Button)
    btnSure: cc.Button = null;

    formType = new uiType(uiFormType.PopUp)

    _open(res) {
        this.btnSure.node.on("click", this.btnClose, this);
        userData.ins().rest_time = 3600;
        Game.Tops.showCoinTips();
        this.labCoins.string = res;
        //this.sendMessRigthCoio();
    }

    // /**初始化值 */
    // initOFRigthCoin(price) {
    //     let _nowtime = parseInt((new Date().getTime() / 1000).toString());
    //     userData.ins().now_time = _nowtime;
    //     userData.ins().rec_time = _nowtime;
    //     userData.ins().LocolIndexTime = _nowtime;

    //     var coins = new BigVal(price);
    //     this.labCoins.string = "+" + coins.geteveryStr();
    // }

    // /**向服务器获取金币数据 */
    // sendMessRigthCoio() {
    //     var self = this;
    //     var funSuc = function (ret) {
    //         Game.Console.Log(ret)
    //         userData.ins().RefrushGold(ret.data.amount, ret.data.update_time);
    //         if (ret.code == 0) {
    //             self.initOFRigthCoin(ret.data.add_num);
    //         }
    //     }
    //     var funErr = function (ret) {
    //         console.log("读取失败");
    //         self.initOFRigthCoin("1000");
    //     }
    //     let params = {
    //         type: 1,
    //     }
    //     try {
    //         Game.HttpManager.sendRequest('/api/game/receiveGold', params, funSuc, funErr);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    /**关闭按钮 */
    btnClose() {
        this.btnSure.node.off("click", this.btnClose, this);
        Game.Tops.initCoinOfTotal();
        super._close();
    }
    // update (dt) {}
}
