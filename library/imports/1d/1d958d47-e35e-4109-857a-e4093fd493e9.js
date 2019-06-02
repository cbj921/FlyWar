"use strict";
cc._RF.push(module, '1d9581H415BCYV65Ak/1JPp', 'waveRobotBullet');
// Script/bullet/waveRobotBullet.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onCollisionEnter: function onCollisionEnter(other, self) {
        if (other.tag == 0) {
            this.node.destroy();
        }
    },


    // onLoad () {},

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();