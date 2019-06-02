
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
        return this.levelData;
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
