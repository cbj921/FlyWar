

cc.Class({
    extends: cc.Component,

    properties: {
        startBulletAttack: 0, // 子弹攻击力
        startImpactAttack: 0, // 撞击攻击力
        startHealth: 0,  // 初始血量
        startBulletSpeed: 0, // 初始子弹速度
        bulletFre: 0, // 子弹频率

        moveVenticalDuration: 0,
        moveVenticalDistance: 0,

        healthBar: cc.ProgressBar,
        bulletPrefab:cc.Prefab,
    },

    initData() {
        this.heavyPlaneObject = JSON.parse(cc.sys.localStorage.getItem("heavyPlaneObject")); // 获取全局对象
        if (this.heavyPlaneObject == null) {
            this.heavyPlaneObject = {
                bulletAttack: this.startBulletAttack, // 子弹攻击力
                impactAttack: this.startImpactAttack, // 撞击攻击力
                health: this.startHealth,  // 初始血量
                bulletSpeed: this.startBulletSpeed, // 初始子弹速度
                bulletFre: this.bulletFre, // 子弹频率
                coin:1000,
            };
            cc.sys.localStorage.setItem("heavyPlaneObject", JSON.stringify(this.heavyPlaneObject));
            this.heavyPlaneObject = JSON.parse(cc.sys.localStorage.getItem("heavyPlaneObject")); // 获取全局对象
        } // 初始化数据

        this.mainPlaneData = JSON.parse(cc.sys.localStorage.getItem("mainPlaneObject"));// 获取飞机数据
        this.coinData = cc.sys.localStorage.getItem('coinData');// 得到金币数据
    },

    moveAction() {
        this.randomPosition(380, -400); // 不要问我为什么是这个数值，我测试出来的

        let moveAction = cc.moveTo(this.moveVenticalDuration, cc.v2(this.node.x, this.moveVenticalDistance));  // 移动到（0，-1100）的位置

        this.backAction = cc.callFunc(()=>{
            // 到底部回到顶部回调函数
            this.randomPosition(380, -400); 
            moveAction = cc.moveTo(this.moveVenticalDuration, cc.v2(this.node.x, this.moveVenticalDistance));  // 重新设置 x 值
            this.node.runAction(cc.sequence(moveAction,this.backAction));
        });

        this.node.runAction(cc.sequence(moveAction,this.backAction));
    },
    randomPosition(max, min) {
        //随机出现位置
        let posY = 1020; // 起始纵坐标固定
        let posX = Math.floor(Math.random() * (max - min)) + min; // 
        this.node.setPosition(posX, posY);
    },

    initHealthBar(){
        // 更新血条，让血回满
        // 初始化血量
        this.varHealth=this.heavyPlaneObject.health;
        this.healthBar.progress = 1;
    },

    updateHealthBar(){
        let ratio = this.varHealth/this.heavyPlaneObject.health;
        this.healthBar.progress = ratio;
        if(ratio == 0){
            this.node.parent = null;
            this.getCoin();
            this.node.destroy();
        }
    },
    getCoin(){
        // 击杀后得到金币
        this.coinData = this.coinData-0 + this.heavyPlaneObject.coin;
        cc.sys.localStorage.setItem('coinData',this.coinData); 
    },

    /**
    * 当碰撞产生的时候调用
    * @param  {Collider} other 产生碰撞的另一个碰撞组件
    * @param  {Collider} self  产生碰撞的自身的碰撞组件
    */
   onCollisionEnter(other, self) {
    // 敌机的碰撞tag暂时为，飞机：0，普通子弹：1
    if(other.tag == 0){
        this.node.destroy();
    }
    if(other.tag == 1){
        //被子弹射中
        this.varHealth -= this.mainPlaneData.mainWeapon.attackNumber;
        if(this.varHealth<0){
            this.varHealth =0;
        }
    }
    if(other.tag == 2){
        // 被镭射激光射中
        this.varHealth -= this.mainPlaneData.subWeapon.laserGun.attackNumber;
        if(this.varHealth<0){
            this.varHealth =0;
        }
    }
    if(other.tag == 3){
        // 被粒子枪粒子击中
        this.varHealth -= this.mainPlaneData.subWeapon.grainGun.attackNumber;
        if(this.varHealth<0){
            this.varHealth =0;
        }
    }
},

    onLoad () {
        this.initData();
        this.initHealthBar();
        this.moveAction();
    },

    start () {

    },

    update (dt) {
        this.updateHealthBar();
    },
});
