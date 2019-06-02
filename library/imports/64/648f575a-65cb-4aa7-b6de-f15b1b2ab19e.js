"use strict";
cc._RF.push(module, '648f5daZctKp7be8VsbKrGe', 'mainBullet');
// Script/bullet/mainBullet.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onCollisionEnter: function onCollisionEnter(other, self) {
        this.node.destroy();
    }

    // onLoad () {},


    // update (dt) {},
});

cc._RF.pop();