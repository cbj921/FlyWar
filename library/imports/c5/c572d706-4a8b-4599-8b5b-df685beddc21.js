"use strict";
cc._RF.push(module, 'c572dcGSotFmYtb32hb7dwh', 'grainBullet');
// Script/bullet/grainBullet.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onCollisionEnter: function onCollisionEnter(other, self) {
        this.node.destroy();
    },


    // onLoad () {},

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();