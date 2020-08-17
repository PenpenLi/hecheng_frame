

import userData from "./userData";
import petData from "./petData";

export class G_baseData {
    static userData: userData;
    static petData: petData;
    static loadBaseData() {
        this.userData = userData.ins();
        this.petData = petData.ins();
    }
}
