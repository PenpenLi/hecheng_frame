import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/base/gameConfigs";
import AdaptationManager, { AdaptationType } from "../common/ui/AdaptationManager";
import uiType from "../common/ui/uitype";
import userData from "../data/userData";
import { Game } from "../game/Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgShopMall extends baseUi {
    /** 金币总数*/
    @property(cc.Label)
    LabCoinOfTotal: cc.Label = null;
    /** 克隆的父级*/
    @property(cc.ScrollView)
    srollView: cc.ScrollView = null;
    /** 商店的框*/
    @property(cc.Prefab)
    perfapShopitem: cc.Prefab = null;

    /**自己界面 */
    content: cc.Node = null;


    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner, widdleType.long);

    onLoad() {
        this.schedule(function () {
            this.LabCoinOfTotal.string = userData.ins().TotalCoins.geteveryStr();
        }, 1);
        this.content = this.srollView.content;
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.topandBottom, this.node, 150);
    }

    _open() {
        this.LabCoinOfTotal.string = userData.ins().TotalCoins.geteveryStr();
        this.sengMessShop();
    }



    /**克隆完商城界面 */
    initClonse(shoplist) {
        var shop_count = shoplist.length;
        let frist_0 = (shoplist) => {
            for (let i = 0; i < shop_count; i++) {
                let shopMallItem = cc.instantiate(this.perfapShopitem);
                shopMallItem.getComponent("ShopItem").initOfThing(shoplist[i]);
                this.content.addChild(shopMallItem);
            }
        };
        let frist_1 = (shoplist) => {
            for (let j = 0; j < shop_count; j++) {
                this.content.children[j].getComponent("ShopItem").initOfThing(shoplist[j]);
            }
        };
        if (this.content.childrenCount == 0) {
            frist_0(shoplist);
        } else {
            frist_1(shoplist);
            console.log("第二次");
        }
    }

    /**向服务器获取数据 */
    sengMessShop() {
        var self = this;
        var funSuc = function (ret) {
            if (ret.code == 0) {
                self.initClonse(ret.data);
            }
        }
        var funErr = function (ret) {
            console.log("加载失败", JSON.stringify(ret));
        }
        let params = {}
        try {
            Game.HttpManager.sendRequest('/api/game/shops', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    // update (dt) {}
}
