(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/gameControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '378584tF+9DBoQV0s+3vuPE', 'gameControl', __filename);
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
        startButton: cc.Node,
        grainGunBtn: cc.Node,
        laserGunBtn: cc.Node,
        powerBar: cc.Node
    },

    init: function init() {
        this.showIcon();
        this.mainPlane.init();
        this.enemyControl.initEnemyData();
        this.enemyControl.init();
        this.strengthData = this.strengthScript.init(); // 获取体力数据
        this.musicFlag = 0; //音乐播放flag
    },
    initData: function initData() {
        this.getCollisionManager(); // 开启碰撞检测
        this.coinScript.init();
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
        this.coinScript.hideIcon();
        this.coinScript.closeCoinSelfGrow(); // 关闭金币自增长
        this.powerBar.active = true;
        this.grainGunBtn.active = true;
        this.laserGunBtn.active = true;
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
        this.powerBar.active = false;
        this.grainGunBtn.active = false;
        this.laserGunBtn.active = false;
    },
    hideUpgradeBg: function hideUpgradeBg() {
        this.protectButton.hideUpgradeBg();
        this.powerButton.hideUpgradeBg();
        this.mainWeaponButton.hideUpgradeBg();
        this.subWeaponButton.hideUpgradeBg();
    },
    failBack: function failBack() {
        // 通关失败后的回调函数
        this.mainPlane.init();
        this.enemyControl.popFailButton();
        cc.log('fail');
    },
    succeedBack: function succeedBack() {
        this.levelScript.updateLevelData();
        this.mainPlane.succeedEvent();
        this.init();
        cc.log('succeed');
    },
    musicButton: function musicButton() {
        if (this.musicFlag == 0) {
            this.musicFlag = 1;
            this.node.getComponent(cc.AudioSource).pause();
        } else {
            this.musicFlag = 0;
            this.node.getComponent(cc.AudioSource).play();
        }
    },
    onLoad: function onLoad() {
        //cc.sys.localStorage.removeItem('mainPlaneObject');
        this.initData();
        this.init();
        this.node.on("fail", this.failBack, this);
        this.node.on('succeed', this.succeedBack, this);
        //cc.sys.localStorage.removeItem('coinData');
        //cc.sys.localStorage.removeItem('UFOObject');
        //cc.sys.localStorage.removeItem('mainPlaneObject');
        //cc.sys.localStorage.removeItem('spacePlaneObject');
        //cc.sys.localStorage.removeItem('throwRobotObject');
    },
    update: function update(dt) {}
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
        //# sourceMappingURL=gameControl.js.map
        