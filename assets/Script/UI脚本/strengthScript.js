
cc.Class({
    extends: cc.Component,

    properties: {

    },

    init(){
        this.label = this.node.getChildByName("strengthNumber").getComponent(cc.Label); // 获取标签组件
        this.strengthData = cc.sys.localStorage.getItem("strengthData"); // 获取体力的数据
        if(this.strengthData == null){
            // 如果获取不到体力的数据说明为第一次游戏
            this.strengthData = 100; // 初始体力为 100
            cc.sys.localStorage.setItem("strengthData",this.strengthData);
        }
        this.label.string = this.strengthData + '/' + "100";

        this.showIcon();
        return this.strengthData;
    },

    showIcon(){
        this.node.active = true;
        if(this.strengthData<5){
            this.label.node.color = cc.color(255,0,0,255);// 体力不足字体颜色为红色
        }
    },
    hideIcon(){
        this.node.active = false;
    },

    // 因为体力只有失败才扣，所以只要写失败的时候就行了
    failStrength() {
        let consumeStrength = 5;
        let strengthData = cc.sys.localStorage.getItem("strengthData");
        strengthData = strengthData-consumeStrength;
        cc.sys.localStorage.setItem('strengthData', strengthData);
    },

    strengthSelfGrow(){
        // 体力自增长
        this.strengthGrow = ()=>{
            let strengthData = cc.sys.localStorage.getItem("strengthData");
            strengthData = strengthData-0+5 ; // 这里用了一个JS数据转换技巧，先减0，将字符串变成数字类型
            if(strengthData>100){
                strengthData = 100;
            }
            this.label.string = strengthData + '/' + "100";
            cc.sys.localStorage.setItem('strengthData', strengthData);
            this.init();
        }
        this.schedule(this.strengthGrow,300); // 300秒执行一次，即五分钟恢复一次体力
    },

    opengetStrength(){
        //关闭游戏再打开后回复体力
        let label = this.node.getChildByName("strengthNumber").getComponent(cc.Label); // 获取标签组件
        let lastTime = cc.sys.localStorage.getItem("lastTime");
        if(lastTime == null){
            lastTime = Date.now(); // 获取时间戳
            cc.sys.localStorage.setItem("lastTime",lastTime);
        }
        let nowTime = Date.now();
        let deltaTime = Math.floor((nowTime - lastTime)/1000/60/5); // 获得相差的时间(单位 /5分钟)
        let strengthData = cc.sys.localStorage.getItem("strengthData");
        strengthData = strengthData - 0 + deltaTime*5; // 这里用了一个JS数据转换技巧，先减0，将字符串变成数字类型

        if(strengthData > 100){
            strengthData = 100;
        }
        label.string =  strengthData + '/' + "100";

        cc.sys.localStorage.setItem('strengthData', strengthData); // 存储体力数据
        cc.sys.localStorage.setItem('lastTime', nowTime);
        this.init();
    },

    onLoad () {
        this.node.on("fail",this.failStrength);// 监听失败事件
    },



    // update (dt) {},
});
