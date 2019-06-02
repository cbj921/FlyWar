(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI脚本/buttonFunc.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bc7f8uCRM1OM6wtGwbUjsMj', 'buttonFunc', __filename);
// Script/UI脚本/buttonFunc.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        protectButton: require('protectScript'),
        powerButton: require('powerScript'),
        mainWeaponButton: require('mainWeaponScript'),
        subWeaponButton: require('subWeaponScript')
    },

    // 按键调用函数
    protectButtonClick: function protectButtonClick() {
        //
        this.powerButton.hideUpgradeBg();
        this.mainWeaponButton.hideUpgradeBg();
        this.subWeaponButton.hideUpgradeBg();
    },
    powerButtonClick: function powerButtonClick() {
        this.protectButton.hideUpgradeBg();
        //
        this.mainWeaponButton.hideUpgradeBg();
        this.subWeaponButton.hideUpgradeBg();
    },
    mainWeaponButtonClick: function mainWeaponButtonClick() {
        this.protectButton.hideUpgradeBg();
        this.powerButton.hideUpgradeBg();
        //
        this.subWeaponButton.hideUpgradeBg();
    },
    subWeaponButtonClick: function subWeaponButtonClick() {
        this.protectButton.hideUpgradeBg();
        this.powerButton.hideUpgradeBg();
        this.mainWeaponButton.hideUpgradeBg();
        //
    },
    onLoad: function onLoad() {}
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
        //# sourceMappingURL=buttonFunc.js.map
        