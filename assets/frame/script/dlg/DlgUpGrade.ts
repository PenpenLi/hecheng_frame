import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import pictureManager from "../game/pictureManager";
import cfgManager from "../game/CfgManager"
import dataManager from "../game/dataManager";
import tsAddLayer from "../common/tsAddLayer";

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

    /**限时分红 */
    @property(cc.Label)
    labxhfh: cc.Label = null;

    /**分享按钮 */
    @property(cc.Node)
    btnShare: cc.Node = null;

    /**判断是否奖励的状态 */
    type_ku: number = 0;

    formType = new uiType(uiFormType.PopUp)

    _open(param) {
        tsAddLayer.getIns().guideFirst(); //新手指引
        this.btnShare.on("click", this.Btnxaunyao, this);
        console.log("param", param);
        if (!param) {
            console.error("缺少参数");
            return;
        }
        this.changeBirdImage(param[0], param[1], param[2]);
    }


    /**换图片的方法 */
    changeBirdImage(num: number, type: number = 0, str?: string) {
        if (num > 0 && num < 48) {
            this.sprBirdHead.spriteFrame = pictureManager.getIns().birdTuji[num - 1];
            let str = cfgManager.ins().getBirdName(num);
            this.labBirdName.string = str;
        }
        //补写鸟的名字
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
            this.labxhfh.node.active = true;
            this.labxhfh.string = `限时${str}`;
            this.type_ku = 4;
        }
    }

    /**炫耀一下 */
    Btnxaunyao() {
        cfgManager.ins().sendShareFriend();
    }

    /**检测还有没有奖励鸟了 */
    reward_bird() {
        console.log("检测还有鸟没");
        cfgManager.ins().gameManager.isBird_reward();
    }

    _close() {
        console.log("cccc")
        tsAddLayer.getIns().guideFirst(); //新手指引
        if (this.type_ku == 2) {
            this.reward_bird();
        } else if (this.type_ku == 3) {
            this.sprBirdHead.node.parent.active = true;
            this.tulong.active = false;
        }
        else if (this.type_ku == 4) {
            this.labxhfh.node.active = false;
        }
        super._close();
    }

    _hide() {
        this.btnShare.off("click", this.Btnxaunyao, this);
    }
}
