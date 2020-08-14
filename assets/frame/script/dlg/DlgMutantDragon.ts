import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/config/gameConfigs";
import AdaptationManager, { AdaptationType } from "../common/ui/AdaptationManager";
import uiType from "../common/ui/uitype";
import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager"
import { loader_mgr } from "../common/load/loader_mgr";

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


    allContent: cc.Node = null;
    myContent: cc.Node = null;
    overdueContent: cc.Node = null;

    /**自己界面 */
    content: cc.Node = null;


    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner, widdleType.long);

    onLoad() {
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.topandBottom, this.node, 150);
    }

    _open() {
        this.LabCoinOfTotal.string = dataManager.ins().TotalCoins.geteveryStr();
        this.sengMessShop();
    }


    public async showAllView() {
        let pfb = await loader_mgr.ins().loadAsset('', cc.Prefab) as cc.Prefab;
        this.initListView(this.allContent, pfb, "dlgMutantDragonAllItem", {});
    }

    public async showMyView() {
        let pfb = await loader_mgr.ins().loadAsset('', cc.Prefab) as cc.Prefab;
        this.initListView(this.myContent, pfb, "dlgMutantDragonMyItem", {});
    }

    public async showOverdueView() {
        let pfb = await loader_mgr.ins().loadAsset('', cc.Prefab) as cc.Prefab;
        this.initListView(this.overdueContent, pfb, "dlgMutantDragonOverdueItem", {});
    }

    //更新listView数据
    initListView(content, pfb, component, data) {
        let children = content.children;
        for (let index = 0; index < data.length; index++) {
            let info = data[index];
            let node = null;
            if (children.length > index) {
                node = children[index];
            } else {
                node = cc.instantiate(pfb);
            }
            node.parent = content;
            let ts = node.getComponent(component);
            ts.init(info);
        }
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
            self.initClonse(ret);
        }
        var funErr = function (ret) {
            console.log("加载失败", JSON.stringify(ret));
        }
        let params = {}
        try {
            cfgManager.ins().http.sendRequest('/api/game/shops', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    // update (dt) {}
}
