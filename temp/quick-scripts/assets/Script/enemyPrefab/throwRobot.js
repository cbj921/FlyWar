(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/enemyPrefab/throwRobot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2ae15vWtSZKtbz8uhDAz6cN', 'throwRobot', __filename);
// Script/enemyPrefab/throwRobot.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        startBulletAttack: 0, // 子弹攻击力
        startImpactAttack: 0, // 撞击攻击力
        startHealth: 0, // 初始血量
        startBulletSpeed: 0, // 初始子弹速度
        bulletFre: 0, // 子弹频率

        moveHorizontalDuration: 0,
        moveVenticalDuration: 0,

        moveHorizontalDistance: 0,
        moveVenticalDistance: 0,

        healthBar: cc.ProgressBar,
        bulletPrefab: cc.Prefab
    },
    initData: function initData() {
        this.throwRobotObject = JSON.parse(cc.sys.localStorage.getItem("throwRobotObject")); // 获取全局对象
        if (this.throwRobotObject == null) {
            this.throwRobotObject = {
                bulletAttack: this.startBulletAttack, // 子弹攻击力
                impactAttack: this.startImpactAttack, // 撞击攻击力
                health: this.startHealth, // 初始血量
                bulletSpeed: this.startBulletSpeed, // 初始子弹速度
                bulletFre: this.bulletFre, // 子弹频率
                coin: 300
            };
            cc.sys.localStorage.setItem("throwRobotObject", JSON.stringify(this.throwRobotObject));
            this.throwRobotObject = JSON.parse(cc.sys.localStorage.getItem("throwRobotObject")); // 获取全局对象
        } // 初始化数据

        this.mainPlaneData = JSON.parse(cc.sys.localStorage.getItem("mainPlaneObject")); // 获取飞机数据
        this.coinData = cc.sys.localStorage.getItem('coinData'); // 得到金币数据
    },
    moveAction: function moveAction() {
        var _this = this;

        this.randomPosition(380, -400); // 不要问我为什么是这个数值，我测试出来的

        var moveRight = cc.moveBy(this.moveHorizontalDuration, cc.v2(this.moveHorizontalDistance, 250)).easing(cc.easeCubicActionIn());
        var moveLeft = cc.moveBy(this.moveHorizontalDuration, cc.v2(-this.moveHorizontalDistance, -250)).easing(cc.easeCubicActionOut());

        var moveHorizontal = cc.repeat(cc.sequence(moveRight, moveLeft), 5); // 左右横跳
        var moveVentical = cc.moveTo(this.moveVenticalDuration, cc.v2(this.node.x, this.moveVenticalDistance)); // 移动到（0，-1100）的位置

        var moveAction = cc.spawn(moveHorizontal, moveVentical);

        this.backAction = cc.callFunc(function () {
            // 到底部回到顶部回调函数
            _this.randomPosition(380, -400);
            moveVentical = cc.moveTo(_this.moveVenticalDuration, cc.v2(_this.node.x, _this.moveVenticalDistance)); // 重新设置 x 值
            moveAction = cc.spawn(moveHorizontal, moveVentical);
            _this.node.runAction(cc.sequence(moveAction, _this.backAction));
        });

        this.node.runAction(cc.sequence(moveAction, this.backAction));
    },
    randomPosition: function randomPosition(max, min) {
        //随机出现位置
        var posY = 1020; // 起始纵坐标固定
        var posX = Math.floor(Math.random() * (max - min)) + min; // 
        this.node.setPosition(posX, posY);
    },
    initHealthBar: function initHealthBar() {
        // 更新血条，让血回满
        // 初始化血量
        this.varHealth = this.throwRobotObject.health;
        this.healthBar.progress = 1;
    },
    updateHealthBar: function updateHealthBar() {
        var ratio = this.varHealth / this.throwRobotObject.health;
        this.healthBar.progress = ratio;
        if (ratio == 0) {
            this.node.parent = null;
            this.getCoin();
            this.node.destroy();
        }
    },
    getCoin: function getCoin() {
        // 击杀后得到金币
        this.coinData = this.coinData - 0 + this.throwRobotObject.coin;
        cc.sys.localStorage.setItem('coinData', this.coinData);
    },


    //子弹
    bulletInit: function bulletInit(bulletPrefab) {
        this.bulletPool = new cc.NodePool();
        this.bulletArray = [];
        var initCount = 10;
        for (var i = 0; i < initCount; i++) {
            var bullet = cc.instantiate(bulletPrefab);
            this.bulletPool.put(bullet);
        }
    },
    creatBullet: function creatBullet() {
        var _this2 = this;

        this.bulletCallback = function () {
            // 计时器回调函数
            var bullet = null;
            if (_this2.bulletPool.size() > 0) {
                // 通过 size 接口判断对象池中是否有空闲的对象
                bullet = _this2.bulletPool.get();
            } else {
                // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                bullet = cc.instantiate(_this2.bulletPrefab);
            }
            bullet.parent = _this2.node.parent; // 将生成的子弹加入canvas节点
            bullet.position = cc.v2(_this2.node.x, _this2.node.y);
            _this2.bulletAction(bullet);
        };

        this.schedule(this.bulletCallback, this.throwRobotObject.bulletFre); //
    },
    bulletAction: function bulletAction(bulletNode) {
        var _this3 = this;

        var duration = (this.node.y + 1100) / (this.throwRobotObject.bulletSpeed * 100); // 计算时间，这样不管在哪个位置发射子弹速度都一样了
        this.moveAction = cc.moveTo(duration, cc.v2(this.node.x, -1100)); // 初始位置是0
        this.finished = cc.callFunc(function () {
            if (_this3.bulletPool == null) {
                // 因为飞船没了后，对象池也没了
                bulletNode.destroy();
            } else {
                _this3.bulletPool.put(bulletNode);
            }
        });
        var shootAction = cc.sequence(this.moveAction, this.finished);
        bulletNode.runAction(shootAction);
    },


    /**
        * 当碰撞产生的时候调用
        * @param  {Collider} other 产生碰撞的另一个碰撞组件
        * @param  {Collider} self  产生碰撞的自身的碰撞组件
        */
    onCollisionEnter: function onCollisionEnter(other, self) {
        // 敌机的碰撞tag暂时为，飞机：0，普通子弹：1
        if (other.tag == 0) {
            this.node.destroy();
        }
        if (other.tag == 1) {
            //被子弹射中
            this.varHealth -= this.mainPlaneData.mainWeapon.attackNumber;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 2) {
            // 被镭射激光射中
            this.varHealth -= this.mainPlaneData.subWeapon.laserGun.attackNumber;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 3) {
            // 被粒子枪粒子击中
            this.varHealth -= this.mainPlaneData.subWeapon.grainGun.attackNumber;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
    },
    onLoad: function onLoad() {
        this.initData();
        this.initHealthBar();
        this.moveAction();
        this.bulletInit(this.bulletPrefab);
        this.creatBullet();
    },
    update: function update(dt) {
        this.updateHealthBar();
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
        //# sourceMappingURL=throwRobot.js.map
        