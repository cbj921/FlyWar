"use strict";
cc._RF.push(module, 'e7fc1Fv2ahHdIc6SXdcukf8', 'powerScript');
// Script/UI脚本/powerScript.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        UpgradeBg: cc.Node,
        coinLabel: cc.Label,

        coinScript: require('coinScript')
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

        var levelLabel = this.UpgradeBg.getChildByName("properyLabel").getComponent(cc.Label);
        var numberLabel = this.UpgradeBg.getChildByName("numberLabel").getComponent(cc.Label);

        levelLabel.string = '\u80FD\u6E90\u503C [Lv' + this.mainPlaneData.power.level + ']';
        numberLabel.string = this.mainPlaneData.power.number;
        this.coinLabel.string = this.mainPlaneData.power.cost;

        // 如果金钱比升级费用少字体就为红色
        if (this.coinData >= this.mainPlaneData.power.cost) {
            this.coinLabel.node.color = cc.color(255, 255, 255, 255);
        } else {
            this.coinLabel.node.color = cc.color(255, 0, 0, 255);
        }
    },


    // 这个是按键用的函数
    powerUpgradeBtn: function powerUpgradeBtn() {
        // 点击能源升级按钮
        var money = Math.floor(this.coinData - this.mainPlaneData.power.cost); // 不能出现小数
        if (money >= 0) {
            // 更新金钱
            this.coinData = money;
            cc.sys.localStorage.setItem("coinData", this.coinData); //把钱存储
            this.coinScript.init(); // 更新金钱标签
            // 更新战机数值
            this.updatePlaneData();
        }
    },
    updatePlaneData: function updatePlaneData() {
        this.mainPlaneData.power.level++;
        this.mainPlaneData.power.number += 15; //每升一级加15
        if (this.mainPlaneData.power.level % 10 == 1) {
            // 每升级10次额外加30
            this.mainPlaneData.power.number += 30;
        }
        this.mainPlaneData.power.cost = Math.floor(this.mainPlaneData.power.cost * 2); //每次升级费用翻2倍 
        cc.sys.localStorage.setItem("mainPlaneObject", JSON.stringify(this.mainPlaneData));
        this.getData("mainPlaneObject"); // 更新数值
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