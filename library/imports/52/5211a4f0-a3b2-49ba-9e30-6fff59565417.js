"use strict";
cc._RF.push(module, '5211aTwo7JJup4wb/9ZVlQX', 'protectScript');
// Script/UI脚本/protectScript.js

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

        levelLabel.string = '\u62A4\u76FE\u503C [Lv' + this.mainPlaneData.protect.level + ']';
        numberLabel.string = this.mainPlaneData.protect.number;
        this.coinLabel.string = this.mainPlaneData.protect.cost;

        // 如果金钱比升级费用少字体就为红色
        if (this.coinData >= this.mainPlaneData.protect.cost) {
            this.coinLabel.node.color = cc.color(255, 255, 255, 255);
        } else {
            this.coinLabel.node.color = cc.color(255, 0, 0, 255);
        }
    },


    // 这个是按键用的函数
    protectUpgradeBtn: function protectUpgradeBtn() {
        // 点击护盾升级按钮
        var money = Math.floor(this.coinData - this.mainPlaneData.protect.cost); // 不能出现小数
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
        this.mainPlaneData.protect.level++;
        this.mainPlaneData.protect.number += 20; //每升一级加20
        if (this.mainPlaneData.protect.level % 10 == 1) {
            // 每升级10次额外加100
            this.mainPlaneData.protect.number += 100;
        }
        this.mainPlaneData.protect.cost = Math.floor(this.mainPlaneData.protect.cost * 2); //每次升级费用翻2倍 
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