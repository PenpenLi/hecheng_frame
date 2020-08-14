import SingletonClass from "../base/SingletonClass"
import dragonHandle from "./dragonHandle"
import mainHandle from "./mainHandle";
import superTurnTableHandle from "./superTurnTableHandle";

export default class baseHandle extends SingletonClass {

    _mainHandle: mainHandle;
    _dragonHandle: dragonHandle;
    _superTurnTableHandle: superTurnTableHandle;
    public static ins() {
        return super.ins() as baseHandle;
    }

    constructor() {
        super();
        this._mainHandle = mainHandle.ins();
        this._dragonHandle = dragonHandle.ins();
        this._superTurnTableHandle = superTurnTableHandle.ins();
    }

}
