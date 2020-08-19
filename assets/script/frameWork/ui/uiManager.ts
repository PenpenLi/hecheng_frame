import SingletonClass from "../base/SingletonClass"
import { uiPoolMgr } from "./uiPoolMgr"
import baseUi from "./baseUi"
import { uiFormPath, uiFormType } from "../../common/gameConfig/gameConfigs";
import WaitingConnection from "../../common/waiting/WaitingConnection";

export class uiManager extends SingletonClass {
    private ui_cache: any = {};           //path => pop_ui
    /**加载界面显示的框 */
    public waiting: WaitingConnection = null;

    // private ui_stack: Array<string>; //ui stacks
    public static ins() {
        return super.ins() as uiManager;
    }

    constructor() {
        super();
        this.waiting = cc.find("Canvas/Waiting").getComponent(WaitingConnection);
    }

    /**pop_ui是一个type类型 */
    private get_ui(path: string): pop_ui {
        let ui: pop_ui = this.ui_cache[path];
        if (!ui) {
            this.ui_cache[path] = ui = { node: null, is_show: false };
        }
        return ui;
    }

    /**显示一个 */
    public async show(path: string, ...param: any) {
        let ui: pop_ui = this.get_ui(path);
        if (ui.is_show) {//如果弹框已经打开直接返回
            cc.error("弹框已经打开", this.ui_cache)
            return;
        }
        this.waiting.showtips();
        ui.is_show = true;
        let node_0: cc.Node = await uiPoolMgr.ins().get_ui(path);
        node_0.active = true;
        ui.node = node_0;
        this.addnode(node_0, path, param);
    }

    hide(path: string) {
        let ui: pop_ui = this.ui_cache[path];
        if (!ui) {
            cc.warn("检查弹框是否一打开");
            return;
        }
        this.ui_cache[path] = null;
        ui.is_show = false;
        if (ui.node) {
            uiPoolMgr.ins().put_ui(path, ui.node);
            let ui_base = ui.node.getComponent(baseUi) as baseUi;
            ui_base._ui_name = path;
            // console.log("关闭" + ui_base._ui_name)
            ui_base.hide();
        }
    }

    /**添加节点到那 */
    private addnode(node: cc.Node, path: string, param: any) {
        let ui_base = node.getComponent(baseUi) as baseUi;
        ui_base._ui_name = path;
        switch (ui_base.formType.UIForm_Type) {
            case uiFormType.Normal:
                cc.find(uiFormPath.Normal).addChild(node);
                node.setPosition(cc.v2(0, 0));
                break;
            case uiFormType.Fixed:
                cc.find(uiFormPath.Fixed).addChild(node);
                node.setPosition(cc.v2(0, 0));
                break;
            case uiFormType.PopUp:
                cc.find(uiFormPath.PopUp).addChild(node);
                node.setPosition(cc.v2(0, 0));
                break;
            case uiFormType.PopUp1:
                cc.find(uiFormPath.PopUp1).addChild(node);
                node.setPosition(cc.v2(0, 0));
                break;
        }
        this.waiting.hidetips(false);
        ui_base.open(param);
    }
}


type pop_ui = {
    node: cc.Node;
    is_show: boolean;
}