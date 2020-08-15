import { Game } from "../../game/Game";

export class UtilFunction {

    /**
        * 当前时间距离过去的某个时间的时间差
        * return值： [是否经过一天(-1:目标时间至少是前一天的24点之前，!=-1:目标时间在当天的范围内，值等于时间差)，相隔多少秒]
        * @param time 目标时间(毫秒时间戳)
        */
    TimeDifference(time: number) {
        let _User_EndTime = time;
        if (_User_EndTime == null) {
            _User_EndTime = 1;
        }

        let timestamp = Date.parse(new Date().toString());
        timestamp = timestamp;

        let thistime = new Date(timestamp);
        let thistimearr = [thistime.getFullYear(), thistime.getMonth() + 1, thistime.getDay(), thistime.getHours(), thistime.getMinutes(), thistime.getSeconds()];
        //Game.Console.Log(thistime.getFullYear(), thistime.getMonth() + 1, thistime.getDay(), thistime.getHours(), thistime.getMinutes(), thistime.getSeconds())

        let lastEndGameTime = new Date(_User_EndTime)
        //Game.Console.Log(lastEndGameTime.getFullYear(), lastEndGameTime.getMonth() + 1, lastEndGameTime.getDay(), lastEndGameTime.getHours(), lastEndGameTime.getMinutes(), lastEndGameTime.getSeconds())
        let lastEndGameTimearr = [lastEndGameTime.getFullYear(), lastEndGameTime.getMonth() + 1, lastEndGameTime.getDay(), lastEndGameTime.getHours(), lastEndGameTime.getMinutes(), lastEndGameTime.getSeconds()];

        /** -1：经过了一天  |||  !=-1:在当天内，相隔多少秒*/
        let TimeDifference = -1;
        if (thistimearr[0] == lastEndGameTimearr[0] &&
            thistimearr[1] == lastEndGameTimearr[1] &&
            thistimearr[2] == lastEndGameTimearr[2]) {
            TimeDifference = parseInt(((timestamp - _User_EndTime) / 1000).toString());
        }
        /** 距离上次退出记录相隔多少秒 */
        let TrueTimeDifference = parseInt(((timestamp - _User_EndTime) / 1000).toString());

        return [TimeDifference, TrueTimeDifference];
    }

}