import SingletonClass from "../frameWork/base/SingletonClass";
import { loaderMgr } from "../frameWork/load/loaderMgr";
import { UI_ATLAS } from "../common/gameConfig/gameConfigs";
import { G_baseData } from "./baseData";

//只做加载 最后把所有数据 发送至对应模块
/***用于加载表格和图集 */
export default class tblData extends SingletonClass {

    private birdSprList: cc.SpriteFrame[] = [];
    private smallBirdSprList: cc.SpriteFrame[] = [];
    public static ins() {
        return super.ins() as tblData;
    }

    async loadTbl() {
        let birdsAtlas = await loaderMgr.ins().loadAsset(UI_ATLAS.BirdList, cc.SpriteAtlas) as cc.SpriteAtlas;
        let smallBirdsAtlas = await loaderMgr.ins().loadAsset(UI_ATLAS.SmallBirdList, cc.SpriteAtlas) as cc.SpriteAtlas;
        G_baseData.petData.birdName = await loaderMgr.ins().loadName("namejson/birdName");
        this.loadBirdSpr(birdsAtlas);
        this.loadSmallBirdSpr(smallBirdsAtlas)
        return true;
    }

    private loadBirdSpr(birdsAtlas) {
        if (!!!birdsAtlas) return;
        let sprList = birdsAtlas.getSpriteFrames();
        for (let i = 0; i < sprList.length; i++) {//排序
            let index = parseInt(sprList[i].name);
            this.birdSprList[index - 1] = sprList[i];
        }
        G_baseData.petData.birdSprList = this.birdSprList;
    }

    private loadSmallBirdSpr(smallBirdsAtlas) {
        if (!!!smallBirdsAtlas) return;
        let sprList = smallBirdsAtlas.getSpriteFrames();
        for (let i = 0; i < sprList.length; i++) {//排序
            let index = parseInt(sprList[i].name);
            this.smallBirdSprList[index - 1] = sprList[i];
        }
        G_baseData.petData.smallBirdSprList = this.smallBirdSprList;
    }
}