(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/bullet/mainBullet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '648f5daZctKp7be8VsbKrGe', 'mainBullet', __filename);
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
        //# sourceMappingURL=mainBullet.js.map
        