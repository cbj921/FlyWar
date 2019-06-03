
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
        grainGunBullet:cc.Prefab,
        laserGunBullet:cc.Prefab,
        strengthLabel:cc.Node,
        powerBar:cc.ProgressBar,

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
        this.powerNumber = this.mainPlaneObject.power.number; // 能量同理
    },

    startFly() {
        // 飞到指定位置
        let flyAction = cc.moveTo(1, cc.v2(0, this.endPosY)).easing(cc.easeCubicActionOut());
        this.node.runAction(flyAction);
        this.initHealthBar();
        this.initPowerBar();//初始化能量条
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

    offTouchEventRegister(){
        this.Canvas.off(cc.Node.EventType.TOUCH_START, this.startTouchBack, this.node);
        this.Canvas.off(cc.Node.EventType.TOUCH_MOVE, this.moveTouchBack, this.node);
        this.Canvas.off(cc.Node.EventType.TOUCH_END, this.endTouchBack, this.node);
    },

    updatePlanePos(dt) {
        if (!this.isMoving) {
            return;
        }else{
            let oldPos = this.node.position;
            let direction = this.moveToPos.sub(oldPos).normalize();// 获得移动方向
            let distance = this.moveToPos.sub(oldPos).mag(); // 获得向量的长度
            if (distance > this.moveLimit) {
                this.node.setPosition(oldPos.add(direction.mul(this.moveSpeed * dt)));
            }
        }

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
        this.offTouchEventRegister();
        this.isMoving = 0; // 让移动标志位为0,如果不这样，飞机归位后还会飞出来
        this.initHealthBar();// 让血回满，就不会一直发射事件
        this.strengthLabel.emit('fail');// 给strengthLabel发送失败事件
        this.Canvas.emit("fail"); // 给canvas 发送失败事件
        this.unscheduleAllCallbacks();// 关闭所有子弹发射
    },
    succeedEvent(){
        this.offTouchEventRegister();
        this.isMoving = 0; // 让移动标志位为0,如果不这样，飞机归位后还会飞出来
        this.unscheduleAllCallbacks();// 关闭所有子弹发射
    },

    initPowerBar(){
        this.powerNumber = this.mainPlaneObject.power.number; 
        this.powerBar.progress = 1;
    },
    updatePowerBar(){
        // 更新能量条
        let ratio = this.powerNumber / this.mainPlaneObject.power.number;
        this.powerBar.progress = ratio;
    },
    // 副武器按键函数
    useGrainGun(){
        if(this.powerNumber>=this.mainPlaneObject.subWeapon.grainGun.powerCost){
            this.powerNumber -= this.mainPlaneObject.subWeapon.grainGun.powerCost;
            this.grainBulletInit();
        }
    },
    useLaserGun(){
        if(this.powerNumber>=this.mainPlaneObject.subWeapon.laserGun.powerCost){
            this.powerNumber -= this.mainPlaneObject.subWeapon.laserGun.powerCost;
            this.laserBulletInit();
        }
    },
    // 以下粒子枪子弹
    grainBulletInit(){
        if(this.grainPool == undefined){
            // 对象池不存在我们才新建
            this.grainPool = new cc.NodePool();
            let initCount = 20;
            for (let i = 0; i < initCount; i++) {
                let bullet = cc.instantiate(this.grainGunBullet);
                this.grainPool.put(bullet);
            }
        }
        //
        let rightBulletCallback = () => {
            let bullet = null;
            if (this.grainPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                bullet = this.grainPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                bullet = cc.instantiate(this.grainGunBullet);
            }
            bullet.parent = this.node.parent; // 将生成的子弹加入canvas节点
            bullet.position = cc.v2(this.node.x + 125, this.node.y); // 放在飞机右边
            this.grainBulletAction(bullet,125);
        };
        let leftBulletCallback = () => {
            let bullet = null;
            if (this.grainPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                bullet = this.grainPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                bullet = cc.instantiate(this.grainGunBullet);
            }
            bullet.parent = this.node.parent; // 将生成的子弹加入canvas节点
            bullet.position = cc.v2(this.node.x - 125, this.node.y); // 放在飞机右边
            this.grainBulletAction(bullet,-125);
        };

        this.schedule(rightBulletCallback,1 / (this.mainPlaneObject.subWeapon.grainGun.speedNumber),15);
        this.schedule(leftBulletCallback,1 / (this.mainPlaneObject.subWeapon.grainGun.speedNumber),15);

    },
    grainBulletAction(bulletNode,offset) {
        let duration = (1100 - this.node.y) / 2000;  // 计算时间，这样不管在哪个位置发射子弹速度都一样了
        this.moveAction = cc.moveTo(duration, cc.v2(this.node.x+offset, 1100)); // 初始位置是0
        this.finished = cc.callFunc(() => {
            if (this.grainPool == null) {
                bulletNode.destroy();  //因为飞机没了后，对象池也没了,所以把剩下的子弹销毁
            } else {
                this.grainPool.put(bulletNode);
            }
        });
        let shootAction = cc.sequence(this.moveAction, this.finished);
        bulletNode.runAction(shootAction);
    },
    // 以下是镭射枪子弹
    laserBulletInit(){
        if(this.laserPool == undefined){
            this.laserPool = new cc.NodePool();
            let initCount = 10;
            for (let i = 0; i < initCount; i++) {
                let bullet = cc.instantiate(this.laserGunBullet);
                this.laserPool.put(bullet);
            }
        }
        let rightBulletCallback = () => {
            let bullet = null;
            if (this.laserPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                bullet = this.laserPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                bullet = cc.instantiate(this.laserGunBullet);
            }
            bullet.parent = this.node.parent; // 将生成的子弹加入canvas节点
            bullet.position = cc.v2(this.node.x + 125, this.node.y); // 放在飞机右边
            this.laserBulletAction(bullet,125);
        };
        let leftBulletCallback = () => {
            let bullet = null;
            if (this.laserPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                bullet = this.laserPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                bullet = cc.instantiate(this.laserGunBullet);
            }
            bullet.parent = this.node.parent; // 将生成的子弹加入canvas节点
            bullet.position = cc.v2(this.node.x - 125, this.node.y); // 放在飞机右边
            this.laserBulletAction(bullet,-125);
        };
        this.schedule(rightBulletCallback,1 / (this.mainPlaneObject.subWeapon.laserGun.speedNumber),4,0.5);
        this.schedule(leftBulletCallback,1 / (this.mainPlaneObject.subWeapon.laserGun.speedNumber),4);
    },
    laserBulletAction(bulletNode,offset){
        let duration = (1100 - this.node.y) / 1000;  // 计算时间，这样不管在哪个位置发射子弹速度都一样了
        let backAction = cc.moveBy(0.5,cc.v2(0,-50)); // 往后退的动作
        this.moveAction = cc.moveTo(duration, cc.v2(this.node.x+offset, 1100)); // 初始位置是0
        this.finished = cc.callFunc(() => {
            if (this.laserPool == null) {
                bulletNode.destroy();  //因为飞机没了后，对象池也没了,所以把剩下的子弹销毁
            } else {
                this.laserPool.put(bulletNode);
            }
        });
        let shootAction = cc.sequence(backAction,this.moveAction, this.finished);
        bulletNode.runAction(shootAction);
    },
///////////////////////
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
        this.updatePowerBar();// 更新能量条
    },

    onLoad() {
        this.bulletInit(this.bullet[0]);
    },


});
