import SingletonClass from "../base/SingletonClass"
import HTTP from "../http/http";
import { Msg_Id, I_Send_getTuLongNotice } from "./msgId";
import dataManager from "../../game/dataManager";

export default class mainHandle extends SingletonClass {
    http: HTTP = new HTTP();


    public static ins() {
        return super.ins() as mainHandle;
    }

    constructor() {
        super();
    }

    sendGetTuLongNotice() {
        let suc = (message) => {
            dataManager.ins().dao_notice = message.knife_tip;
        }

        let fail = () => {

        }
        this.http.sendRequest(Msg_Id.getConfigSet, {}, suc, fail);
    }

    /**
     * 无限看视频 记录
     * @param model_type 
     * @param ad_type 
     * model_type：
     * super_turnplate = 超级转盘;
     * lucky_turnplate = 幸运转盘;
     * offline_earnings = 离线收益 
     */
    sendWatchVideoRecode(model_type, ad_type, suc, err) {
        let param = {
            type: ad_type,
            create_time: new Date().getTime().toString(),
            reward_name: model_type,
        }
        this.http.sendRequest(Msg_Id.infinitePlayVideo, param, suc, err);
    }

    /**
     * 看视频奖励
     */
    sendVideoAward(param, suc, err) {
        this.http.sendRequest(Msg_Id.videoAward, param, suc, err);
    }
}
