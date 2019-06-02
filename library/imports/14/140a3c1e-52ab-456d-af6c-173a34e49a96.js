"use strict";
cc._RF.push(module, '140a3weUqtFba9sFzo05JqW', 'UFObullet');
// Script/bullet/UFObullet.js

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