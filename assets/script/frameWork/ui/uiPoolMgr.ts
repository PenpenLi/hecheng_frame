import SingletonClass from "../base/SingletonClass"
import { loaderMgr } from "../load/loaderMgr"
import uiPool from "./uiPool"

export class uiPoolMgr extends SingletonClass {
    private uiPool: uiPool;

    //实例化时constructor会自动调用 
    private constructor() {
        super();
        this.uiPool = new uiPool();
    }

    public static ins() {
        return super.ins() as uiPoolMgr;
    }

    public async get_ui(path: string) {
        let ui: cc.Node = this.uiPool.get(path);
        if (ui) {
            console.warn("再缓存中")
            return ui;
        }
        let ui_load: any = await loaderMgr.ins().loadAsset(path, cc.Prefab);
        let node1_1: cc.Node = cc.instantiate(ui_load);
        return node1_1;
    }

    put_ui(path: string, ui: cc.Node): void {
        if (!ui) {
            cc.warn("pool_mgr:put_ui, invalid node");
            return;
        }
        this.uiPool.put(path, ui);
    }
}
