"use strict";
cc._RF.push(module, '378584tF+9DBoQV0s+3vuPE', 'gameControl');
// Script/gameControl.js

"use strict";

// 储存数据的键值：
//  “protectObject” : 护盾的数值
//  “powerObject”： 能源的数值
//  “mainWeaponObject”： 主武器的数值


cc.Class({
    extends: cc.Component,

    properties: {
        coinScript: require("coinScript"),
        strengthScript: require("strengthScript"),
        protectButton: require('protectScript'),
        powerButton: require('powerScript'),
        mainWeaponButton: require('mainWeaponScript'),
        subWeaponButton: require('subWeaponScript'),
        mainPlane: require("mainPlane"),
        enemyControl: require('enemyControl'),
        levelScript: require('levelScript'),
        startButton: cc.Node
    },

    init: function init() {
        this.showIcon();
        this.mainPlane.init();
        this.enemyControl.initEnemyData();
        this.enemyControl.init();
        this.strengthData = this.strengthScript.init(); // 获取体力数据
    },
    initData: function initData() {
        this.getCollisionManager(); // 开启碰撞检测
        this.mainPlane.initData();
        this.subWeaponButton.initData();
    },
    startGame: function startGame() {
        if (this.strengthData >= 5) {
            this.hideIcon();
            this.hideUpgradeBg();
            this.enemyControl.startGame();
            this.mainPlane.startFly();
        }
    },
    getCollisionManager: function getCollisionManager() {
        //获取碰撞检测系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
    },
    hideIcon: function hideIcon() {
        this.startButton.active = false;
        this.protectButton.hideIcon();
        this.powerButton.hideIcon();
        this.mainWeaponButton.hideIcon();
        this.subWeaponButton.hideIcon();
        this.strengthScript.hideIcon();
        this.coinScript.closeCoinSelfGrow(); // 关闭金币自增长
    },
    showIcon: function showIcon() {
        this.startButton.active = true;
        this.coinScript.init();
        this.coinScript.coinSelfGrow(); // 开启金币自增长
        this.strengthScript.init();
        this.strengthScript.strengthSelfGrow(); // 开启体力自增长
        this.strengthScript.opengetStrength(); //要放在体力初始化的下面
        this.protectButton.showIcon();
        this.powerButton.showIcon();
        this.mainWeaponButton.showIcon();
        this.subWeaponButton.showIcon();
        this.levelScript.initLevelData();
    },
    hideUpgradeBg: function hideUpgradeBg() {
        this.protectButton.hideUpgradeBg();
        this.powerButton.hideUpgradeBg();
        this.mainWeaponButton.hideUpgradeBg();
        this.subWeaponButton.hideUpgradeBg();
    },
    failBack: function failBack() {
        // 通关失败后的回调函数
        this.init();
        this.enemyControl.clearAllEnemy();
        cc.log("fail");
    },


    // 按键调用到这里结束
    onLoad: function onLoad() {
        //cc.sys.localStorage.removeItem('mainPlaneObject');
        this.initData();
        this.init();
        this.node.on("fail", this.failBack, this);
        //cc.sys.localStorage.removeItem('coinData');
        //cc.sys.localStorage.removeItem('UFOObject');
        //cc.sys.localStorage.removeItem('mainPlaneObject');
        //cc.sys.localStorage.removeItem('spacePlaneObject');
        //cc.sys.localStorage.removeItem('lastTime');
    },
    update: function update(dt) {}
});

cc._RF.pop();