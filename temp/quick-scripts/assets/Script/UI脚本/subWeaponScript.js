(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI脚本/subWeaponScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '699e9wYnYhOeJ1K4G+rxRYe', 'subWeaponScript', __filename);
// Script/UI脚本/subWeaponScript.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        UpgradeBg: cc.Node,
        attackCoinLabel: cc.Label,

        laserButton: cc.Button,
        grainButton: cc.Button,

        coinScript: require("coinScript")
    },

    initData: function initData() {
        this.flag = 0;
        this.coinData = cc.sys.localStorage.getItem('coinData'); // 获取金币数据
        this.mainPlaneData = JSON.parse(cc.sys.localStorage.getItem("mainPlaneObject")); // 获取飞机对象
        this.subWeapon = this.mainPlaneData.subWeapon;
        this.gunNameLabel = this.UpgradeBg.getChildByName("gunName").getComponent(cc.Label);
        this.attackLevelLabel = this.UpgradeBg.getChildByName("attackLabel").getComponent(cc.Label);
        this.attackNumberLabel = this.UpgradeBg.getChildByName("attackNumber").getComponent(cc.Label);
    },
    popUpgradeWindow: function popUpgradeWindow() {
        // 更新各种数值
        if (this.flag == 0) {
            this.setGrainData();
        }
        if (this.flag == 1) {
            this.setLaserData();
        }
        // 弹出升级窗口
        this.showUpgradeBg();
    },
    setGrainData: function setGrainData() {
        // 设置粒子枪数据
        this.gunNameLabel.string = '粒子枪';
        this.attackLevelLabel.string = "\u653B\u51FB\u529B [Lv" + this.subWeapon.grainGun.attackLevel + "]";
        this.attackNumberLabel.string = this.subWeapon.grainGun.attackNumber;
        this.attackCoinLabel.string = this.subWeapon.grainGun.attackCost;
        if (this.coinData >= this.subWeapon.grainGun.attackCost) {
            this.attackCoinLabel.node.color = cc.color(255, 255, 255, 255);
        } else {
            this.attackCoinLabel.node.color = cc.color(255, 0, 0, 255);
        }
    },
    setLaserData: function setLaserData() {
        // 设置镭射枪数据
        this.gunNameLabel.string = '镭射枪';
        this.attackLevelLabel.string = "\u653B\u51FB\u529B [Lv" + this.subWeapon.laserGun.attackLevel + "]";
        this.attackNumberLabel.string = this.subWeapon.laserGun.attackNumber;
        this.attackCoinLabel.string = this.subWeapon.laserGun.attackCost;
        if (this.coinData >= this.subWeapon.laserGun.attackCost) {
            this.attackCoinLabel.node.color = cc.color(255, 255, 255, 255);
        } else {
            this.attackCoinLabel.node.color = cc.color(255, 0, 0, 255);
        }
    },


    //更新副武器数据
    updateSubWeaponData: function updateSubWeaponData(properyName) {
        // 粒子枪攻击
        if (properyName == 'grain') {
            this.subWeapon.grainGun.attackLevel++;
            this.subWeapon.grainGun.attackNumber += 3; //每升一级加3
            if (this.subWeapon.grainGun.attackLevel % 5 == 1) {
                // 每升级5次额外加10
                this.subWeapon.grainGun.attackNumber += 10;
            }
            this.subWeapon.grainGun.attackCost = Math.floor(this.subWeapon.grainGun.attackCost * 2); //每次升级费用翻2倍
            this.setGrainData(); //更新数据
        }
        //  镭射枪攻击
        if (properyName == 'laser') {
            this.subWeapon.laserGun.attackLevel++;
            this.subWeapon.laserGun.attackNumber += 15; //每升一级加15
            if (this.subWeapon.laserGun.attackLevel % 5 == 1) {
                // 每升级5次额外加50
                this.subWeapon.laserGun.attackNumber += 50;
            }
            this.subWeapon.laserGun.attackCost = Math.floor(this.subWeapon.laserGun.attackCost * 2); //每次升级费用翻2倍 
            this.setLaserData(); //更新数据
        }
        this.mainPlaneData.subWeapon = this.subWeapon;
        cc.sys.localStorage.setItem("mainPlaneObject", JSON.stringify(this.mainPlaneData));
    },


    // 按键函数
    clickGrainButton: function clickGrainButton() {
        // 点击粒子枪的按钮
        this.flag = 0;
        this.popUpgradeWindow();
    },
    clickLaserButton: function clickLaserButton() {
        this.flag = 1;
        this.popUpgradeWindow();
    },

    // 点击升级按钮
    attackUpgradeBtn: function attackUpgradeBtn() {
        if (this.flag == 0) {
            // 粒子枪升级
            var money = Math.floor(this.coinData - this.subWeapon.grainGun.attackCost); // 不能出现小数
            if (money >= 0) {
                // 更新金钱
                this.coinData = money;
                cc.sys.localStorage.setItem("coinData", this.coinData); //把钱存储
                this.coinScript.init(); // 更新金钱标签
                // 更新副武器数值
                this.updateSubWeaponData('grain');
            }
        }
        if (this.flag == 1) {
            // 镭射枪升级
            var _money = Math.floor(this.coinData - this.subWeapon.laserGun.attackCost); // 不能出现小数
            if (_money >= 0) {
                // 更新金钱
                this.coinData = _money;
                cc.sys.localStorage.setItem("coinData", this.coinData); //把钱存储
                this.coinScript.init(); // 更新金钱标签
                // 更新副武器数值
                this.updateSubWeaponData('laser');
            }
        }
    },


    // onLoad () {},

    showIcon: function showIcon() {
        this.node.active = true;
    },
    hideIcon: function hideIcon() {
        this.node.active = false;
    },
    showUpgradeBg: function showUpgradeBg() {
        this.UpgradeBg.position = cc.v2(544, 416);
    },
    hideUpgradeBg: function hideUpgradeBg() {
        this.UpgradeBg.position = cc.v2(4000, 416); // 随意设的坐标，只要不让他显示在可见区域就行，不用node的active是因为active对性能影响较大
    }
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
        //# sourceMappingURL=subWeaponScript.js.map
        