import { GameType, Game } from "../../game/Game";

export class Console {

    isTest: GameType = GameType.OFFICIAL;

    GetGameType() {
        if (window.UrlManager.GameType == 'TEST') {
            this.isTest = GameType.TEST;
        }
        else if (window.UrlManager.GameType == 'OFFICIAL') {
            this.isTest = GameType.OFFICIAL;
        }
    }

    Log(...msg) {
        if (this.isTest === GameType.TEST) {
            if (cc.sys.isBrowser) {
                console.log(msg);
            }
        }
    }

}