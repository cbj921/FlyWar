(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/enemyControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fdaafeIe7tOp5Tf57lqS0nX', 'enemyControl', __filename);
// Script/enemyControl.js

"use strict";

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
    },
    startGame: function startGame() {
        var _this = this;

        var enemyNumber = this.levelData.enemyNumber; // 获得敌人数量

        this.makeEnemy = function () {
            var enemy = cc.instantiate(_this.UFOPrefab);
            enemy.parent = _this.node;
            _this.enemyArray.push(enemy);
            _this.makeDoneFlag += 1;
        };
        this.schedule(this.makeEnemy, 2, enemyNumber);
    },
    creatEnemy: function creatEnemy() {
        // 创建敌人
        var enemyNumber = this.levelData.enemyNumber; // 获得敌人数量
    },
    succeedEventEmit: function succeedEventEmit() {
        var _this2 = this;

        this.enemyArray.map(function (item) {
            if (item.active == false) {
                item.parent = null;
                _this2.removeByValue(_this2.enemyArray, item);
            }
        });
        if (this.makeDoneFlag == this.levelData.enemyNumber && this.enemyArray.length == 0) {
            this.node.emit("succeed");
            this.makeDoneFlag = -1;
        }
    },
    popFailButton: function popFailButton() {
        //弹出失败重来按钮
        this.failButton.active = true;
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
        