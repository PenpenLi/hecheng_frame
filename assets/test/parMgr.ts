// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class parMgr extends cc.Component {

    @property(cc.ParticleSystem)
    par: cc.ParticleSystem = null;
    // LIFE-CYCLE CALLBACKS:
    xSpeed: number = 0;
    endPos = 0;
    isStop = true;
    dt = 0;
    startPos;
    onLoad() {
        this.par
    }

    start() {

    }

    playPar(xSpeed, startPos, endPos) {
        this.xSpeed = xSpeed;
        this.startPos = startPos;
        this.endPos = endPos;

        this.node.position = startPos;
        this.isStop = false;
        this.par.resetSystem();
        this.node.active = true;

        let end = cc.v2(this.endPos);


        // let tween = cc.tween().(bezierTo)

        let btn = cc.find("Canvas/btn")

        let middle = cc.v2(btn.position);
        let bezier = [cc.v2(this.startPos), middle, cc.v2(this.endPos)]
        var bezierTo = cc.bezierTo(1, bezier);
        // let tween = cc.tween().parallel(bezierTo)
        cc.tween(this.node).then(bezierTo).start();
        // this.node.runAction(bezierTo);
    }


    // update(dt) {
    //     if (this.isStop) return;
    //     this.dt += dt;
    //     this.node.x = this.startPos.x - this.xSpeed * this.dt;
    //     this.node.y = this.startPos.y - (0.5 * 1000 * this.dt * this.dt);

    //     if (this.node.y < this.endPos) {
    //         this.par.stopSystem();
    //         this.isStop = true;
    //         this.dt = 0;
    //     }
    // }
    // update (dt) {}
}
