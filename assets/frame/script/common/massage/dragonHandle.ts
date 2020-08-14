import SingletonClass from "../base/SingletonClass"
import HTTP from "../http/http";
import { Msg_Id, I_Send_AllMutantDragon, I_Send_BuyMutantDragon, I_Send_OverDueMutantDragon, I_Send_MyMutantDragon } from "./msgId";

export default class dragonHandler extends SingletonClass {
    http: HTTP = new HTTP();


    public static ins() {
        return super.ins() as dragonHandler;
    }

    constructor() {
        super();
    }

    sendGetAllMutantDragon(params: I_Send_AllMutantDragon, funSuc, funErr) {
        this.http.sendRequest(Msg_Id.getAllMutantDragon, params, funSuc, funErr);
    }

    sendGetMyMutantDragon(params: I_Send_MyMutantDragon, funSuc, funErr) {
        this.http.sendRequest(Msg_Id.getMyMutantDragon, params, funSuc, funErr);
    }

    sendOverDueDragon(params: I_Send_OverDueMutantDragon, funSuc, funErr) {
        this.http.sendRequest(Msg_Id.overDueDragon, params, funSuc, funErr);
    }

    sendBuyMutantDragon(params: I_Send_BuyMutantDragon, funSuc, funErr) {
        this.http.sendRequest(Msg_Id.overDueDragon, params, funSuc, funErr);
    }

}
