(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/bullet/throwBullet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0690fysN+FIFJE0t3Vxdbf4', 'throwBullet', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=throwBullet.js.map
        