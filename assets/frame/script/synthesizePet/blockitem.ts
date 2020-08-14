import dataManager from "../game/dataManager";
import cfgManager from "../game/CfgManager";
import pictureManager from "../game/pictureManager";
import BigVal from "../common/bigval/BigVal";
import { uiManager } from "../common/ui/uiManager";
import { uiFormType, UI_CONFIG_NAME, uiFormPath, musicPath } from "../common/config/gameConfigs";
import musicManager from "../common/music/musicManager";
import webscoketConfig from "../game/websockeConfig";
import block from "./block"

var ACTTON_TAG: number = 1;

const { ccclass, property } = cc._decorator;

@ccclass
export default class blockitem extends cc.Component {
    /**显示鸟的图片*/
    @property(cc.Sprite)
    sprBird: cc.Sprite = null;
    /**显示鸟的等级*/
    @property(cc.Label)
    LabBirdLv: cc.Label = null;
    /**飞翔的金币*/
    @property(cc.Label)
    labFly: cc.Label = null;
    /**限时鸟的倒计时文本*/
    @property(cc.Label)
    xsTimmer: cc.Label = null;
    /**克隆的鸟的预制体*/
    @property(cc.Prefab)
    CloneBird: cc.Prefab = null;
    /**鸟的实际等级,根据此数据做移动判定 */
    Numlv: number = 1;
    /**结果根据判定的数字；0默认   */
    num_Result: number = 0;
    /**鸟唯一的标记*/
    num_best: number = 0;
    /**回收价*/
    Price_Huishou: BigVal = new BigVal("10");
    //限定自己能够移动
    isMoveOnly: boolean = false;
    /**克隆的鸟 */
    moveItem: cc.Node = null;
    /**鸟窝的标记 */
    num_start: number = 1;
    /**与自身发生碰撞的鸟窝 */
    otherBirdNest: cc.Node = null;
    /**自身的父级 */
    parents: cc.Node = null;
    /**生成金币 */
    dataTime: number = null;
    /**宠物位置的坐标 */
    position_chuwu: cc.Vec2 = cc.v2(0, 30);
    /**是否参与位置保存 */
    _issave: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.labFly.string = "";
        this._issave = true;
        // cfgManager.ins().ParentItem.scaleX = dataManager.ins().scaleBlock;
        // cfgManager.ins().ParentItem.scaleY = dataManager.ins().scaleBlock;
        this.node.on(cc.Node.EventType.TOUCH_START, this.FingerStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.FingerMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.FingerEnd, this);
        //手指在目标节点区域外离开屏幕时
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.clickUP, this);
    }


    /**初始化购买不通等级的鸟时(37级以下的鸟) */
    initOfBird(num: number, type?: any, timer?: number) {
        if (type === 3) {
            this.xianshiFenhong(num, timer);
            return;
        }
        if (dataManager.ins().BestBirdOfLv < num && dataManager.ins().BestBirdOfLv < 38) { //给最高等级的值赋值
            dataManager.ins().BestBirdOfLv = num;
        }
        //定位宠物锚点
        cfgManager.ins().initanchor_chongwu(this.sprBird.node, num);

        this.num_best = num; //记录鸟唯一的标记
        this.Numlv = dataManager.ins().returnBirdLV(num); //鸟的实际等级
        this.LabBirdLv.string = dataManager.ins().showBirdLV(num); //鸟的显示等级
        this.sprBird.spriteFrame = pictureManager.getIns().birdTuji[this.num_best - 1];
        //开一个定时器,每一秒产生多少金币
        this.dataTime = this.num_best * 0.02 + 5;
        this.getCoinSpeed();
        webscoketConfig.ins().One_save_game();
        if (type === 2) {//后台奖励的鸟
            this.showComposeReward(num, 2)
        }
    }

    /**限时分红龙 */
    xianshiFenhong(numlv: number, timmer: number) {
        this._issave = false;
        this.num_best = numlv; //唯一标记 
        this.Numlv = dataManager.ins().returnBirdLV(numlv); //移动等级
        this.sprBird.spriteFrame = pictureManager.getIns().birdTuji[numlv - 1]; //本身图片
        this.LabBirdLv.string = dataManager.ins().showBirdLV(numlv); //显示等级 
        this.xsTimmer.node.active = true;
        this.xsTimmer.string = dataManager.ins().getTime(timmer);
        var call = () => {
            if (timmer < 2) {
                this.unschedule(call);
                this.delYourself();
            }
            timmer--;
            this.xsTimmer.string = dataManager.ins().getTime(timmer);
        }
        this.schedule(call, 1);
    }

    /**数字飞升的效果 */
    FlyMoveThing() {
        //播放音效
        if (!dataManager.ins().isAddCoin_bird) return; //网络加载时暂停收益
        if (!dataManager.ins().isHoutai) {
            musicManager.ins().playEffectMusic(musicPath.getmoneyClip)
        }
        cc.tween(this.node)
            .to(0.1, { scale: 1.2 })
            .to(0.1, { scale: 1 })
            .start();
        //鸟的生产金币速率为25*2^lv-1
        let coins: number = 0;
        if (this.Numlv < 38) {
            coins = 25 * Math.pow(2, this.Numlv - 1);
        } else {
            coins = 25 * Math.pow(2, 37);
        }
        var everyCoin = new BigVal(coins.toString());
        this.labFly.string = everyCoin.geteveryStr();
        dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, everyCoin);
        let start_y = this.labFly.node.y;
        cc.tween(this.labFly.node)
            .to(0.2, { position: cc.v2(0, start_y + 70) })
            .delay(0.5)
            .call(() => { this.labFly.string = "" })
            .to(0, { position: cc.v2(0, start_y) })
            .start();
        cfgManager.ins().Tops.initCoinOfTotal();
        
    }

    /**判断是否在加速中产币+速率*2 */
    getCoinSpeed() {
        if (dataManager.ins().isSpeedUp) {
            this.unscheduleAllCallbacks();
            this.schedule(() => {
                this.FlyMoveThing();
            }, this.dataTime / 2);
        } else {
            this.unscheduleAllCallbacks();
            this.schedule(() => {
                this.FlyMoveThing();
            }, this.dataTime);
        }
    }

    /**触摸开始(问题的关键)*/
    FingerStart(event: cc.Event.EventTouch) {
        if (!dataManager.ins().isMoveBird) return;
        this.getComponent(cc.CircleCollider).enabled = true;
        this.num_Result = 0;
        // console.log("鸟窝的开始数字是", this.Numlv, this.num_best); //位置
        this.moveItem = cc.instantiate(this.CloneBird);
        this.moveItem.parent = this.node.parent;
        this.moveItem.setPosition(this.position_chuwu);
        var bgClonebird = this.moveItem.getChildByName("Bird"); //图片
        var LabBirdlv = this.moveItem.getChildByName("labBirdLv"); //等级

        bgClonebird.setPosition(this.sprBird.node.position);
        bgClonebird.getComponent(cc.Sprite).spriteFrame = pictureManager.getIns().birdTuji[this.num_best - 1];
        LabBirdlv.getComponent(cc.Label).string = dataManager.ins().showBirdLV(this.Numlv);

        this.num_start = this.node.parent.getComponent(block).birdOfId; //鸟窝的标记 

        this.node.parent = cc.find("Canvas/UIROOT/synthesizePetLayer/birdMoveFther")
        // this.node.parent = cfgManager.ins().ParentItem;
        let fingerPos = event.getLocation(); //获得触摸点的坐标
        let positions = this.node.parent.convertToNodeSpaceAR(cc.v3(fingerPos)); //转换为UI坐标
        this.node.position = cc.v3(positions.x - this.sprBird.node.x,
            (positions.y - this.node.height / 2) - this.sprBird.node.y);

        dataManager.ins().isMoveBird = !dataManager.ins().isMoveBird; //限定多指移动的BOOl值
        this.isMoveOnly = !this.isMoveOnly;
    }
    /**节点跟随触摸移动*/
    FingerMove(event: cc.Event.EventTouch) {
        if (!this.isMoveOnly) return;
        let fingerPos = event.getLocation(); //获得触摸点的坐标
        let positions = this.node.parent.convertToNodeSpaceAR(cc.v3(fingerPos)); //转换为UI坐标
        this.node.position = cc.v3(positions.x - this.sprBird.node.x,
            (positions.y - this.node.height / 2) - this.sprBird.node.y);
    }
    /**触摸结束*/
    FingerEnd() {
        if (!this.isMoveOnly) return;
        switch (this.num_Result) {
            case 0: //自己
                this.node.parent = this.moveItem.parent;
                this.node.setPosition(this.position_chuwu);
                this.moveItem.destroy();
                break;
            case 1: //等级一样
                var num2 = this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).Numlv;
                num2 += 1;
                this.BirdEquallyCompose(num2); //两个同等级的鸟合成进行的判断
                break;
            case 2: //等级不一样
                this.parents = this.moveItem.parent;
                this.node.parent = this.otherBirdNest;
                this.node.setPosition(this.position_chuwu);
                this.otherBirdNest.getChildByName("Bird").parent = this.parents;
                this.otherBirdNest.getChildByName("Bird").setPosition(this.position_chuwu);
                this.moveItem.destroy();
                break;
            case 3: //没有
                this.node.parent = this.otherBirdNest;
                this.node.setPosition(this.position_chuwu);
                this.moveItem.destroy();
                break;
            case 4: //垃圾箱
                if (this.num_best != 44) {
                    this.node.pauseSystemEvents(true);
                    this.ShowDlgDusBin();
                    this.parents = this.moveItem.parent;
                    this.moveItem.destroy();
                } else { //红包凤凰
                    cfgManager.ins().openHongbao(5);
                    this.moveItem.destroy();
                    this.delYourself();

                    // //刷新每秒产生金币
                    cfgManager.ins().Tops.initCoinOfSecond();

                    // 向服务器提交位置信息
                    webscoketConfig.ins().One_save_game();
                }
                break;
        }
        this.getComponent(cc.CircleCollider).enabled = false;

        dataManager.ins().isMoveBird = !dataManager.ins().isMoveBird; //限定多指移动的BOOl值
        this.isMoveOnly = !this.isMoveOnly;
        //保存本地位置
        webscoketConfig.ins().save_Birds_local();

    }
    /**防止触摸时手指在目标节点区域外离开屏幕时发生的Bug*/
    clickUP(event) {
        if (!this.isMoveOnly) return;
        try {
            this.node.parent = this.moveItem.parent;
            this.node.setPosition(this.position_chuwu);
            this.moveItem.destroy();
            this.getComponent(cc.CircleCollider).enabled = false;

            dataManager.ins().isMoveBird = !dataManager.ins().isMoveBird; //限定多指移动的BOOl值
            this.isMoveOnly = !this.isMoveOnly;
            //保存本地位置
            webscoketConfig.ins().save_Birds_local();
        } catch (e) {
            console.log(e);
        }
    }

    //在碰撞器里面
    onCollisionStay(other) {
        var groups = other.node.group;
        switch (groups) {
            case "block":
                var num_move = other.node.getComponent(block).birdOfId;
                var num_childscount = other.node.children.length;
                if (num_move != this.num_start) { //别的鸟窝
                    this.otherBirdNest = other.node;
                    if (num_childscount == 1) { //有鸟
                        var num_lv = this.otherBirdNest.getChildByName("Bird").getComponent("blockitem").Numlv;
                        if (num_lv == this.Numlv) { //等级一样
                            this.num_Result = 1;
                        } else { //等级不一样
                            this.num_Result = 2;
                        }
                    } else {
                        //别的鸟窝没有鸟
                        this.num_Result = 3;
                    }
                } else { //自己鸟窝
                    this.num_Result = 0;
                }
                break;
            case "Dustbin":
                if (this._issave) {
                    this.num_Result = 4;
                } else {
                    this.num_Result = 0;
                }
                break;
        }
    }


    /**当两个鸟合成时，进行判断（每次两只一样的鸟合成时调用） */
    BirdEquallyCompose(bestnum: number) {
        //37一下时的判断
        if (bestnum < 38) {
            this.moveItem.destroy();
            //播放音效
            musicManager.ins().playEffectMusic(musicPath.addcoinclip);
            //合成特效
            this.GetStarEffect(this.otherBirdNest.getChildByName("Bird"));
            this.composeEnd(bestnum);
            this.showComposeReward(bestnum);
        }
        else if (bestnum == 38) { //37级鸟的合成
            this.parents = this.moveItem.parent;
            this.showBestCompose(); //显示2个37级合成随机抽奖弹框
            this.moveItem.destroy();
        } else if (bestnum > 38) { //38级恐龙
            this.parents = this.moveItem.parent;
            switch (bestnum) {
                case 39: //金木水火土
                    this.showFiveCompose();
                    this.moveItem.destroy();
                    break;
                case 40: //算力龙
                    this.closeBestCompose();
                    this.moveItem.destroy();
                    break;
                case 41: //红包龙
                    this.closeBestCompose();
                    this.moveItem.destroy();
                    break;
                case 42: //情侣龙
                    this.qinglvCompose();
                    this.moveItem.destroy();
                    break;
                case 43: //分红龙
                    this.closeBestCompose();
                    this.moveItem.destroy();
                    break;
            }
        }
    }


    /**合成鸟时的特效 */
    GetStarEffect(self) {
        let sterPer = cc.instantiate(pictureManager.getIns().starEffects);
        sterPer.parent = self;
        let heigth = this.node.height / 2;
        sterPer.setPosition(cc.v2(0, heigth));
    }

    /**弹出垃圾桶界面的方法 */
    ShowDlgDusBin() {
        //回收价格
        let price = cfgManager.ins().getBirdrecePrice(this.Numlv);
        this.Price_Huishou = new BigVal(price);
        uiManager.ins().show(UI_CONFIG_NAME.DlgDustBin, this.Price_Huishou, this.node)
    }

    /**不回收的方法,把玩家鸟归位(在垃圾桶调用)) */
    BtnNotRecovery() {
        // console.log("不回收的方法")
        this.node.resumeSystemEvents(true);
        this.node.parent = this.parents;
        this.node.setPosition(this.position_chuwu);
    }

    /**确认回收的方法,需要再次把加金币逻辑(在垃圾桶调用)) */
    BtnRecovery() {
        //播放音效
        musicManager.ins().playEffectMusic(musicPath.getmoneyClip)
        dataManager.ins().TotalCoins = BigVal.Add(dataManager.ins().TotalCoins, this.Price_Huishou); //加金币
        //总金币的刷新
        cfgManager.ins().Tops.initCoinOfTotal();
        //刷新每秒产生金币
        cfgManager.ins().Tops.initCoinOfSecond();
        if (this.num_best > 37) { //红包凤和分红凤
            var funSuc = function (ret: any) {
                if (ret.type === "breaker") {//2把屠龙刀
                    dataManager.ins().dao_num += 2;
                    cfgManager.ins().Bottom.shuaxinDao();
                    uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, 1, 3);
                } else if (ret.type === "redpack") {//红包
                    cfgManager.ins().openHongbao(10);
                }
            };
            var funErr = function () { };
            let params = {
                id: this.num_best,
                type: "save"
            }
            try {
                cfgManager.ins().http.sendRequest('/portal/game/recycleBird', params, funSuc, funErr);
            } catch (e) {
                console.log(e);
            }
        }
        this.delYourself();
        // 向服务器提交位置信息
        webscoketConfig.ins().One_save_game();
    }

    /**外部关闭（一打开就关闭）弹框时调用的方法（） */
    closeBestCompose() {
        this.node.parent = this.parents;
        this.node.setPosition(this.position_chuwu);
    }

    /**显示37级合成抽奖弹框 */
    showBestCompose() {
        this.closeBestCompose();
        uiManager.ins().show(UI_CONFIG_NAME.DlgBestCompose, this);
    }

    /**金木水火土五龙合成的框 */
    showFiveCompose() {
        this.closeBestCompose();
        uiManager.ins().show(UI_CONFIG_NAME.DlgFiveCompose);
    }

    /**情侣龙合成时判断*/
    qinglvCompose() {
        var numother = this.otherBirdNest.getChildByName("Bird").getComponent("blockitem").num_best;
        var numself = this.num_best;
        if (numother != numself) {
            cfgManager.ins().openHongbao(6);
            this.node.destroy();
            this.otherBirdNest.getChildByName("Bird").destroy();
            // //刷新每秒产生金币
            cfgManager.ins().Tops.initCoinOfSecond();
        } else {
            this.parents = this.moveItem.parent;
            this.node.parent = this.parents;
            this.node.setPosition(this.position_chuwu);
        }
        //向服务器提交位置信息
        webscoketConfig.ins().One_save_game();
    }

    /**抽奖鸟成功后的鸟的合成逻辑（num）标记 */
    birdDrawEnd(num: number) {
        this.composeEnd(num);
        //向服务器提交位置信息
        webscoketConfig.ins().One_save_game();
    }

    /**合成成功后删除自身移动目标等级加一+(添加修复数组合成不能监听的bug) */
    composeEnd(num: number) {
        this.delYourself();
        var birdHead = this.otherBirdNest.getChildByName("Bird").getComponent(blockitem);
        birdHead.sprBird.spriteFrame = pictureManager.getIns().birdTuji[num - 1];
        this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).LabBirdLv.string = dataManager.ins().showBirdLV(num);
        this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).Numlv = dataManager.ins().returnBirdLV(num);; //进行合成判断
        this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).num_best = num; //鸟唯一的标记

        cfgManager.ins().initanchor_chongwu(this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).sprBird.node, num);

        let index = this.otherBirdNest.getComponent(block).birdOfId;
        dataManager.ins().isHaveBird[index] = num;
    }

    /**37抽奖完成+五龙合成+系统赠送(type=2)+普通合成更高级的鸟type=1——恭喜获得 默认0=升级成功*/
    showComposeReward(num_bestlv: number, type: number = 0) {
        //刷新每秒产生金币
        cfgManager.ins().Tops.initCoinOfSecond();
        webscoketConfig.ins().One_save_game();
        if (type === 0) {
            if (num_bestlv > dataManager.ins().BestBirdOfLv) {
                dataManager.ins().BestBirdOfLv = num_bestlv; //给最高等级的鸟赋值
                cfgManager.ins().Tops.initmyHead(num_bestlv);
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, num_bestlv, type);
            }
        } else {
            if (num_bestlv > dataManager.ins().BestBirdOfLv) {
                dataManager.ins().BestBirdOfLv = num_bestlv; //给最高等级的鸟赋值
                cfgManager.ins().Tops.initmyHead(num_bestlv);
            }
            uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, num_bestlv, type);
        }
        console.log("合成成功", dataManager.ins().BestBirdOfLv)
    }

    /**删除自己的方法（用在五龙合成成功时调用） */
    delYourself() {
        this.node.destroy();
    }
}
