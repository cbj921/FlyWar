"use strict";
cc._RF.push(module, '96cf30yhrBC7K2PHHAB5/9F', 'heavyPlane');
// Script/enemyPrefab/heavyPlane.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        startBulletAttack: 0, // 子弹攻击力
        startImpactAttack: 0, // 撞击攻击力
        startHealth: 0, // 初始血量
        startBulletSpeed: 0, // 初始子弹速度
        bulletFre: 0, // 子弹频率

        moveVenticalDuration: 0,
        moveVenticalDistance: 0,

        healthBar: cc.ProgressBar,
        bulletPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();