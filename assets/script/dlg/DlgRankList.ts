import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, isUseBananer, widdleType } from "../common/base/gameConfigs";
import AdaptationManager, { AdaptationType } from "../common/ui/AdaptationManager";
import uiType from "../common/ui/uitype";
import { Game } from "../game/Game";
import { uiManager } from "../common/ui/uiManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlfRankList extends baseUi {

    /**滑动框； */
    @property(cc.ScrollView)
    scrolllview: cc.ScrollView = null;

    /**框的预制体 */
    @property(cc.Prefab)
    prefabRankItem: cc.Prefab = null;

    /**分享按钮 */
    @property(cc.Node)
    btnShare: cc.Node = null;

    /**排行榜的列表 */
    list_paihang: [];

    /**弹框的父级 */
    content: cc.Node = null;


    formType = new uiType(uiFormType.PopUp, isUseBananer.openbanner, widdleType.long);

    onLoad() {
        this.content = this.scrolllview.content;
        AdaptationManager.GetInstance().adaptationFormByType(AdaptationType.topandBottom, this.node, 150);
    }

    _open() {
        this.btnShare.on("click", this.btnShareFriend, this);
        this.initPaiHang();
    }

    /**从初始化排行榜数据 */
    initPaiHang() {
        uiManager.ins().waiting.showtips();
        this.sendMessage();
    }


    /**向服务器请求数据 */
    sendMessage() {
        var self = this;
        var funSuc = function (ret) {
            uiManager.ins().waiting.hidetips();
            if (ret.code == 0) {
                let data = ret.data;
                self.list_paihang = data.list;
                self.populateList();
            }

        }
        var funErr = function (ret) {
            console.log("获取失败");
        }
        let params = {}
        try {
            Game.HttpManager.sendRequest('/api/game/rankList', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }


    /**初始化列表 */
    populateList() {
        let obj = this.list_paihang;
        let frist_0 = (obj) => {
            for (let i = 0, long = obj.length; i < long; i++) {
                var kuang = cc.instantiate(this.prefabRankItem);
                kuang.getComponent("rankListItem").init(i, obj[i]);
                this.content.addChild(kuang);
            }
        }
        let frist_1 = (obj) => {
            for (let i = 0, long = obj.length; i < long; i++) {
                this.content.children[i].getComponent("rankListItem").init(i, obj[i]);
            }
        }
        if (this.content.childrenCount == 0) {
            frist_0(obj);
        } else {
            frist_1(obj);
            console.log("第二次加载");
        }
    }

    _hide() {
        this.btnShare.off("click", this.btnShareFriend, this);
    }

    /**分享好友 */
    btnShareFriend() {
        super._close();
        Game.ApiManager.sendShareFriend();
    }

    // update (dt) {}
}
