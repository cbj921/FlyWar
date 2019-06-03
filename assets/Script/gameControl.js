
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
        grainGunBtn:cc.Node,
        laserGunBtn:cc.Node,
        powerBar:cc.Node,
    },


    init() {
        this.showIcon();
        this.mainPlane.init();
        this.enemyControl.initEnemyData();
        this.enemyControl.init();
        this.strengthData = this.strengthScript.init();// 获取体力数据
    },

    initData() {
        this.getCollisionManager();// 开启碰撞检测
        this.coinScript.init();
        this.mainPlane.initData();
        this.subWeaponButton.initData();
    },

    startGame() {
        if(this.strengthData>=5){
            this.hideIcon();
            this.hideUpgradeBg();
            this.enemyControl.startGame();
            this.mainPlane.startFly();
        }
    },

    getCollisionManager() {
        //获取碰撞检测系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
    },

    hideIcon() {
        this.startButton.active = false;
        this.protectButton.hideIcon();
        this.powerButton.hideIcon();
        this.mainWeaponButton.hideIcon();
        this.subWeaponButton.hideIcon();
        this.strengthScript.hideIcon();
        this.coinScript.closeCoinSelfGrow(); // 关闭金币自增长
        this.powerBar.active = true;
        this.grainGunBtn.active = true;
        this.laserGunBtn.active = true;
    },

    showIcon() {
        this.startButton.active = true;
        this.coinScript.init();
        this.coinScript.coinSelfGrow(); // 开启金币自增长
        this.strengthScript.init();
        this.strengthScript.strengthSelfGrow(); // 开启体力自增长
        this.strengthScript.opengetStrength();//要放在体力初始化的下面
        this.protectButton.showIcon();
        this.powerButton.showIcon();
        this.mainWeaponButton.showIcon();
        this.subWeaponButton.showIcon();
        this.levelScript.initLevelData();
        this.powerBar.active = false;
        this.grainGunBtn.active = false;
        this.laserGunBtn.active = false;
    },

    hideUpgradeBg() {
        this.protectButton.hideUpgradeBg();
        this.powerButton.hideUpgradeBg();
        this.mainWeaponButton.hideUpgradeBg();
        this.subWeaponButton.hideUpgradeBg();
    },

    failBack() {
        // 通关失败后的回调函数
        this.mainPlane.init();
        this.enemyControl.popFailButton();
        cc.log('fail');
    },
    succeedBack(){
        this.levelScript.updateLevelData();
        this.mainPlane.succeedEvent();
        this.init();
        cc.log('succeed');
    },

    // 按键调用到这里结束
    onLoad() {
        //cc.sys.localStorage.removeItem('mainPlaneObject');
        this.initData();
        this.init();
        this.node.on("fail", this.failBack, this);
        this.node.on('succeed',this.succeedBack,this);
        //cc.sys.localStorage.removeItem('coinData');
        //cc.sys.localStorage.removeItem('UFOObject');
        //cc.sys.localStorage.removeItem('mainPlaneObject');
        //cc.sys.localStorage.removeItem('spacePlaneObject');
        //cc.sys.localStorage.removeItem('lastTime');
    },

    update(dt) { },
});
