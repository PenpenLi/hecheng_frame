
import { LocalStorage } from "./LocalStorage";

export class Global_Var {

    /***存储数据 */
    public static setStorage(key: string, value) {
        LocalStorage.ins().setLocal(key, value);
    }

    /***读取数据 */
    public static getStorage(key: string, defaultValue?) {
        let info = LocalStorage.ins().getLocal(key, defaultValue);
        return info;
    }

    /**转换时间 */
    public static changeTimeToStr(secondTime: number): string {
        let gb = new Global_Var();
        let str_time: string = null;
        if (86400 < secondTime) {
            let day: number = Math.floor(secondTime / 86400);
            let hour: number = Math.floor((secondTime % 86400) / 3600);
            str_time = gb.addZone(day) + "天" + gb.addZone(hour) + "时";
        } else if (86400 > secondTime && secondTime > 3600) {
            let hour: number = Math.floor(secondTime / 3600);
            let min: number = Math.floor((secondTime % 3600) / 60);
            str_time = gb.addZone(hour) + "时" + gb.addZone(min) + "分";
        } else {
            let min: number = Math.floor(secondTime / 60);
            let sec: number = secondTime % 60;
            str_time = gb.addZone(min) + "分" + gb.addZone(sec) + "秒";
        }
        return str_time;
    }

    /**填零方法 */
    private addZone(num): string {
        let a = num.toString();
        if (a.length < 2) {
            a = "0" + a;
        }
        return a;
    }

    /****转换默认使用#进行填充* */

    /**把数组转换成字符串 */
    public static getStrFromArray(arr, joinStr = "#"): string {
        let str = arr.join(joinStr);
        return str;
    }

    /**把字符串转换成数组 */
    public static getArrayFromStr(str: string, arr: Array<number>, joinStr = "#") {
        let Array_str = str.split(joinStr);
        for (let i = 0; i < Array_str.length; i++) {
            arr[i] = Number(Array_str[i]);
        }
    }
}