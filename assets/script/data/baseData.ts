

import userData from "./userData";
import petData from "./petData";
import tblData from "./tblData";

export class G_baseData {
    static userData: userData;
    static petData: petData;
    static tblData: tblData;
    static loadBaseData() {
        this.userData = userData.ins();
        this.petData = petData.ins();
        this.tblData = tblData.ins();
    }

    static loadTBlData() {
        let promise = this.tblData.loadTbl();
        return promise;
    }
}
