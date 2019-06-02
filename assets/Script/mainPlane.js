
//每次升级才要存储新的数据，其余时候只要读取就好 


cc.Class({
    extends: cc.Component,

    properties: {
        endPosY: 0,
        moveSpeed: 0,
        moveLimit: 0, //移动的临界点

        startHealth: 0,
        startBulletSpeed: 0,
        startAttack: 0,
        startPower: 0,
        healthBar: cc.ProgressBar,
        bullet: [cc.Prefab],
        strengthLabel:cc.Node,

        //enemyScript:require('enemyControl'),
    },

    init() {
        this.node.setPosition(cc.v2(0, -1760));
        this.Canvas = this.node.parent;
    },

    initData() {
        this.mainPlaneObject = JSON.parse(cc.sys.localStorage.getItem("mainPlaneObject")); // 获取全局对象
        if (this.mainPlaneObject == null) {
            this.mainPlaneObject = {
                protect: {
                    level: 1,
                    number: this.startHealth,
                    cost: 100,
                },
                mainWeapon: {
                    attackNumber: this.startAttack,
                    speedNumber: this.startBulletSpeed,
                    attackLevel: 1,
                    speedLevel: 1,
                    attackCost: 100,
                    speedCost: 100,
                },
                power: {
                    level: 1,
                    number: this.startPower,
                    cost: 150,
                },
                subWeapon:{
                    grainGun: {
                        attackNumber: 2,
                        speedNumber: 5,
                        attackLevel: 1,
                        attackCost: 100,
                        powerCost:10,
                    },
                    laserGun: {
                        attackNumber: 20,
                        speedNumber: 1,
                        attackLevel: 1,
                        attackCost: 200,
                        powerCost:20,
                    },
                },
            };
            cc.sys.localStorage.setItem("mainPlaneObject", JSON.stringify(this.mainPlaneObject));
            this.mainPlaneObject = JSON.parse(cc.sys.localStorage.getItem("mainPlaneObject")); // 获取全局对象
        } // 初始化数据
        this.varHealth = this.mainPlaneObject.protect.number; // 因为血量在游戏的时候会一直变化，所以用一个中间值来在游戏中进行改变
    },

    startFly() {
        // 飞到指定位置
        let flyAction = cc.moveTo(1, cc.v2(0, this.endPosY)).easing(cc.easeCubicActionOut());
        this.node.runAction(flyAction);
        this.initHealthBar();
        this.registerPlaneControlEvent();
        this.creatBullet();
        this.getAllEnemyData(); // 获取所有敌人数据
    },

    registerPlaneControlEvent() {
        this.isMoving = false; // 记录单机事件是否在移动

        this.startTouchBack = (event) => {
            // 回调函数
            let touches = event.getTouches();
            let touchLoc = touches[0].getLocation(); // 获取到第一个触摸点的坐标
            this.isMoving = true; // 正在移动标志位
            this.moveToPos = this.Canvas.convertToNodeSpaceAR(touchLoc);
        }
        this.moveTouchBack = (event) => {
            let touches = event.getTouches();
            let touchLoc = touches[0].getLocation();
            this.moveToPos = this.Canvas.convertToNodeSpaceAR(touchLoc);
        }
        this.endTouchBack = (event) => {
            this.isMoving = false;
        }

        this.Canvas.on(cc.Node.EventType.TOUCH_START, this.startTouchBack, this.node);
        this.Canvas.on(cc.Node.EventType.TOUCH_MOVE, this.moveTouchBack, this.node);
        this.Canvas.on(cc.Node.EventType.TOUCH_END, this.endTouchBack, this.node);
    },

    updatePlanePos(dt) {
        if (!this.isMoving) {
            return;
        }
        let oldPos = this.node.position;
        let direction = this.moveToPos.sub(oldPos).normalize();// 获得移动方向
        let distance = this.moveToPos.sub(oldPos).mag(); // 获得向量的长度
        if (distance > this.moveLimit) {
            this.node.setPosition(oldPos.add(direction.mul(this.moveSpeed * dt)));
        }
        // 偏移方向

    },

    initHealthBar() {
        // 更新血条，让血回满
        // 初始化血量
        this.varHealth = this.mainPlaneObject.protect.number;
        this.healthBar.progress = 1;
    },
    updateHealthBar() {
        let ratio = this.varHealth / this.mainPlaneObject.protect.number;
        this.healthBar.progress = ratio;
        if (ratio == 0) {
            this.failEvent();
        }
    },
    failEvent() {
        this.initHealthBar();// 让血回满，就不会一直发射事件
        this.strengthLabel.emit('fail');// 给strengthLabel发送失败事件
        this.Canvas.emit("fail"); // 给canvas 发送失败事件
        this.unschedule(this.bulletCallback);// 关闭子弹发射
    },

    getAllEnemyData() {
        // 获取到所有敌人数据
        this.UFOData = JSON.parse(cc.sys.localStorage.getItem("UFOObject"));
        this.rocketData = JSON.parse(cc.sys.localStorage.getItem("rocketObject"));
        this.waveRobotData = JSON.parse(cc.sys.localStorage.getItem("waveRobotObject"));
        this.spacePlaneData = JSON.parse(cc.sys.localStorage.getItem("spacePlaneObject"));
        //获取到其他敌人
        //。。。。

        //cc.log(this.UFOData);
    },

    bulletInit(bulletPrefab) {
        this.bulletPool = new cc.NodePool();
        let initCount = 15;
        for (let i = 0; i < initCount; i++) {
            let bullet = cc.instantiate(bulletPrefab);
            this.bulletPool.put(bullet);
        }
    },

    creatBullet() {
        this.bulletCallback = () => {
            let bullet = null;
            if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                bullet = this.bulletPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                bullet = cc.instantiate(this.bullet[0]);
            }
            bullet.parent = this.node.parent; // 将生成的子弹加入canvas节点
            bullet.position = cc.v2(this.node.x, this.node.y);
            this.bulletAction(bullet);
        };
        this.schedule(this.bulletCallback, 1 / (this.mainPlaneObject.mainWeapon.speedNumber / 10));//

    },

    bulletAction(bulletNode) {
        let duration = (1100 - this.node.y) / 1200;  // 计算时间，这样不管在哪个位置发射子弹速度都一样了
        this.moveAction = cc.moveTo(duration, cc.v2(this.node.x, 1100)); // 初始位置是0
        this.finished = cc.callFunc(() => {
            if (this.bulletPool == null) {
                bulletNode.destroy();  //因为飞机没了后，对象池也没了,所以把剩下的子弹销毁
            } else {
                this.bulletPool.put(bulletNode);
            }
        });
        let shootAction = cc.sequence(this.moveAction, this.finished);
        bulletNode.runAction(shootAction);
    },

    /**
* 当碰撞产生的时候调用
* @param  {Collider} other 产生碰撞的另一个碰撞组件
* @param  {Collider} self  产生碰撞的自身的碰撞组件
*/
    onCollisionEnter(other, self) {
        if (other.tag == 0) {
            //tag==0表示碰到飞碟
            this.varHealth = this.varHealth - this.UFOData.impactAttack;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 1) {
            //tag==1表示碰到飞碟子弹
            this.varHealth = this.varHealth - this.UFOData.bulletAttack;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 2) {
            //tag==2表示碰到火箭
            this.varHealth = this.varHealth - this.rocketData.impactAttack;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 3) {
            //tag==3表示碰到波动机器人
            this.varHealth = this.varHealth - this.waveRobotData.impactAttack;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 4) {
            //tag==4表示碰到波动机器人子弹
            this.varHealth = this.varHealth - this.waveRobotData.bulletAttack;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 5) {
            //tag==5表示碰到深空飞机
            this.varHealth = this.varHealth - this.spacePlaneData.impactAttack;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }
        if (other.tag == 6) {
            //tag==6表示碰到深空飞机子弹
            this.varHealth = this.varHealth - this.spacePlaneData.bulletAttack;
            if (this.varHealth < 0) {
                this.varHealth = 0;
            }
        }


    },

    update(dt) {
        this.updatePlanePos(dt);// 更新飞机位置
        this.updateHealthBar();// 更新血条
    },

    onLoad() {
        this.bulletInit(this.bullet[0]);
    },


});
