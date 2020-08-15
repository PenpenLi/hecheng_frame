// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import parMgr from "./parMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(parMgr)
    parNode: parMgr;

    xSpeed: number = 0;
    startPos: any;
    endPos;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.test();
    }

    test() {
        // let aNode = cc.find("A", this.node);
        // let bNode = cc.find("A/B", this.node); //-50
        // // let cc1 = this.node.convertToNodeSpaceAR(bNode.position)
        // // console.log("cccc", cc1)


        // let dNode = cc.find("C/D", this.node); //-100

        // let dWorldPos = dNode.convertToWorldSpaceAR(cc.v2(0));
        // console.log(dWorldPos, "+++++++")

        // console.log(bNode.convertToNodeSpaceAR(dWorldPos)); //-50


        let aNode = cc.find("A", this.node);
        let bNode = cc.find("B", this.node);

        let xSub = Math.abs(bNode.x - aNode.x);
        let ySub = Math.abs(bNode.y - aNode.y);

        let t = Math.floor(Math.sqrt(2 * ySub / 1000) * 100) / 100;
        let v = Math.floor(xSub / t * 100) / 100;

        console.log("---", t, v);
        this.startPos = aNode.position;
        this.endPos = bNode.position;
        this.xSpeed = v;
    }



    clickBtn() {
        this.parNode.playPar(this.xSpeed, this.startPos, this.endPos);
    }

    // update(dt) {
    //     this.node.x += this.xSpeed * dt;
    //     this.node.y -= (0.5 * 10 * dt * dt);
    // }

    // update (dt) {}
}
