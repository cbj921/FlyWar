"use strict";
cc._RF.push(module, '0690fysN+FIFJE0t3Vxdbf4', 'throwBullet');
// Script/bullet/throwBullet.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onCollisionEnter: function onCollisionEnter(other, self) {
        if (other.tag == 0) {
            this.node.destroy();
        }
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();