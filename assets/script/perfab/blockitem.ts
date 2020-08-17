import userData from "../data/userData";
import pictureManager from "../game/pictureManager";
import BigVal from "../common/bigval/BigVal";
import { uiManager } from "../common/ui/uiManager";
import { uiFormType, UI_CONFIG_NAME, uiFormPath, musicPath } from "../common/base/gameConfigs";
import musicManager from "../common/music/musicManager";
import webscoketConfig from "../game/websockeConfig";
import { Game } from "../game/Game";
import block from "./block";
import { G_baseData } from "../data/baseData";
import { Global_Var } from "../common/base/GlobalVar";

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
    num_best: number = 1;
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

    Is_TimeBird = 0;
    TimeBird_Timestamp = 0;
    TimeBird_TimeCount = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.labFly.string = "";

        Game.ParentItem.scaleX = G_baseData.petData.scaleBlock;
        Game.ParentItem.scaleY = G_baseData.petData.scaleBlock;
        this.node.on(cc.Node.EventType.TOUCH_START, this.FingerStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.FingerMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.FingerEnd, this);
        //手指在目标节点区域外离开屏幕时
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.clickUP, this);
    }


    /**初始化购买不通等级的鸟时(37级以下的鸟) */
    initOfBird(num: number, type?: number, timer?: number) {

        if (type === 3) {
            this.xianshiFenhong(num, timer);
            return;
        }
        if (G_baseData.petData.BestBirdOfLv < num && G_baseData.petData.BestBirdOfLv < 38) { //给最高等级的值赋值
            G_baseData.petData.BestBirdOfLv = num;
        }
        //定位宠物锚点
        G_baseData.petData.initanchor_chongwu(this.sprBird.node, num);

        this.num_best = num; //记录鸟唯一的标记
        this.Numlv = G_baseData.petData.returnBirdLV(num); //鸟的合成等级
        this.LabBirdLv.string = G_baseData.petData.showBirdLv(num); //鸟的显示等级
        this.sprBird.spriteFrame = pictureManager.getIns().birdTuji[this.num_best - 1];
        //开一个定时器,每一秒产生多少金币
        this.dataTime = this.num_best * 0.02 + 5;
        this.getCoinSpeed();

        if (type === 2) {//后台奖励的鸟
            this.showComposeReward(num, type)
        }
    }


    _issave: boolean = true;
    /** 限时分红龙 */
    xianshiFenhong(numlv: number, timmer: number) {
        this.Is_TimeBird = 1;
        this._issave = false;
        this.num_best = numlv; //唯一标记 
        this.Numlv = G_baseData.petData.returnBirdLV(numlv); //移动等级
        this.sprBird.spriteFrame = pictureManager.getIns().birdTuji[numlv - 1]; //本身图片
        // this.LabBirdLv.string = G_baseData.petData.showBirdLv(numlv); //显示等级 
        this.LabBirdLv.node.parent.active = false;
        this.xsTimmer.node.active = true;
        this.xsTimmer.string = Global_Var.changeTimeToStr(timmer);

        this.TimeBird_TimeCount = timmer;
        this.TimeBird_Timestamp = Date.parse(new Date().toString());

        // var call = () => {
        //     if (timmer < 2) {
        //         this.unschedule(call);
        //         this.delYourself();
        //     }
        //     timmer--;
        //     this.xsTimmer.string = Global_Var.changeTimeToStr(timmer);
        // }
        // this.schedule(call, 1);
    }

    _time = 0;
    TriggerInterval = 0.3;
    update(dt) {
        if (this.Is_TimeBird == 0) {
            return;
        }
        this._time += dt;
        if (this._time >= this.TriggerInterval) {
            this._time = 0;

            let _IndexTime = Game.UtilFunction.TimeDifference(this.TimeBird_Timestamp);
            if (_IndexTime[0] < 0) {
                this.delYourself();
            }
            this.xsTimmer.string = Global_Var.changeTimeToStr(this.TimeBird_TimeCount - _IndexTime[1]);
        }
    }

    /**数字飞升的效果 */
    FlyMoveThing() {
        //播放音效
        if (!userData.ins().isAddCoin_bird) return; //网络加载时暂停收益
        if (!userData.ins().isHoutai) {
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
        //userData.ins().TotalCoins = BigVal.Add(userData.ins().TotalCoins, everyCoin);
        let start_y = this.labFly.node.y;
        cc.tween(this.labFly.node)
            .to(0.2, { position: cc.v2(0, start_y + 70) })
            .delay(0.5)
            .call(() => { this.labFly.string = "" })
            .to(0, { position: cc.v2(0, start_y) })
            .start();
        // Game.Tops.initCoinOfTotal();
    }

    /**判断是否在加速中产币+速率*2 */
    getCoinSpeed() {
        if (G_baseData.petData.isSpeedUp) {
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
        if (!G_baseData.petData.isMoveBird) return;
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
        LabBirdlv.getComponent(cc.Label).string = G_baseData.petData.showBirdLv(this.Numlv);

        this.num_start = this.node.parent.getComponent(block).birdOfId; //鸟窝的标记    
        this.node.parent = Game.ParentItem;
        let fingerPos = event.getLocation(); //获得触摸点的坐标
        this.node.position = this.node.parent.convertToNodeSpaceAR(cc.v3(fingerPos)); //转换为UI坐标

        G_baseData.petData.isMoveBird = !G_baseData.petData.isMoveBird; //限定多指移动的BOOl值
        this.isMoveOnly = !this.isMoveOnly;
    }

    /**节点跟随触摸移动*/
    FingerMove(event: cc.Event.EventTouch) {
        if (!this.isMoveOnly) return;
        let fingerPos = event.getLocation(); //获得触摸点的坐标
        this.node.position = this.node.parent.convertToNodeSpaceAR(cc.v3(fingerPos)); //转换为UI坐标
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
                this.num_Result = 4;
                break;
        }
    }

    /**防止触摸时手指在目标节点区域外离开屏幕时发生的Bug*/
    clickUP(event) {
        if (!this.isMoveOnly) return;
        try {
            this.node.parent = this.moveItem.parent;
            this.node.setPosition(this.position_chuwu);
            this.moveItem.destroy();
            this.getComponent(cc.CircleCollider).enabled = false;

            G_baseData.petData.isMoveBird = !G_baseData.petData.isMoveBird; //限定多指移动的BOOl值
            this.isMoveOnly = !this.isMoveOnly;
        } catch (e) {
            console.log(e);
        }
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
                let numBird: number = this.Numlv;
                this.BirdEquallyCompose(++numBird); //两个同等级的鸟合成进行的判断
                break;
            case 2: //等级不一样
                this.parents = this.moveItem.parent;
                this.node.parent = this.otherBirdNest;
                this.node.setPosition(this.position_chuwu);
                this.otherBirdNest.getChildByName("Bird").parent = this.parents;
                this.otherBirdNest.getChildByName("Bird").setPosition(this.position_chuwu);
                this.moveItem.destroy();
                //本地保存
                webscoketConfig.ins().save_Birds_local();
                break;
            case 3: //没有
                this.parents = this.moveItem.parent;
                this.node.parent = this.otherBirdNest;
                this.node.setPosition(this.position_chuwu);
                this.moveItem.destroy();
                //本地保存
                webscoketConfig.ins().save_Birds_local();
                break;
            case 4: //垃圾箱
                if (this.num_best != 44) {

                    if (this.Is_TimeBird == 1) {
                        Game.gameManager.gameTips('限时分红凤不可回收');
                        this.clickUP('');
                        return;
                    }

                    this.ShowDlgDusBin();
                    this.parents = this.moveItem.parent;
                    this.moveItem.destroy();
                } else { //红包凤凰
                    Game.ApiManager.openHongbao(5);
                    this.moveItem.destroy();

                    this.delYourself();
                    //刷新每秒产生金币
                    Game.Tops.initCoinOfSecond();

                    let _num2: number = this.num_best;
                    webscoketConfig.ins().saveDelBird(_num2);
                    //本地保存
                    webscoketConfig.ins().save_Birds_local();
                }
                break;
        }
        this.getComponent(cc.CircleCollider).enabled = false;

        G_baseData.petData.isMoveBird = !G_baseData.petData.isMoveBird; //限定多指移动的BOOl值
        this.isMoveOnly = !this.isMoveOnly;
    }

    /**当两个鸟合成时，进行判断（每次两只一样的鸟合成时调用） */
    BirdEquallyCompose(bestnum: number) {
        //37一下时的判断
        if (bestnum < 38) {
            this.parents = this.moveItem.parent;
            this.moveItem.destroy();
            //服务器：普通合成
            webscoketConfig.ins().saveComposeMess(bestnum);
            //播放音效
            musicManager.ins().playEffectMusic(musicPath.addcoinclip);
            //合成特效
            pictureManager.getIns().GetStarEffect(this.otherBirdNest.getChildByName("Bird"));
            this.composeEnd(bestnum);
            this.showComposeReward(bestnum);

            //概率分红龙
            Game.HttpManager.GetFenHongDrongen((res) => {
                if (res.data.birid == 0 || res.data.duration == 0) {
                    return
                }
                Game.gameManager.addBird(res.data.birid, 3, res.data.duration);
            });
        }
        else if (bestnum === 38) { //37级鸟的合成
            this.parents = this.moveItem.parent;
            this.moveItem.destroy();
            this.showBestCompose(); //显示2个37级合成随机抽奖弹框
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

    /**出碰撞器触发 */
    onCollisionExit(other) {
        this.num_Result = 0;
    }


    /**弹出垃圾桶界面的方法 */
    ShowDlgDusBin() {
        //回收价格
        let price = G_baseData.petData.getBirdrecePrice(this.Numlv);
        this.Price_Huishou = new BigVal(price);
        uiManager.ins().show(UI_CONFIG_NAME.DlgDustBin, this.Price_Huishou, this.node)
    }

    /**不回收的方法,把玩家鸟归位(在垃圾桶调用)) */
    BtnNotRecovery() {
        this.node.parent = this.parents;
        this.node.setPosition(this.position_chuwu);
    }

    /**确认回收的方法,需要再次把加金币逻辑(在垃圾桶调用)) */
    BtnRecovery() {
        let _num2 = this.num_best;
        //服务端删除宠物
        webscoketConfig.ins().saveDelBird(_num2);
        this.delYourself();
        //刷新每秒产生金币
        Game.Tops.initCoinOfSecond();
        userData.ins().TotalCoins = BigVal.Add(userData.ins().TotalCoins, this.Price_Huishou);
        //总金币的刷新
        Game.Tops.initCoinOfTotal();
        //播放音效
        musicManager.ins().playEffectMusic(musicPath.getmoneyClip)
        //本地保存
        webscoketConfig.ins().save_Birds_local();
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
            this.parents = this.moveItem.parent;
            Game.ApiManager.openHongbao(6);
            this.node.destroy();
            this.otherBirdNest.getChildByName("Bird").destroy();
            // //刷新每秒产生金币
            Game.Tops.initCoinOfSecond();
            //服务端：情侣龙删除
            webscoketConfig.ins().saveComposeQinglv();
            //本地保存
            webscoketConfig.ins().save_Birds_local();
        } else {
            this.parents = this.moveItem.parent;
            this.node.parent = this.parents;
            this.node.setPosition(this.position_chuwu);
        }
    }

    /**抽奖鸟成功后的鸟的合成逻辑（num）标记 */
    birdDrawEnd(num: number) {
        this.composeEnd(num);
    }

    /**合成成功后删除自身移动目标等级加一 */
    composeEnd(num: number) {
        var birdHead = this.otherBirdNest.getChildByName("Bird").getComponent(blockitem);
        birdHead.sprBird.spriteFrame = pictureManager.getIns().birdTuji[num - 1];
        this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).LabBirdLv.string = G_baseData.petData.showBirdLv(num);
        this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).Numlv = G_baseData.petData.returnBirdLV(num);; //进行合成判断
        this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).num_best = num; //鸟唯一的标记
        G_baseData.petData.initanchor_chongwu(this.otherBirdNest.getChildByName("Bird").getComponent(blockitem).sprBird.node, num);

        this.delYourself();
        //关键的一步+(添加修复数组合成不能监听的bug)
        let index: number = this.otherBirdNest.getComponent(block).birdOfId;
        G_baseData.petData.isHaveBird[index] = num;

        //本地保存
        webscoketConfig.ins().save_Birds_local();
    }

    /**37抽奖完成+五龙合成+系统赠送(type=2)+普通合成更高级的鸟type=1——恭喜获得 默认0=升级成功*/
    showComposeReward(num_bestlv: number, type: number = 0) {
        //刷新每秒产生金币
        Game.Tops.initCoinOfSecond();
        if (type === 0) {
            if (num_bestlv > G_baseData.petData.BestBirdOfLv) {
                G_baseData.petData.BestBirdOfLv = num_bestlv; //给最高等级的鸟赋值
                Game.Tops.initmyHead(num_bestlv);
                uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, num_bestlv, type);
            }
        } else {
            if (num_bestlv > G_baseData.petData.BestBirdOfLv) {
                G_baseData.petData.BestBirdOfLv = num_bestlv; //给最高等级的鸟赋值
                Game.Tops.initmyHead(num_bestlv);
            }
            uiManager.ins().show(UI_CONFIG_NAME.DlgUpGrade, num_bestlv, type);
        }
    }

    /**删除自己的方法（用在五龙合成成功时调用） */
    delYourself() {
        this.node.destroy();
    }
}
