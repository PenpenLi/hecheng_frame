import SingletonClass from "../common/base/SingletonClass"
import { loader_mgr } from "../common/load/loader_mgr";

export default class cfgManager extends SingletonClass {

    /** 名字的集合*/
    birdName: {} = null;


    public static ins() {
        return super.ins() as cfgManager;
    }

    /**加载数据表 */
    public async LogCfg() {
        this.birdName = await loader_mgr.ins().loadName("namejson/birdName");
    }

    /**鸟的名字 */
    getBirdName(id: number) {
        if (!this.birdName) {
            this.LogCfg();
            return "龙";
        }
        var birdName = this.birdName[id - 1].birdName;
        return birdName;
    }

    /**回收鸟的价格 */
    getBirdrecePrice(birdlv: number) {
        var price = this.birdName[birdlv - 1].recePrice;
        return price;
    }

    /**定位宠物的锚点 */
    initanchor_chongwu(chongwu: cc.Node, birdlv: number) {
        if (!this.birdName) {
            console.log("表加载失败");
            return;
        }
        chongwu.x = this.birdName[birdlv - 1].anchorChongwu.x;
        chongwu.y = this.birdName[birdlv - 1].anchorChongwu.y;
    }

}
