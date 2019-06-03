

cc.Class({
    extends: cc.Component,

    properties: {
        startImpactAttack: 0, // 撞击攻击力
        startHealth: 0,  // 初始血量
        startSpeed: 0, // 初始速度

        moveVenticalDistance: 0,
        healthBar: cc.ProgressBar,
    },

    initData() {
        this.rocketObject = JSON.parse(cc.sys.localStorage.getItem("rocketObject")); // 获取全局对象
        if (this.rocketObject == null) {
            this.rocketObject = {
                impactAttack: this.startImpactAttack, // 撞击攻击力
                health: this.startHealth,  // 初始血量
                speed: this.startSpeed, // 初始速度
                coin:200,
            };
            cc.sys.localStorage.setItem("rocketObject", JSON.stringify(this.rocketObject));
            this.rocketObject = JSON.parse(cc.sys.localStorage.getItem("rocketObject")); // 获取全局对象
        } // 初始化数据

        this.mainPlaneData = JSON.parse(cc.sys.localStorage.getItem("mainPlaneObject"));// 获取飞机数据
    },

    moveAction() {
        this.randomPosition(380, -400); // 不要问我为什么是这个数值，我测试出来的
        let moveAction = cc.moveTo(this.rocketObject.speed, cc.v2(this.node.x, this.moveVenticalDistance));  // 移动到（this.node.x，-1100）的位置

        this.backAction = cc.callFunc(()=>{
            // 到底部回到顶部回调函数
            this.randomPosition(380, -400); 
            moveAction = cc.moveTo(this.rocketObject.speed, cc.v2(this.node.x, this.moveVenticalDistance));// 这里是因为要重新设置 x 的坐标
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

    // 血条
    initHealthBar(){
        // 更新血条，让血回满
        // 初始化血量
        this.varHealth=this.rocketObject.health;
        this.healthBar.progress = 1;
    },

    updateHealthBar(){
        let ratio = this.varHealth/this.rocketObject.health;
        this.healthBar.progress = ratio;
        if(ratio == 0){
            this.node.parent = null;
            this.node.destroy();
        }
    },
    // 火箭没有子弹
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

    update (dt) {
        this.updateHealthBar();
    },
});
