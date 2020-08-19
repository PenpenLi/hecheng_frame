
/**
 * @data 2020/8/19 待处理
 * 说明:目前bigVal没有对负数进行兼容，负数可能会出现错误！！！！！！
 * 但是目前项目所有数据都是按正数进行的，后续如果要有负数，需要优化此脚本！！！！
 */

 //TODO 需要兼容负数
export default class BigVal {
    Num: string = "0";
    private Negative: boolean = false;

    constructor(num: string, negative: boolean = false) {
        if (num != "" && num.slice(0, 1) != "-") {
            this.Num = num;
            this.Negative = negative;
        } else {
            this.Num = "0";
            this.Negative = negative;
        }
    }
    /**加 */
    public static Add(a, b) {
        let bigval = null;
        if (!a.Negative && !b.Negative) {
            bigval = new BigVal(BigVal.AddStr(a.Num, b.Num));
        } else if (!a.Negative && b.Negative) {
            let result = BigVal.SubStr(a.Num, b.Num);
            bigval = new BigVal(result.Num, result.Negative);
        } else if (a.Negative && !b.Negative) {
            let result = BigVal.SubStr(b.Num, a.Num);
            bigval = new BigVal(result.Num, result.Negative);
        } else if (a.Negative && b.Negative) {
            bigval = new BigVal(BigVal.AddStr(a.Num, b.Num), true);
        }
        return bigval;
    }
    /**减 */
    public static Sub(a, b) {
        let bigval = null;
        if (!a.Negative && !b.Negative) {
            let result = BigVal.SubStr(a.Num, b.Num);
            bigval = new BigVal(result.Num, result.Negative);
        } else if (!a.Negative && b.Negative) {
            let n = false;
            let num = BigVal.AddStr(a.Num, b.Num);
            bigval = new BigVal(num, n);
        } else if (a.Negative && !b.Negative) {
            bigval = new BigVal(BigVal.AddStr(a.Num, b.Num), true);
        } else if (a.Negative && b.Negative) {
            let result = BigVal.SubStr(b.Num, a.Num);
            bigval = new BigVal(result.Num, result.Negative);
        }
        return bigval;
    }
    /**乘 */
    public static Mul(a, b) {
        let bigval = null;
        if (a.Negative == b.Negative) {
            let num = BigVal.MultStr(a.Num, b.Num);
            bigval = new BigVal(num, false);
        } else {
            let num = BigVal.MultStr(a.Num, b.Num);
            bigval = new BigVal(num, true);
        }
        return bigval;
    }
    /**除 */
    public static Dev(a, b) {
        let bigval = null;
        if (a.Negative == b.Negative) {
            let num = BigVal.DevStr(a.Num, b.Num);
            bigval = new BigVal(num, false);
        } else {
            let num = BigVal.DevStr(a.Num, b.Num);
            bigval = new BigVal(num, true);
        }
        return bigval;

    }
    private static isBigger(a, b) {
        //a正b正
        if (!a.Negative && !b.Negative) {
            if (a.Num == b.Num) {
                return true;
            } else {
                return BigVal.isBiggerStr(a.Num, b.Num);
            }
        }
        //a正b负
        else if (!a.Negative && b.Negative) {
            return true;
        }
        //a负b正
        else if (a.Negative && !b.Negative) {
            return false;
        }
        //a负b负
        else if (a.Negative && b.Negative) {
            if (a.Num == b.Num) {
                return true;
            } else {
                return !BigVal.isBiggerStr(a.Num, b.Num);
            }
        }
        return false;
    }
    /**比较大小 */
    public static isBiggerEqual(a, b) {
        if (a == b) {
            return true;
        } else {
            return BigVal.isBigger(a, b);
        }
    }
    private static AddStr(numA, numB) {
        let aN = "";
        let bN = "";
        let result = "";
        let c = 0;
        let memorize = 0;
        if (numA.length > numB.length) {
            aN = numA;
            bN = numB;
        } else {
            aN = numB;
            bN = numA;
        }
        for (let x = aN.length - 1; x >= 0; x--) {
            if (x - (aN.length - bN.length) >= 0) {
                c = parseInt("" + aN[x]) + parseInt("" + bN[x - (aN.length - bN.length)]) + memorize;
            } else {
                c = parseInt("" + aN[x]) + memorize;
            }
            if (x > 0) {
                memorize = parseInt(String(c / 10));
                c = parseInt(String(c % 10));
            }
            //console.log(c,result);
            result = "" + c + result;
        }
        return result;
    }
    private static SubStr(numA, numB) {
        let aN = "";
        let bN = "";
        let result = "";
        let Num = "";
        let zeros = 0;
        let negative = false;
        let c = 0;
        let memorize = 0;
        if (numA.length > numB.length) {
            aN = numA;
            bN = numB;
        } else if (numA.length == numB.length) {
            for (let x = 0; x < numA.length; x++) {
                if (parseInt("" + numA[x]) == parseInt("" + numB[x])) {
                    aN = numA;
                    bN = numB;
                    if (x == numA.length - 1) {
                        return {
                            Num: "0",
                            Negative: false
                        }
                    }

                    if (x < numA.length - 1) {
                        zeros++;
                    }
                } else if (parseInt("" + numA[x]) > parseInt("" + numB[x])) {
                    if (x < numA.length - 1) {
                        zeros++;
                    }

                    aN = numA;
                    bN = numB;
                    x = numA.length;
                } else if (parseInt("" + numA[x]) < parseInt("" + numB[x])) {
                    if (x < numA.length - 1) {
                        zeros++;
                    }

                    aN = numB;
                    bN = numA;
                    negative = true;
                    x = numA.length;
                }
            }
        } else {
            aN = numB;
            bN = numA;
            negative = true;
        }
        for (let x = aN.length - 1; x >= 0; x--) {

            if (x - (aN.length - bN.length) >= 0) {
                c = parseInt("" + aN[x]) - parseInt("" + bN[x - (aN.length - bN.length)]) + memorize;
                if (c < 0) {
                    c += 10;
                    memorize = -1;
                } else {
                    memorize = 0;
                }
            } else {
                c = parseInt("" + aN[x]) + memorize;
                if (c < 0) {
                    c += 10;
                    memorize = -1;
                } else {
                    memorize = 0;
                }
            }

            if (result.length <= aN.length - zeros) {
                result = "" + c.toString() + result;
            }
        }
        while (result.length > 1 && result.startsWith("0")) {
            result = result.substring(1, result.length);
        }
        //Str = result;
        return {
            Num: result,
            Negative: negative
        }
    }
    private static MultStr(numA, numB) {
        let result = "";
        for (let a = numA.length - 1; a >= 0; a--) {
            for (let b = numB.length - 1; b >= 0; b--) {
                let c = parseInt(numB[b] + "") * parseInt(numA[a] + "");
                let Count0 = (numB.length - 1 - b) + (numA.length - 1 - a);
                let num = c.toString();
                for (let i = 0; i < Count0; ++i) {
                    num += "0";
                }
                result = BigVal.AddStr(result, num);
            }
        }
        return result;
    }
    private static DevStr(numA, numB) {
        if (BigVal.isBiggerStr(numB, numA)) {
            return "0";
        } else if (numA == numB) {
            return "1";
        } else if (numB == "1") {
            return numA;
        } else if (numA == "0" || numB == "0") {
            return "0";
        }
        let result = "";
        let devide = numB;
        let smallerA = "";
        for (let x = 0; x < numA.length; x++) {
            smallerA += numA[x];
            smallerA = BigVal.RemoveZero(smallerA);
            if (BigVal.isBiggerStr(smallerA, devide)) {
                for (let i = 0; i < 11; i++) {
                    if (BigVal.isBiggerEqualStr(smallerA, devide)) {
                        devide = BigVal.AddStr(devide, numB);
                    } else {
                        devide = BigVal.SubStr(devide, numB).Num;
                        smallerA = BigVal.SubStr(smallerA, devide).Num;
                        result += "" + parseInt(String(i % 10));
                        //i = 12;

                        devide = numB;
                        break;
                    }
                }
            } else if (smallerA == devide) {
                smallerA = "0";
                result += "1";
                devide = numB;
            } else {
                if (result.length > 0) {
                    result += "0";
                }
                devide = numB;
            }
        }
        return result;
    }
    private static RemoveZero(str) {
        let result = "";
        let start = false;
        for (let i = 0; i < str.length; i++) {
            if (str[i] != "0") {
                start = true;
            }
            if (start) {
                result += str[i];
            }
        }
        if (!start) {
            result = "0";
        }
        return result;
    }
    private static isBiggerStr(numA, numB) {
        let output = false;
        if (numA.length > numB.length) {
            output = true;
        } else if (numA.length == numB.length) {
            for (let x = 0; x < numA.length; x++) {
                if (parseInt("" + numA[x]) > parseInt("" + numB[x])) {
                    output = true;
                    x = numA.length;
                } else if (parseInt("" + numA[x]) < parseInt("" + numB[x])) {
                    output = false;
                    x = numA.length;
                } else {
                    output = false;
                }
            }
        } else {
            output = false;
        }
        return output;
    }
    private static isBiggerEqualStr(numA, numB) {
        if (numA == numB) {
            return true;
        }
        return BigVal.isBiggerStr(numA, numB);
    }
    /**声明一个单个金币的的方法*/
    geteveryStr() {
        let x = this.Num;
        if (x.length < 4) {
            return x;
        } else if (x.length < 7) {
            if (x.slice(x.length - 3, x.length - 1) == "00") {
                return x.slice(0, x.length - 3) + "k";
            }
            return x.slice(0, x.length - 3) + '.' + x.slice(x.length - 3, x.length - 1) + 'k';

        } else if (x.length < 10) {
            if (x.slice(x.length - 6, x.length - 4) == "00") {
                return x.slice(0, x.length - 6) + "m";
            }
            return x.slice(0, x.length - 6) + '.' + x.slice(x.length - 6, x.length - 4) + 'm';
        } else if (x.length < 13) {
            if (x.slice(x.length - 9, x.length - 7) == "00") {
                return x.slice(0, x.length - 9) + "b";
            }
            return x.slice(0, x.length - 9) + '.' + x.slice(x.length - 9, x.length - 7) + 'b';
        } else if (x.length < 16) {
            if (x.slice(x.length - 12, x.length - 10) == "00") {
                return x.slice(0, x.length - 12) + "t";
            }
            return x.slice(0, x.length - 12) + '.' + x.slice(x.length - 12, x.length - 10) + 't';
        } else if (x.length < 19) {
            if (x.slice(x.length - 15, x.length - 13) == "00") {
                return x.slice(0, x.length - 15) + "a";
            }
            return x.slice(0, x.length - 15) + '.' + x.slice(x.length - 15, x.length - 13) + 'a';
        } else if (x.length < 22) {
            if (x.slice(x.length - 18, x.length - 16) == "00") {
                return x.slice(0, x.length - 18) + "aa";
            }
            return x.slice(0, x.length - 18) + '.' + x.slice(x.length - 18, x.length - 16) + 'aa';
        } else {
            return x.slice(0, x.length - 18) + 'aa';
        }
    }

    /**总金币的变换 */
    getTotalStr() {
        let x = this.Num;
        if (x.length < 4) {
            return x;
        } else if (x.length < 9) {
            if (x.slice(x.length - 3, x.length - 2) == "0") {
                return x.slice(0, x.length - 3) + "k";
            }
            return x.slice(0, x.length - 3) + '.' + x.slice(x.length - 3, x.length - 2) + 'k';

        } else if (x.length < 12) {
            if (x.slice(x.length - 6, x.length - 5) == "0") {
                return x.slice(0, x.length - 6) + "m";
            }
            return x.slice(0, x.length - 6) + '.' + x.slice(x.length - 6, x.length - 5) + 'm';
        } else if (x.length < 15) {
            if (x.slice(x.length - 9, x.length - 8) == "0") {
                return x.slice(0, x.length - 9) + "b";
            }
            return x.slice(0, x.length - 9) + '.' + x.slice(x.length - 9, x.length - 8) + 'b';
        } else if (x.length < 18) {
            if (x.slice(x.length - 12, x.length - 11) == "0") {
                return x.slice(0, x.length - 12) + "t";
            }
            return x.slice(0, x.length - 12) + '.' + x.slice(x.length - 12, x.length - 11) + 't';
        } else if (x.length < 21) {
            if (x.slice(x.length - 15, x.length - 14) == "0") {
                return x.slice(0, x.length - 15) + "a";
            }
            return x.slice(0, x.length - 15) + '.' + x.slice(x.length - 15, x.length - 14) + 'a';
        } else if (x.length < 24) {
            if (x.slice(x.length - 18, x.length - 17) == "0") {
                return x.slice(0, x.length - 18) + "aa";
            }
            return x.slice(0, x.length - 18) + '.' + x.slice(x.length - 18, x.length - 17) + 'aa';
        } else if (x.length < 27) {
            if (x.slice(x.length - 21, x.length - 20) == "0") {
                return x.slice(0, x.length - 21) + "aaa";
            }
            return x.slice(0, x.length - 21) + '.' + x.slice(x.length - 21, x.length - 20) + 'aaa';
        } else {
            return x.slice(0, 3) + "aaa...";
        }

    }
};
