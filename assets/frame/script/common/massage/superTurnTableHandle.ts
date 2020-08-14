import SingletonClass from "../base/SingletonClass"
import HTTP from "../http/http";
import { Msg_Id, I_Send_UseSuperTurnTable, I_Send_GetSuperTurnTable, I_Send_getSuperTurnTableChance } from "./msgId";
import dataManager from "../../game/dataManager";

export default class superTurnTableHandle extends SingletonClass {
    http: HTTP = new HTTP();
    sendVideo: boolean = true;

    public static ins() {
        return super.ins() as superTurnTableHandle;
    }

    constructor() {
        super();
    }

    sendGetSuperTurnTable() {
        let suc = (message) => {
            message.sort((a, b) => {
                return Number(a.id) - Number(b.id);
            })
            dataManager.ins().superTurnTableAwards = message;
            console.log("e3333", message)
        }
        let fail = () => {

        }
        this.http.sendRequest(Msg_Id.getSuperTurnTable, {}, suc, fail);
    }

    sendUseSuperTurnTable(params: I_Send_UseSuperTurnTable, funSuc, funErr) {
        this.http.sendRequest(Msg_Id.useSuperTurnTable, params, funSuc, funErr);
    }

    sendGetSuperTurnTableChance(params: I_Send_getSuperTurnTableChance, funSuc, funErr) {
        this.http.sendRequest(Msg_Id.getSuperTurnTableChance, params, funSuc, funErr);
    }
}
