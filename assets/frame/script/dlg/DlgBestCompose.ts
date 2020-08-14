import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath } from "../common/config/gameConfigs";
import uiType from "../common/ui/uitype";
import cfgManager from "../game/CfgManager";
import blockitem from "../synthesizePet/blockitem";
import pictureManager from "../game/pictureManager";

const START_NUM: number = 36;
const JIN_BIRD: number = 38; //金
const MU_BIRD: number = 39; //木
const SHUI_BIRD: number = 40; //水
const HUO_BIRD: number = 41; //火
const TU_BIRD: number = 42; //土
const SUANLI_BIRD: number = 43; //算力
const HONGBAO_BIRD: number = 44; //红包
const QLMAN_BIRD: number = 45; //情侣男
const QLWOMAN_BIRD: number = 46; //情侣女
const FENGHONG_BIRD: number = 47; //分红
//12中凤凰的名字
// var birdName: Array<string> = [
//     "分红喵", "福神喵", "禄神喵", "算力喵", "寿神喵", "情侣喵",
//     "红包喵", "喜神喵", "财神喵", "情侣喵", "寿神喵", "算力喵",
// ];
const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgBestCompose extends baseUi {

    /**两张图*/
    @property(cc.SpriteFrame)
    sprFrame: cc.SpriteFrame[] = [];


    /**鸟的预制体*/
    @property(cc.Prefab)
    BirdPerfabs: cc.Prefab = null;

    /**所有的弹框*/
    @property(cc.Node)
    concent: cc.Node = null;

    /**是否开始了抽奖*/
    isStrat: boolean = false;
    //计时器的时间
    sTime: number = 0.1;
    //记录次数
    snum: number = 0;
    index: number = 0;
    bird: blockitem = null;
    //开始按钮
    btnStart: cc.Node = null;
    /**中奖数字 */
    index_Jiang: number = 0;

    formType = new uiType(uiFormType.PopUp)



    onLoad() {
        this.creatOfFrame();
    }
    /**生成地图的样子 */
    creatOfFrame() {
        var children = this.concent.children;
        for (var i = 0; i < children.length; i++) {
            var node = cc.instantiate(this.BirdPerfabs);
            let index = this.initPicture(i);
            node.getComponent(cc.Sprite).spriteFrame = pictureManager.getIns().birdTuji[index - 1];
            node.getChildByName("labName").getComponent(cc.Label).string = cfgManager.ins().getBirdName(index);
            node.parent = children[i];
            node.setPosition(cc.v2(0, 0));
        }
    }

    /**赋值图片 */
    initPicture(num: number) {
        switch (num) {
            case 0:
                num = 47;
                break;
            case 1:
                num = 38;
                break;
            case 2:
                num = 39;
                break;
            case 3:
                num = 43;
                break;
            case 4:
                num = 40;
                break;
            case 5:
                num = 45;
                break;
            case 6:
                num = 44;
                break;
            case 7:
                num = 41;
                break;
            case 8:
                num = 42;
                break;
            case 9:
                num = 46;
                break;
            case 10:
                num = 40;
                break;
            case 11:
                num = 43;
                break;
            default:
                break;
        }
        return num;
    }



    _open(params) {
        if (!params[0]) {
            console.error("缺少参数")
        }
        this.init(params[0]);
    }

    /**给this.Bird赋值，值得是 */
    init(self: any) {
        this.bird = self;
        this.btnStart = this.node.getChildByName("BtnStart");
        this.btnStart.on("click", this.btnStartCJ, this);
        this.btnStart.getComponent(cc.Animation).play("best_1");
    }
    _hide() {
        this.btnStart.off("click", this.btnStartCJ, this);
    }

    /**关闭按钮 */
    BtnClose() {
        if (this.isStrat) return;
        super._close();
    }

    /**开始按钮 */
    btnStartCJ() {
        this.actionOfStart();
        //给服务器发消息
        this.sendMessageFIVE();
    }

    /**控制开始按钮的动态转换 */
    actionOfStart() {
        this.isStrat = true;
        this.btnStart.getComponent(cc.Button).interactable = false; //防止重复点击
        this.btnStart.getComponent(cc.Animation).play("best_2");
    }


    /**对控制框的控制 */
    controlFrame(index) {
        console.log("控制框的", index);
        var num_1 = START_NUM;
        switch (index) {
            case 0: //分红（42）
                this.runFrame(num_1, FENGHONG_BIRD);
                break;
            case 1: //金
                this.runFrame(num_1 + 1, JIN_BIRD);
                break;
            case 2: //木
                this.runFrame(num_1 + 2, MU_BIRD);
                break;
            case 3: //算力
                this.runFrame(num_1 + 3, SUANLI_BIRD);
                break;
            case 4: //水
                this.runFrame(num_1 + 4, SHUI_BIRD);
                break;
            case 5: //情侣男
                this.runFrame(num_1 + 5, QLMAN_BIRD);
                break;
            case 6: //红包
                this.runFrame(num_1 + 6, HONGBAO_BIRD);
                break;
            case 7: //火
                this.runFrame(num_1 + 7, HUO_BIRD);
                break;
            case 8: //土
                this.runFrame(num_1 + 8, TU_BIRD);
                break;
            case 9: //情侣女
                this.runFrame(num_1 + 9, QLWOMAN_BIRD);
                break;
            case 10: //水
                this.runFrame(num_1 + 10, SHUI_BIRD);
                break;
            case 11: //算力
                this.runFrame(num_1 + 11, SUANLI_BIRD)
                break;
        }
    }

    /**控制框的闪动 */
    runFrame(index, num) {
        console.log("合成时的参数", index, num);
        var runanimate = function () {
            if (this.index > index) {
                this.unschedule(runanimate);
                this.index = 0;
                cc.tween(this.concent.children[this.index_Jiang])
                    .repeat(6,
                        cc.tween().to(0.1, { scale: 1.3 }).to(0.2, { scale: 1 })
                    )
                    .delay(0.5)
                    .call(() => { this.luckDrawEnd(num); })
                    .start();
                //正常抽奖结束
            } else if (this.index > index - 6) {
                this.concent.children[(this.snum + this.concent.children.length - 1) % this.concent.children.length].getComponent(cc.Sprite).spriteFrame = this.sprFrame[0];
                this.snum = this.snum % this.concent.children.length;
                this.concent.children[this.snum].getComponent(cc.Sprite).spriteFrame = this.sprFrame[1];
                this.snum++;
                this.index++;
                this.unschedule(runanimate);
                this.schedule(runanimate, this.sTime * 1.3, cc.macro.REPEAT_FOREVER);
            } else if (this.index > 8) {
                this.concent.children[(this.snum + this.concent.children.length - 1) % this.concent.children.length].getComponent(cc.Sprite).spriteFrame = this.sprFrame[0];
                this.snum = this.snum % this.concent.children.length;
                this.concent.children[this.snum].getComponent(cc.Sprite).spriteFrame = this.sprFrame[1];
                this.snum++;
                this.index++;
                this.unschedule(runanimate);
                this.schedule(runanimate, this.sTime * 0.5, cc.macro.REPEAT_FOREVER);
            } else {
                this.concent.children[(this.snum + this.concent.children.length - 1) % this.concent.children.length].getComponent(cc.Sprite).spriteFrame = this.sprFrame[0];
                this.snum = this.snum % this.concent.children.length;
                this.concent.children[this.snum].getComponent(cc.Sprite).spriteFrame = this.sprFrame[1];
                this.snum++;
                this.index++;
            }
        }.bind(this);
        this.schedule(runanimate, this.sTime, cc.macro.REPEAT_FOREVER);
    }

    /**正常抽奖结束 */
    luckDrawEnd(num) {
        this.concent.children[this.index_Jiang].getComponent(cc.Sprite).spriteFrame = this.sprFrame[0]; //给中奖的背景图片换回来
        this.initClose();
        try {
            this.bird.showComposeReward(num, 1); //抽奖完成后获得奖励弹出的框num==鸟的图片的索引
        } catch (e) {
            console.log(e);
        }
    }

    /**数据初始化 */
    initClose() {
        this.snum = 0;
        this.failcompose();
        this.BtnClose();
    }

    /**服务器发送失败的反应 */
    failcompose() {
        this.node.getChildByName("BtnStart").getChildByName("btnstartbg").angle = 0;
        this.isStrat = false;
        this.btnStart.getComponent(cc.Button).interactable = true; //防止重复点击
        this.btnStart.getComponent(cc.Animation).play("best_1");
        this.node.getChildByName("BtnStart").angle = 0;
    }

    /**网络接口 */
    sendMessageFIVE() {
        var self = this;
        var funSuc = function (ret) {
            console.log("rewardNum", ret);
            self.bird.birdDrawEnd(ret.id); //抽奖鸟成功后的鸟的合成逻辑（num）标记  num_1 鸟的实际等级（金 算 红 情 分红）；
            self.index_Jiang = self.num_Change(ret.id);
            console.log("rewardIndex", self.index_Jiang);
            self.controlFrame(self.index_Jiang); //对控制框的控制
        }
        var funErr = function (ret) {
            cfgManager.ins().gameManager.gameTips("请求失败，请稍后重试");
            self.failcompose();
        }
        let params = {};
        cfgManager.ins().http.sendRequest('/api/game/compose', params, funSuc, funErr);
    }

    /**数字转换 */
    num_Change(num) {
        switch (num) {
            case 38:
                num = 1;
                break;
            case 39:
                num = 2;
                break;
            case 40:
                num = 4;
                break;
            case 41:
                num = 7;
                break;
            case 42:
                num = 8;
                break;
            case 43:
                num = 3;
                break;
            case 44:
                num = 6;
                break;
            case 45:
                num = 5;
                break;
            case 46:
                num = 9;
                break;
            case 47:
                num = 0;
                break;
        }
        return num;
    }

    /**关闭按钮 */
    _close() {
        if (this.isStrat) {
            console.log("页面开始转动")
            return;
        }
        super._close();
    }

}
