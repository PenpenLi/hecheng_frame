import baseUi from "../../frameWork/ui/baseUi"
import { uiFormType, uiFormPath } from "../../common/gameConfig/gameConfigs";
import uiType from "../../frameWork/ui/uitype";
import BigVal from "../../common/bigval/BigVal"
import { Game } from "../../game/Game";
import { G_baseData } from "../../data/baseData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends baseUi {

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
        this.Moveframe.y = 0
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
        let num = G_baseData.petData.BestBirdOfLv;
        let str = G_baseData.petData.getBirdName((num));
        this.sprBirds.spriteFrame = G_baseData.petData.birdSprList[num - 1];
        this.labBirdName.string = str;
        this.sendMessBird();
    }

    /**发送消息获取鸟的信息（在线产比和离线产币） */
    sendMessBird() {
        var self = this;
        var funSuc = function (obj) {
            if (obj.code == 0) {
                let data = obj.data;
                self.labOnLineCoin.string = new BigVal((Math.floor(data.online)).toString()).geteveryStr(); //离线
                self.labOffLineCoin.string = new BigVal((Math.floor(data.offline)).toString()).geteveryStr(); //在线
                self.FENHONNSTR.string = "3.必得凤" + data.fenhong_ratio + '%'
                self.FenHongProgress.fillRange = data.fenhong_ratio / 100;
            }
        }
        var funErr = function () { }
        let params = {}
        try {
            Game.HttpManager.sendRequest('/api/game/myBird', params, funSuc, funErr);
        } catch (e) {
            console.log(e);
        }
    }

    _hide() {
        this.btnmoveUp.off("click", this.moveUp, this);
        this.btnmovedown.off("click", this.moveDown, this);
    }
}
