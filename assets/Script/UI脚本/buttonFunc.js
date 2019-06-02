
cc.Class({
    extends: cc.Component,

    properties: {
        protectButton: require('protectScript'),
        powerButton: require('powerScript'),
        mainWeaponButton: require('mainWeaponScript'),
        subWeaponButton: require('subWeaponScript'),
    },

// 按键调用函数
    protectButtonClick(){
        //
        this.powerButton.hideUpgradeBg();
        this.mainWeaponButton.hideUpgradeBg();
        this.subWeaponButton.hideUpgradeBg();
    },
    powerButtonClick(){
        this.protectButton.hideUpgradeBg();
        //
        this.mainWeaponButton.hideUpgradeBg();
        this.subWeaponButton.hideUpgradeBg();
    },
    mainWeaponButtonClick(){
        this.protectButton.hideUpgradeBg();
        this.powerButton.hideUpgradeBg();
        //
        this.subWeaponButton.hideUpgradeBg();
    },
    subWeaponButtonClick(){
        this.protectButton.hideUpgradeBg();
        this.powerButton.hideUpgradeBg();
        this.mainWeaponButton.hideUpgradeBg();
        //
    },

    onLoad () {},



    // update (dt) {},
});
