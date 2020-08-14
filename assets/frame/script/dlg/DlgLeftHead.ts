import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import cfgManager from "../game/CfgManager";
import dataManager from "../game/dataManager";
import pictureManager from "../game/pictureManager";
import BigVal from "../common/bigval/BigVal"

const { ccclass, property } = cc._decorator;

@ccclass
export default class setup extends baseUi {

    /** 上下滑动的框*/
    @property(cc.Node)
    Moveframe: cc.Node = null;
    /** 鸟的头像*/
    @property(cc.Sprite)
    sprBirds: cc.Sprite = null;
    /** 鸟的名字*/
    @property(cc.Label)
    labBirdName: cc.Label = null;
    /** 在线金币*/
    @property(cc.Label)
    labOnLineCoin: cc.Label = null;
    /** 离线金币*/
    @property(cc.Label)
    labOffLineCoin: cc.Label = null;
    /** 上下滑动的框*/
    @property(cc.Sprite)
    FenHongProgress: cc.Sprite = null;
    /** 必得分红凤凰*/
    @property(cc.Label)
    FENHONNSTR: cc.Label = null;

    /** 上*/
    @property(cc.Node)
    btnmoveUp: cc.Node = null;
    /** 下*/
    @property(cc.Node)
    btnmovedown: cc.Node = null;




    formType = new uiType(uiFormType.PopUp)

    _open() {
        this.btnmoveUp.on("click", this.moveUp, this);
        this.btnmovedown.on("click", this.moveDown, this);
        this.changeHeadImage();
    }

    /**往下滑动 */
    moveUp() {
        cc.tween(this.Moveframe)
            .to(0.5, { position: cc.v2(0, 270) })
            .start();
    }
    /**往下滑动 */
    moveDown() {
        cc.tween(this.Moveframe)
            .to(0.5, { position: cc.v2(0, 0) })
            .start();
    }
    /**替换图片 */
    changeHeadImage() {
        let num = dataManager.ins().BestBirdOfLv;
        let str = cfgManager.ins().getBirdName((num));
        this.sprBirds.spriteFrame = pictureManager.getIns().birdTuji[num - 1];
        this.labBirdName.string = str;
        this.sendMessBird();
    }

    /**发送消息获取鸟的信息（在线产比和离线产币） */
    sendMessBird() {
        var self = this;
        var funSuc = function (obj) {
            self.labOnLineCoin.string = new BigVal((Math.floor(obj.online)).toString()).geteveryStr(); //离线
            self.labOffLineCoin.string = new BigVal((Math.floor(obj.offline)).toString()).geteveryStr(); //在线
            self.FENHONNSTR.string = "3.必得分红龙" + obj.fenhong_ratio + '%'
            self.FenHongProgress.fillRange = obj.fenhong_ratio / 100;
        }
        var funErr = function () { }
        let params = {}
        try {
            cfgManager.ins().http.sendRequest('/api/game/myBird', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    _hide() {
        this.btnmoveUp.off("click", this.moveUp, this);
        this.btnmovedown.off("click", this.moveDown, this);
    }
}
