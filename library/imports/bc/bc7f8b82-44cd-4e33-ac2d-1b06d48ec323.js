"use strict";
cc._RF.push(module, 'bc7f8uCRM1OM6wtGwbUjsMj', 'buttonFunc');
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