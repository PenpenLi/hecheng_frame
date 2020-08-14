
/**resources文件夹下预制体的位置 */
export const UI_CONFIG_NAME = {
    DlgBestCompose: "prefab/panels/DlgBestCompose",
    DlgDustBin: "prefab/panels/DlgDustBin",
    DlgFiveCompose: "prefab/panels/DlgFiveCompose",
    DlgFrame: "prefab/panels/DlgFrame",
    DlgGetFreeBox: "prefab/panels/DlgGetFreeBox",
    DlgGift: "prefab/panels/DlgGift",
    DlgLeftHead: "prefab/panels/DlgLeftHead",
    DlgNotCoin: "prefab/panels/DlgNotCoin",
    DlgOffLine: "prefab/panels/DlgOffLine",
    DlgRankList: "prefab/panels/DlgRankList",
    DlgRigthCoins: "prefab/panels/DlgRigthCoins",
    DlgSetUp: "prefab/panels/DlgSetUp",
    DlgShopMall: "prefab/panels/DlgShopMall",
    DlgSpeedup: "prefab/panels/DlgSpeedup",
    DlgTuJian: "prefab/panels/DlgTuJian",
    DlgUpGrade: "prefab/panels/DlgUpGrade",
    DlgZhuanPan: "prefab/panels/DlgZhuanPan",
    DlgZpTips: "prefab/panels/DlgZpTips",
    Bottom: "prefab/panels/Bottom",
    Tops: "prefab/panels/Tops",
    DlgXianshFhView: "prefab/panels/DlgXianshFhView",
    DlgSuperTurnTable:"prefab/panels/DlgSuperTurnTable",//超级转盘
}


/**弹框的类型 */
export enum uiFormType {
    /** 普通窗口 */
    Normal,
    /** 固定窗口 */
    Fixed,
    /** 弹出窗口 */
    PopUp,
    /** 弹出窗口1 */
    PopUp1,
}

/**弹框父节点路径 */
export const uiFormPath = {
    /** 普通窗口路径 */
    Normal: 'Canvas/UIROOT/Normal',
    /** 固定窗口路径 */
    Fixed: 'Canvas/UIROOT/Fixed',
    /** 弹出窗口路径 */
    PopUp: 'Canvas/UIROOT/PopUp',
    /** 弹出窗口1 */
    PopUp1: 'Canvas/UIROOT/PopUp1',
}

/**声音路径 */
export const musicPath = {
    /**购买音效 */
    buyshopclip: 'Audio/buyshopclip',
    /**合成音效 */
    addcoinclip: 'Audio/addcoinclip',
    /**获得金币音效 */
    getmoneyClip: 'Audio/getmoneyClip',
}


/**弹框是否调用广告 */
export enum isUseBananer {
    /**无 */
    none,
    /**调用 */
    openbanner,
}

/**弹框适配类型 */
export enum widdleType {
    /**无*/
    none,
    /**短 */
    short,
    /**长弹框*/
    long
}

