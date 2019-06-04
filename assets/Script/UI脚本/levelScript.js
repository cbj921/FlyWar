
cc.Class({
    extends: cc.Component,

    properties: {

    },

    initLevelData(){
        this.levelData = JSON.parse(cc.sys.localStorage.getItem("levelData")); // 获取全局对象
        if (this.levelData == null) {
            this.levelData = {
                level:1,
                enemyNumber:10,
                enmeyProportion:{
                    UFOProportion:0.7,// ufo比例
                    rocketProportion:0.3,
                    waveRobotProportion:0,
                    spacePlaneProportion:0,
                    throwRobotProportion:0,
                    heavyPlaneProportion:0,
                }
            };
            cc.sys.localStorage.setItem("levelData", JSON.stringify(this.levelData));
            this.levelData = JSON.parse(cc.sys.localStorage.getItem("levelData")); // 获取全局对象
        } // 初始化数据
        this.getAllEnemyData();
        return this.levelData;
    },

    getAllEnemyData() {
        // 获取到所有敌人数据
        this.UFOData = JSON.parse(cc.sys.localStorage.getItem("UFOObject"));
        this.rocketData = JSON.parse(cc.sys.localStorage.getItem("rocketObject"));
        this.waveRobotData = JSON.parse(cc.sys.localStorage.getItem("waveRobotObject"));
        this.spacePlaneData = JSON.parse(cc.sys.localStorage.getItem("spacePlaneObject"));
    },

    updateLevelData(){
        // 成功通关后更新关卡数据
        this.levelData = JSON.parse(cc.sys.localStorage.getItem("levelData"));
        this.levelData.level++;
        this.levelData.enemyNumber += 5;
        // 以下是更新敌人的比例
        if(this.levelData.level <=5){
            //前5关的比例
            this.levelData.enmeyProportion = {
                UFOProportion:0.7,// ufo比例
                rocketProportion:0.3,
                waveRobotProportion:0,
                spacePlaneProportion:0,
                throwRobotProportion:0,
                heavyPlaneProportion:0,
            }
        }
        if(this.levelData.level >5 && this.levelData.level <=10){
            // 6-10关的比例
            this.levelData.enmeyProportion = {
                UFOProportion:0.3,// ufo比例
                rocketProportion:0.2,
                waveRobotProportion:0.3,
                spacePlaneProportion:0,
                throwRobotProportion:0.2,
                heavyPlaneProportion:0,
            }
        }
        if(this.levelData.level >10 ){
            // 大于11关后的比例
            this.levelData.enmeyProportion = {
                UFOProportion:0.1,// ufo比例
                rocketProportion:0.1,
                waveRobotProportion:0.1,
                spacePlaneProportion:0.2,
                throwRobotProportion:0.2,
                heavyPlaneProportion:0.3,
            }
        }
        // 以下是更新敌人的属性
        // TODO: 更新敌人属性
        ////////////////////
        cc.sys.localStorage.setItem("levelData", JSON.stringify(this.levelData));
    },

    onLoad () {
        this.initLevelData();//初始化关卡数据
        this.label = this.node.getComponent(cc.Label);
    },

    onEnable(){
        this.label.string = `第${this.levelData.level}关`
    },

    // update (dt) {},
});
