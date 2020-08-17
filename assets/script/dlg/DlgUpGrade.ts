import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import pictureManager from "../game/pictureManager";
import { Game } from "../game/Game";
import { G_baseData } from "../data/baseData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {

    /**鸟的头像 */
    @property(cc.Sprite)
    sprBirdHead: cc.Sprite = null;
    /**鸟的名字 */
    @property(cc.Label)
    labBirdName: cc.Label = null;
    /**主题名字图片 */
    @property(cc.Sprite)
    labKuangName: cc.Sprite = null;
    /**图库 */
    @property(cc.SpriteFrame)
    tukU: cc.SpriteFrame[] = [];

    /**屠龙宝刀 */
    @property(cc.Node)
    tulong: cc.Node = null;

    /**分享按钮 */
    @property(cc.Node)
    btnShare: cc.Node = null;

    /**判断是否奖励的状态 */
    type_ku: number = 0;

    formType = new uiType(uiFormType.PopUp)

    _open(param) {
        pictureManager.getIns().guideFrist(); //新手指引
        this.btnShare.on("click", this.Btnxaunyao, this);
        console.log("param", param);
        if (!param) {
            console.error("缺少参数");
            return;
        }
        this.changeBirdImage(param[0], param[1]);
    }



    /**换图片的方法 */
    changeBirdImage(num: number, type: number = 0) {
        this.sprBirdHead.spriteFrame = pictureManager.getIns().birdTuji[num - 1];
        let str = G_baseData.petData.getBirdName(num);
        //补写鸟的名字
        this.labBirdName.string = str;
        if (type == 0) {//普通升级
            this.labKuangName.spriteFrame = this.tukU[0]; //升级成功
            this.type_ku = 0;
        } else if (type == 1) {//高等级龙
            this.labKuangName.spriteFrame = this.tukU[1]; //恭喜获得
            this.type_ku = 1;
        } else if (type == 2) {//奖励的龙
            this.labKuangName.spriteFrame = this.tukU[1]; //恭喜获得
            this.type_ku = 2;
        } else if (type == 3) {//屠龙宝刀
            this.labKuangName.spriteFrame = this.tukU[1]; //恭喜获得
            this.sprBirdHead.node.parent.active = false;
            this.tulong.active = true;
            this.type_ku = 3;
        } else if (type == 4) {//限时分红
            this.labKuangName.spriteFrame = this.tukU[1]; //恭喜获得
            this.sprBirdHead.spriteFrame = pictureManager.getIns().birdTuji[47];
            this.type_ku = 4;
        }
    }

    /**炫耀一下 */
    Btnxaunyao() {
        Game.ApiManager.sendXaunyao();
    }

    /**检测还有没有奖励鸟了 */
    reward_bird() {
        console.log("检测还有鸟没");
    }

    _close() {
        pictureManager.getIns().guideFrist(); //新手指引
        if (this.type_ku == 2) {
            this.reward_bird();
        }
        else if (this.type_ku == 3) {
            this.sprBirdHead.node.parent.active = true;
            this.tulong.active = false;
        }
        else if (this.type_ku == 4) {
            // this.labxhfh.node.active = false;
        }
        super._close();
    }

    _hide() {
        this.btnShare.off("click", this.Btnxaunyao, this);
    }
}
