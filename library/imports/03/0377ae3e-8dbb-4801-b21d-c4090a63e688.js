"use strict";
cc._RF.push(module, '0377a4+jbtIAbIdxAkKY+aI', 'spaceBullet');
// Script/bullet/spaceBullet.js

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