import baseUi from "../common/ui/baseUi"
import { uiFormType, uiFormPath, UI_CONFIG_NAME } from "../common/base/gameConfigs";
import uiType from "../common/ui/uitype";
import pictureManager from "../game/pictureManager";
import userData from "../data/userData";
import { uiManager } from "../common/ui/uiManager";
import { Game } from "../game/Game";

//12中凤凰的名字
var itemdName: Array<string> = [
    "30分钟", "60分钟", "1天", "3天", "5天", "10天", "30天", "永久"
];

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgXianshFhView extends baseUi {

    /**两张图*/
    @property(cc.SpriteFrame)
    sprFrame: cc.SpriteFrame[] = [];


    /**鸟的预制体*/
    @property(cc.Prefab)
    item_xianshi: cc.Prefab = null;

    /**所有的弹框*/
    @property(cc.Node)
    concent: cc.Node = null;

    /**是否开始了抽奖*/
    isStrat: boolean = false;
    //计时器的时间
    sTime: number = 0.1;

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
        let spr: cc.SpriteFrame = pictureManager.getIns().birdTuji[46];
        var children = this.concent.children;
        for (var i = 0; i < children.length; i++) {
            var node = cc.instantiate(this.item_xianshi);
            node.getComponent(cc.Sprite).spriteFrame = spr;
            node.getChildByName("labName").getComponent(cc.Label).string = itemdName[i];
            node.parent = children[i];
            node.setPosition(cc.v2(0, 0));
        }
    }

    _open() {
        this.init();
    }

    /**给this.Bird赋值，值得是 */
    init() {
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
        //给服务器发消息
        if (Game.gameManager.getEmpty()) {
            this.actionOfStart();
            this.sendMessageFIVE();
        } else {
            this.BtnClose();
            let string_0: string = "位置满了，请空出位置后再来抽奖";
            Game.gameManager.gameTips(string_0);
        }
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
        let addnum = 32;
        this.runFrame(index + addnum);
    }

    //记录次数
    snum: number = 0;
    index: number = 0;
    /**控制框的闪动 */
    runFrame(index) {
        Game.Console.Log("合成时的参数", index);
        var runanimate = () => {
            if (this.index > index) {
                this.unschedule(runanimate);
                this.index = 0;
                cc.tween(this.concent.children[this.index_Jiang])
                    .repeat(6,
                        cc.tween().to(0.1, { scale: 1.3 }).to(0.2, { scale: 1 })
                    )
                    .delay(0.5)
                    .call(() => { this.luckDrawEnd(); })
                    .start();
                //正常抽奖结束
            }
            else {
                this.concent.children[(this.snum + this.concent.children.length - 1) % this.concent.children.length].getComponent(cc.Sprite).spriteFrame = this.sprFrame[0];
                this.snum = this.snum % this.concent.children.length;
                this.concent.children[this.snum].getComponent(cc.Sprite).spriteFrame = this.sprFrame[1];
                this.snum++;
                this.index++;
                if (this.index > index - 6) {
                    this.unschedule(runanimate);
                    this.schedule(runanimate, this.sTime * 1.3, cc.macro.REPEAT_FOREVER);
                }
                else if (this.index > 8) {
                    this.unschedule(runanimate);
                    this.schedule(runanimate, this.sTime * 0.5, cc.macro.REPEAT_FOREVER);
                }
                else {

                }
            }
        }
        this.schedule(runanimate, this.sTime, cc.macro.REPEAT_FOREVER);
    }

    /**正常抽奖结束 */
    luckDrawEnd() {
        this.rewardXsTankuang(this.index_Jiang);
        this.concent.children[this.index_Jiang].getComponent(cc.Sprite).spriteFrame = this.sprFrame[0]; //给中奖的背景图片换回来
        this.initClose();
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
        // var self = this;
        // var funSuc = function (ret) {
        //     self.index_Jiang = Number(ret.id - 1);
        //     self.rewardXsChongwu(self.index_Jiang);
        //     self.controlFrame(self.index_Jiang); //对控制框的控制
        //     userData.ins().dao_num -= 100;
        //     // cfgManager.ins().Bottom.shuaxinDao();
        // }
        // var funErr = function (ret) {
        //     Game.gameManager.gameTips("请求失败，请稍后重试");
        //     self.initClose();
        // }
        // Game.HttpManager.sendRequest('/portal/game/breakerCompose', null, funSuc, funErr);

        this.index_Jiang = Math.floor(Math.random() * 7);
        console.log("sssssssssss", this.index_Jiang)
        this.rewardXsChongwu(this.index_Jiang);
        this.controlFrame(this.index_Jiang); //对控制框的控制
        userData.ins().dao_num -= 100;
    }

    /**关闭按钮 */
    _close() {
        if (this.isStrat) {
            console.log("页面开始转动")
            return;
        }
        super._close();
    }

    /**奖励的限时宠物 */
    rewardXsChongwu(index: number) {
        switch (Number(index)) {
            case 0://30分钟
                Game.gameManager.addBird(47, 3, 1800);
                break;
            case 1://60分钟
                Game.gameManager.addBird(47, 3, 3600);
                break;
            case 2://1天
                Game.gameManager.addBird(47, 3, 86400);
                break;
            case 3://3天
                Game.gameManager.addBird(47, 3, 259200);
                break;
            case 4://5天
                Game.gameManager.addBird(47, 3, 432000);
                break;
            case 5://10天
                Game.gameManager.addBird(47, 3, 864000);
                break;
            case 6://30天
                Game.gameManager.addBird(47, 3, 2592000);
                break;
            case 7://永久
                Game.gameManager.addBird(47);
                break;
        }
    }

    /**奖励的限时宠物 */
    rewardXsTankuang(index: number) {
        switch (Number(index)) {
            case 0://30分钟
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "30分钟");
                break;
            case 1://60分钟
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "60分钟");
                break;
            case 2://1天
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "1天");
                break;
            case 3://3天
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "3天");
                break;
            case 4://5天
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "5天");
                break;
            case 5://10天
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "10天");
                break;
            case 6://30天
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 4, "30天");
                break;
            case 7://永久
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 47, 1);
                break;
        }

    }
}
