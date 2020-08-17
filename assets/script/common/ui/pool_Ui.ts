import SingletonClass from "../base/SingletonClass"
import { loader_mgr } from "../load/loader_mgr"
import ui_pool from "./ui_Pool"

export class pool_Ui extends SingletonClass {
    private ui_pool: ui_pool;

    //实例化时constructor会自动调用 
    private constructor() {
        super();
        this.ui_pool = new ui_pool();
    }


    public static ins() {
        return super.ins() as pool_Ui;
    }

    public async get_ui(path: string) {
        let ui: cc.Node = this.ui_pool.get(path);
        if (ui) {
            console.warn("再缓存中")
            return ui;
        }
        let ui_load: any = await loader_mgr.ins().loadAsset(path, cc.Prefab);
        let node1_1: cc.Node = cc.instantiate(ui_load);
        return node1_1;
    }



    put_ui(path: string, ui: cc.Node): void {
        if (!ui) {
            cc.warn("pool_mgr:put_ui, invalid node");
            return;
        }
        this.ui_pool.put(path, ui);
    }
}
