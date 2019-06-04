(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/enemyControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fdaafeIe7tOp5Tf57lqS0nX', 'enemyControl', __filename);
// Script/enemyControl.js

'use strict';

var ENEMYTYPE_1 = ['UFO', 'rocket'];
var ENEMYTYPE_2 = ['UFO', 'rocket', 'waveRobot', 'throwRobot'];
var ENEMYTYPE_3 = ['UFO', 'rocket', 'waveRobot', 'throwRobot', 'spacePlane', 'heavyWaterPlane'];

cc.Class({
    extends: cc.Component,

    properties: {
        UFOPrefab: cc.Prefab,
        rocketPrefab: cc.Prefab,
        waveRobotPrefab: cc.Prefab,
        throwRobotPrefab: cc.Prefab,
        spacePlanePrefab: cc.Prefab,
        heavyWaterPlanePrefab: cc.Prefab,

        enemyNumberBar: cc.ProgressBar,
        failButton: cc.Node
    },

    initLevelData: function initLevelData() {
        var levelData = JSON.parse(cc.sys.localStorage.getItem("levelData")); // 获取全局对象
        return levelData;
    },
    init: function init() {
        this.levelData = this.initLevelData(); // 获得关卡数据
        // 为什么makeDoneFlag 为 -1 ？？？
        this.makeDoneFlag = -1; // 有点奇怪初始值为-1，这个变量为标志位，当它的值等于敌人的数量时，说明敌人的生成已经完成
        this.enemyArray = [];
        this.failButton.active = false; // 初始让失败按钮不可见
        this.enemyNumberBar.node.active = false; //初始让敌人条不可见
    },
    startGame: function startGame() {
        var _this = this;

        this.gameState = 1; // 游戏开始的标记
        var enemyNumber = this.levelData.enemyNumber; // 获得敌人数量
        this.remainEnemy = this.levelData.enemyNumber; // 让剩余敌人的变量等于初始人数
        /********************************************/
        /*this.UFOTotalNumber = Math.floor(this.levelData.enemyNumber * this.levelData.enmeyProportion.UFOProportion);//生成总的UFO数量
        this.makeUFOEnemyNumber = 0; // 这个用来计数生成的UFO数量
         this.rocketTotalNumber = Math.floor(this.levelData.enemyNumber * this.levelData.enmeyProportion.rocketProportion);//生成总的rocket数量
        this.makeRocketEnemyNumber = 0; // 这个用来计数生成的rocket数量
         this.waveRobotTotalNumber = Math.floor(this.levelData.enemyNumber * this.levelData.enmeyProportion.waveRobotProportion);//生成总的wave数量
        this.makeWaveRobotEnemyNumber = 0; // 这个用来计数生成的wave数量
         this.spacePlaneTotalNumber = Math.floor(this.levelData.enemyNumber * this.levelData.enmeyProportion.spacePlaneProportion);
        this.makeSpacePlaneEnemyNumber = 0;
         this.throwRobotTotalNumber = Math.floor(this.levelData.enemyNumber * this.levelData.enmeyProportion.throwRobotProportion);
        this.makeThrowRobotEnemyNumber = 0;
         this.heavyPlaneTotalNumber = Math.floor(this.levelData.enemyNumber * this.levelData.enmeyProportion.heavyPlaneProportion);
        this.makeHeavyPlaneEnemyNumber = 0;*/
        /********************************************/
        ///以下用创建敌人函数代替
        this.makeEnemy = function () {
            var enemyFlag = _this.randomEnemy(); //获取到随机生成的敌人

            if (enemyFlag == 'UFO') {
                _this.creatUFOEnemy();
                _this.makeDoneFlag++;
            }
            if (enemyFlag == 'rocket') {
                _this.creatRocketEnemy();
                _this.makeDoneFlag++;
            }
            if (enemyFlag == 'waveRobot') {
                _this.creatWaveRobotEnemy();
                _this.makeDoneFlag++;
            }
            if (enemyFlag == 'spacePlane') {
                _this.creatSpacePlaneEnemy();
                _this.makeDoneFlag++;
            }
            if (enemyFlag == 'throwRobot') {
                _this.creatThrowRobotEnemy();
                _this.makeDoneFlag++;
            }
            if (enemyFlag == 'heavyWaterPlane') {
                _this.creatHeavyWaterPlaneEnemy();
                _this.makeDoneFlag++;
            }
            cc.log(enemyFlag);
        };
        this.schedule(this.makeEnemy, 2, enemyNumber);
        this.enemyNumberBar.node.active = true; //开始游戏后敌人条可见
    },
    randomEnemy: function randomEnemy() {
        var enemyFlag = null;
        if (this.levelData.level <= 5) {
            var randomNumber = Math.floor(Math.random() * ENEMYTYPE_1.length);
            enemyFlag = ENEMYTYPE_1[randomNumber];
        }
        if (this.levelData.level > 5 && this.levelData.level <= 10) {
            var _randomNumber = Math.floor(Math.random() * ENEMYTYPE_2.length);
            enemyFlag = ENEMYTYPE_2[_randomNumber];
        }
        if (this.levelData.level > 10) {
            var _randomNumber2 = Math.floor(Math.random() * ENEMYTYPE_3.length);
            enemyFlag = ENEMYTYPE_3[_randomNumber2];
        }
        return enemyFlag;
    },
    creatUFOEnemy: function creatUFOEnemy() {
        // 创建UFO
        var enemy = cc.instantiate(this.UFOPrefab);
        enemy.parent = this.node;
        this.enemyArray.push(enemy);
        this.makeUFOEnemyNumber++;
    },
    creatRocketEnemy: function creatRocketEnemy() {
        // 创建火箭
        var enemy = cc.instantiate(this.rocketPrefab);
        enemy.parent = this.node;
        this.enemyArray.push(enemy);
        this.makeRocketEnemyNumber++;
    },
    creatWaveRobotEnemy: function creatWaveRobotEnemy() {
        // 创建波动机器人
        var enemy = cc.instantiate(this.waveRobotPrefab);
        enemy.parent = this.node;
        this.enemyArray.push(enemy);
        this.makeWaveRobotEnemyNumber++;
        cc.log('CWaveRobot');
    },
    creatSpacePlaneEnemy: function creatSpacePlaneEnemy() {
        // 创建深空飞船
        var enemy = cc.instantiate(this.spacePlanePrefab);
        enemy.parent = this.node;
        this.enemyArray.push(enemy);
        this.makeSpacePlaneEnemyNumber++;
        cc.log('CSpacePlane');
    },
    creatThrowRobotEnemy: function creatThrowRobotEnemy() {
        // 创建投掷机器人
        cc.log('CThrowRobot');
    },
    creatHeavyWaterPlaneEnemy: function creatHeavyWaterPlaneEnemy() {
        // 创建重水飞船
        cc.log('CHeavyWaterPlane');
    },
    succeedEventEmit: function succeedEventEmit() {
        var _this2 = this;

        if (this.gameState == 1) {
            // gameState代表游戏状态 0：未开始，1：开始
            this.enemyArray.map(function (item) {
                if (item.active == false) {
                    item.parent = null;
                    _this2.removeByValue(_this2.enemyArray, item);
                    _this2.remainEnemy--; // 每移出一个敌人剩余敌人数减1
                }
            });
            if (this.makeDoneFlag == this.levelData.enemyNumber && this.enemyArray.length == 0) {
                this.node.emit("succeed");
                this.makeDoneFlag = -1;
                this.gameState = 0;
            }
        }
    },
    popFailButton: function popFailButton() {
        //弹出失败重来按钮
        this.failButton.active = true;
        this.gameState = 0; // gameState == 0,表明游戏结束
    },
    updateEnemyNumberBar: function updateEnemyNumberBar() {
        // 更新敌人数量条
        if (this.gameState == 1) {
            var ratio = this.remainEnemy / this.levelData.enemyNumber;
            this.enemyNumberBar.progress = ratio;
        }
    },
    clearAllEnemy: function clearAllEnemy() {
        // 停止所有计时器
        // 将全局数组里面的敌人都销毁就好了
        this.unscheduleAllCallbacks();
        this.enemyArray.map(function (item) {
            item.parent = null;
            item.destroy(); //销毁数组中的节点
        });
        this.enemyArray = []; //清空数组
        this.makeDoneFlag = -1; // 将标志位设回原样
    },
    initEnemyData: function initEnemyData() {
        // 这里必须初始化一次，否则第一次进游戏会出错
        this.UFOInitData();
        this.rocketInitData();
        this.waveRobotInitData();
        this.spacePlaneInitData();
    },


    // 删除数组特定元素的方法
    removeByValue: function removeByValue(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    },


    /*初始化数据*/
    UFOInitData: function UFOInitData() {
        this.UFOObject = JSON.parse(cc.sys.localStorage.getItem("UFOObject")); // 获取全局对象
        if (this.UFOObject == null) {
            this.UFOObject = {
                bulletAttack: 20, // 子弹攻击力
                impactAttack: 40, // 撞击攻击力
                health: 100, // 初始血量
                bulletSpeed: 10, // 初始子弹速度
                bulletFre: 2.5, // 子弹频率
                coin: 100
            };
            cc.sys.localStorage.setItem("UFOObject", JSON.stringify(this.UFOObject));
        } // 初始化数据
    },
    rocketInitData: function rocketInitData() {
        this.rocketObject = JSON.parse(cc.sys.localStorage.getItem("rocketObject")); // 获取全局对象
        if (this.rocketObject == null) {
            this.rocketObject = {
                impactAttack: 40, // 撞击攻击力
                health: 50, // 初始血量
                speed: 5, // 初始速度
                coin: 200
            };
            cc.sys.localStorage.setItem("rocketObject", JSON.stringify(this.rocketObject));
        } // 初始化数据
    },
    waveRobotInitData: function waveRobotInitData() {
        this.waveRobotObject = JSON.parse(cc.sys.localStorage.getItem("waveRobotObject")); // 获取全局对象
        if (this.waveRobotObject == null) {
            this.waveRobotObject = {
                bulletAttack: 50, // 子弹攻击力
                impactAttack: 120, // 撞击攻击力
                health: 250, // 初始血量
                bulletSpeed: 5, // 初始子弹速度
                bulletFre: 4, // 子弹频率
                coin: 300
            };
            cc.sys.localStorage.setItem("waveRobotObject", JSON.stringify(this.waveRobotObject));
        } // 初始化数据
    },
    spacePlaneInitData: function spacePlaneInitData() {
        this.spacePlaneObject = JSON.parse(cc.sys.localStorage.getItem("spacePlaneObject")); // 获取全局对象
        if (this.spacePlaneObject == null) {
            this.spacePlaneObject = {
                bulletAttack: 200, // 子弹攻击力
                impactAttack: 600, // 撞击攻击力
                health: 800, // 初始血量
                bulletSpeed: 1, // 初始子弹速度
                bulletFre: 4, // 子弹频率
                coin: 700
            };
            cc.sys.localStorage.setItem("spacePlaneObject", JSON.stringify(this.spacePlaneObject));
        } // 初始化数据
    },

    /**********************/

    onLoad: function onLoad() {
        this.enemyNumberBar.progress = -1;
    },
    start: function start() {},
    update: function update(dt) {
        this.succeedEventEmit();
        this.updateEnemyNumberBar();
        //cc.log('enemy:'+this.enemyArray.length);
        //cc.log('flag:'+this.makeDoneFlag)
    }
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
        //# sourceMappingURL=enemyControl.js.map
        