(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI脚本/mainWeaponScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1ff34Y211xKdrXtp1khbMFv', 'mainWeaponScript', __filename);
// Script/UI脚本/mainWeaponScript.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        UpgradeBg: cc.Node,
        attackCoinLabel: cc.Label,
        speedCoinLabel: cc.Label,

        coinScript: require("coinScript")
    },

    popUpgradeWindow: function popUpgradeWindow() {
        // 更新各种数值
        this.getData("mainPlaneObject");
        // 弹出升级窗口
        this.showUpgradeBg();
    },


    /**
     * @description: 更新数据
     * @param {string} objectName:传入需要获取到数据的对象名
     * @return: 
     */
    getData: function getData(objectName) {
        this.coinData = cc.sys.localStorage.getItem('coinData');
        this.mainPlaneData = JSON.parse(cc.sys.localStorage.getItem(objectName));

        var attackLabel = this.UpgradeBg.getChildByName("attackLabel").getComponent(cc.Label);
        var attackNumber = this.UpgradeBg.getChildByName("attackNumber").getComponent(cc.Label);

        var speedLabel = this.UpgradeBg.getChildByName("speedLabel").getComponent(cc.Label);
        var speedNumber = this.UpgradeBg.getChildByName("speedNumber").getComponent(cc.Label);

        attackLabel.string = "\u653B\u51FB\u529B [Lv" + this.mainPlaneData.mainWeapon.attackLevel + "]";
        speedLabel.string = "\u901F\u5EA6\u503C [Lv" + this.mainPlaneData.mainWeapon.speedLevel + "]";

        attackNumber.string = this.mainPlaneData.mainWeapon.attackNumber;
        speedNumber.string = this.mainPlaneData.mainWeapon.speedNumber / 10; // 除10是因为用小数会有精度问题，所以speed初始为30，而不是3

        this.attackCoinLabel.string = this.mainPlaneData.mainWeapon.attackCost;
        this.speedCoinLabel.string = this.mainPlaneData.mainWeapon.speedCost;

        // 如果金钱比升级费用少字体就为红色
        if (this.coinData >= this.mainPlaneData.mainWeapon.attackCost) {
            this.attackCoinLabel.node.color = cc.color(255, 255, 255, 255);
        } else {
            this.attackCoinLabel.node.color = cc.color(255, 0, 0, 255);
        }
        if (this.coinData >= this.mainPlaneData.mainWeapon.speedCost) {
            this.speedCoinLabel.node.color = cc.color(255, 255, 255, 255);
        } else {
            this.speedCoinLabel.node.color = cc.color(255, 0, 0, 255);
        }
    },


    // 这个是按键用的函数
    attackUpgradeBtn: function attackUpgradeBtn() {
        // 点击攻击力升级按钮
        var money = Math.floor(this.coinData - this.mainPlaneData.mainWeapon.attackCost); // 不能出现小数
        if (money >= 0) {
            // 更新金钱
            this.coinData = money;
            cc.sys.localStorage.setItem("coinData", this.coinData); //把钱存储
            this.coinScript.init(); // 更新金钱标签
            // 更新战机数值
            this.updatePlaneData('attack');
        }
    },
    speedUpgradeBtn: function speedUpgradeBtn() {
        // 点击攻速升级按钮
        var money = Math.floor(this.coinData - this.mainPlaneData.mainWeapon.speedCost); // 不能出现小数
        if (money >= 0) {
            // 更新金钱
            this.coinData = money;
            cc.sys.localStorage.setItem("coinData", this.coinData); //把钱存储
            this.coinScript.init(); // 更新金钱标签
            // 更新战机数值
            this.updatePlaneData('speed');
        }
    },


    // 更新飞机数据
    updatePlaneData: function updatePlaneData(properyName) {
        // 攻击
        if (properyName == 'attack') {
            this.mainPlaneData.mainWeapon.attackLevel++;
            this.mainPlaneData.mainWeapon.attackNumber += 5; //每升一级加5
            if (this.mainPlaneData.mainWeapon.attackLevel % 10 == 1) {
                // 每升级10次额外加50
                this.mainPlaneData.mainWeapon.attackNumber += 50;
            }
            this.mainPlaneData.mainWeapon.attackCost = Math.floor(this.mainPlaneData.mainWeapon.attackCost * 2); //每次升级费用翻2倍 
            cc.sys.localStorage.setItem("mainPlaneObject", JSON.stringify(this.mainPlaneData));
            this.getData("mainPlaneObject"); // 更新数值
        }
        //  速度
        if (properyName == 'speed') {
            this.mainPlaneData.mainWeapon.speedLevel++;
            this.mainPlaneData.mainWeapon.speedNumber += 2; //每升一级加2
            if (this.mainPlaneData.mainWeapon.speedLevel % 10 == 1) {
                // 每升级10次额外加3
                this.mainPlaneData.mainWeapon.speedNumber += 30;
            }

            this.mainPlaneData.mainWeapon.speedCost = Math.floor(this.mainPlaneData.mainWeapon.speedCost * 2); //每次升级费用翻2倍 

            cc.sys.localStorage.setItem("mainPlaneObject", JSON.stringify(this.mainPlaneData));
            this.getData("mainPlaneObject"); // 更新数值
        }
    },
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
        //# sourceMappingURL=mainWeaponScript.js.map
        