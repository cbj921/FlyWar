

cc.Class({
    extends: cc.Component,

    properties: {
        UFOPrefab: cc.Prefab,
        rocketPrefab: cc.Prefab,
        waveRobotPrefab: cc.Prefab,
        throwRobotPrefab: cc.Prefab,
        spacePlanePrefab: cc.Prefab,
        heavyWaterPlanePrefab: cc.Prefab,

        enemyNumberBar:cc.ProgressBar,
    },

    initLevelData() {
        let levelData = JSON.parse(cc.sys.localStorage.getItem("levelData")); // 获取全局对象
        return levelData;
    },

    init() {
        this.levelData = this.initLevelData(); // 获得关卡数据
        // 为什么makeDoneFlag 为 -1 ？？？
        this.makeDoneFlag = -1; // 有点奇怪初始值为-1，这个变量为标志位，当它的值等于敌人的数量时，说明敌人的生成已经完成
        this.enemyArray = [];
    },

    startGame() {
        let enemyNumber = this.levelData.enemyNumber; // 获得敌人数量

        this.makeEnemy = () => {
            let enemy = cc.instantiate(this.UFOPrefab);
            enemy.parent = this.node;
            this.enemyArray.push(enemy);
            this.makeDoneFlag +=1;
        };
        this.schedule(this.makeEnemy, 2, enemyNumber);
    },

    succeedEventEmit() {
        this.enemyArray.map((item) => {
            if (item.active == false) {
                item.parent = null;
                this.removeByValue(this.enemyArray, item);
            }
        });
        if ((this.makeDoneFlag == this.levelData.enemyNumber) && (this.enemyArray.length == 0)) {
            this.node.emit("succeed");
            this.makeDoneFlag = -1;
            cc.log('succeed');
        }
    },

    clearAllEnemy() {
        // 停止所有计时器
        // 将全局数组里面的敌人都销毁就好了
        cc.log('clear');
        this.unscheduleAllCallbacks();
        cc.log(this.enemyArray);
        this.enemyArray.map((item) => {
            item.parent = null;
            item.destroy(); //销毁数组中的节点
        });
        this.enemyArray = []; //清空数组
        this.makeDoneFlag = -1; // 将标志位设回原样
    },

    initEnemyData() {
        // 这里必须初始化一次，否则第一次进游戏会出错
        this.UFOInitData();
        this.rocketInitData();
        this.waveRobotInitData();
        this.spacePlaneInitData();
    },

    // 删除数组特定元素的方法
    removeByValue(arr, val) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    },



    /*初始化数据*/
    UFOInitData() {
        this.UFOObject = JSON.parse(cc.sys.localStorage.getItem("UFOObject")); // 获取全局对象
        if (this.UFOObject == null) {
            this.UFOObject = {
                bulletAttack: 20, // 子弹攻击力
                impactAttack: 40, // 撞击攻击力
                health: 100,  // 初始血量
                bulletSpeed: 10, // 初始子弹速度
                bulletFre: 2.5, // 子弹频率
                coin: 100,
            };
            cc.sys.localStorage.setItem("UFOObject", JSON.stringify(this.UFOObject));
        } // 初始化数据
    },
    rocketInitData() {
        this.rocketObject = JSON.parse(cc.sys.localStorage.getItem("rocketObject")); // 获取全局对象
        if (this.rocketObject == null) {
            this.rocketObject = {
                impactAttack: 40, // 撞击攻击力
                health: 50,  // 初始血量
                speed: 5, // 初始速度
                coin: 200,
            };
            cc.sys.localStorage.setItem("rocketObject", JSON.stringify(this.rocketObject));
        } // 初始化数据
    },
    waveRobotInitData() {
        this.waveRobotObject = JSON.parse(cc.sys.localStorage.getItem("waveRobotObject")); // 获取全局对象
        if (this.waveRobotObject == null) {
            this.waveRobotObject = {
                bulletAttack: 50, // 子弹攻击力
                impactAttack: 120, // 撞击攻击力
                health: 250,  // 初始血量
                bulletSpeed: 5, // 初始子弹速度
                bulletFre: 4, // 子弹频率
                coin: 300,
            };
            cc.sys.localStorage.setItem("waveRobotObject", JSON.stringify(this.waveRobotObject));
        } // 初始化数据
    },
    spacePlaneInitData() {
        this.spacePlaneObject = JSON.parse(cc.sys.localStorage.getItem("spacePlaneObject")); // 获取全局对象
        if (this.spacePlaneObject == null) {
            this.spacePlaneObject = {
                bulletAttack: 200, // 子弹攻击力
                impactAttack: 600, // 撞击攻击力
                health: 800,  // 初始血量
                bulletSpeed: 1, // 初始子弹速度
                bulletFre: 4, // 子弹频率
                coin: 700,
            };
            cc.sys.localStorage.setItem("spacePlaneObject", JSON.stringify(this.spacePlaneObject));
        } // 初始化数据
    },
    /**********************/

    onLoad() {
        this.enemyNumberBar.progress = -1;
    },

    start() {

    },

    update(dt) {
        this.succeedEventEmit();
        //cc.log('enemy:'+this.enemyArray.length);
        //cc.log('flag:'+this.makeDoneFlag)
    },
});
