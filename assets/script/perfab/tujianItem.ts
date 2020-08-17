import { G_baseData } from "../data/baseData";
import pictureManager from "../game/pictureManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    labstr1: cc.Label = null;

    @property(cc.Label)
    labstr2: cc.Label = null;

    @property(cc.Label)
    labstr3: cc.Label = null;

    @property(cc.Label)
    labcatName: cc.Label = null;

    @property(cc.Sprite)
    sprcatHead: cc.Sprite = null;

    @property(cc.SpriteFrame)
    bird_tuji: cc.SpriteFrame[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(index: number) {
        let num: number = index - 1;
        switch (num) {
            case 0:
                this.labcatName.string = "红包凤凰";
                this.labstr1.string = "100%获得5-50元现金红包（可提现）";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.拖到回收箱即可领取红包";
                if (G_baseData.petData.CheckItemSelf(44)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[43];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 1:
                this.labcatName.string = "算力凤凰";
                this.labstr1.string = "持有额外增益500算力，提高MBC产量";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.若回收，则算力增益效果将消失";
                if (G_baseData.petData.CheckItemSelf(43)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[42];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 2:
                this.labcatName.string = "情侣凤♂";
                this.labstr1.string = "收集一对情侣凤获得52元现金红包";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.“爱情里也有红包”";
                if (G_baseData.petData.CheckItemSelf(45)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[44];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 3:
                this.labcatName.string = "情侣凤♀";
                this.labstr1.string = "收集一对情侣凤获得52元现金红包";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.“爱情里也有红包”";
                if (G_baseData.petData.CheckItemSelf(46)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[45];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 4:
                this.labcatName.string = "金凤";
                this.labstr1.string = "收集金木水火土召唤分红凤";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.合成分红凤的碎片之一";
                if (G_baseData.petData.CheckItemSelf(38)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[37];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 5:
                this.labcatName.string = "木凤";
                this.labstr1.string = "收集金木水火土召唤分红凤";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.合成分红凤的碎片之一";
                if (G_baseData.petData.CheckItemSelf(39)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[38];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 6:
                this.labcatName.string = "水凤";
                this.labstr1.string = "收集金木水火土召唤分红凤";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.合成分红凤的碎片之一";
                if (G_baseData.petData.CheckItemSelf(40)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[39];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 7:
                this.labcatName.string = "火凤";
                this.labstr1.string = "收集金木水火土召唤分红凤";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.合成分红凤的碎片之一";
                if (G_baseData.petData.CheckItemSelf(41)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[40];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
            case 8:
                this.labcatName.string = "土凤";
                this.labstr1.string = "收集金木水火土召唤分红凤";
                this.labstr2.string = "1.两只37级凤合成有概率获得；";
                this.labstr3.string = "2.合成分红凤的碎片之一";
                if (G_baseData.petData.CheckItemSelf(42)) {
                    this.sprcatHead.spriteFrame = pictureManager.getIns().birdTuji[41];
                } else {
                    this.sprcatHead.spriteFrame = this.bird_tuji[num];
                }
                break;
        }
    }

    // update (dt) {}
}
