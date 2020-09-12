// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let out: cc.Color = new cc.Color(0, 0, 0, 0);
        let newC: cc.Color = out.fromHEX("893547");
        let newC2: cc.Color = this.myFromHex(out, 11011010001001101011);
        console.log("_______#############_", newC2)
    }

    myFromHex(out: cc.Color, hex: number): cc.Color {
        let r = ((hex >> 24)) / 255.0;
        let g = ((hex >> 16) & 0xff) / 255.0;
        let b = ((hex >> 8) & 0xff) / 255.0;
        let a = ((hex) & 0xff) / 255.0;
        console.log("-----", r, g, b, a);
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    // update (dt) {}
}
