
export const Msg_Id = {
    getAllMutantDragon: "", //获取全部
    getMyMutantDragon: "",//我的变异龙
    overDueDragon: "",//过期龙
    buyMutantDragon: "",//购买变异龙

    getSuperTurnTable: "/portal/Incentive/get_turnplate_list",//获取超级转盘
    useSuperTurnTable: "/portal/Incentive/turn_turnplate",//使用超级转盘
    getSuperTurnTableChance: "",//转换一次抽奖机会 废弃

    getConfigSet: "/portal/User/get_config_set",//获取默认一些配置
    infinitePlayVideo: "/portal/incentive/record",//无限看视频 //
    videoAward: "/portal/Incentive/video_turnplate_reward",//看视频奖励

}

export interface I_Send_AllMutantDragon {

}

export interface I_Send_MyMutantDragon {

}

export interface I_Send_OverDueMutantDragon {

}

export interface I_Send_BuyMutantDragon {

}

export interface I_Send_GetSuperTurnTable {

}

export interface I_Send_UseSuperTurnTable {
    ad_type: number;//0=穿山甲 1优量汇
}

export interface I_Send_getSuperTurnTableChance {

}

export interface I_Send_getTuLongNotice {

}

// getTuLongNotice: "",//获取屠龙刀提示
// infinitePlayVideo: ""//无限看视频
