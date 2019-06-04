
cc.Class({
    extends: cc.Component,

    properties: {

    },

    init(){
        this.coinData = cc.sys.localStorage.getItem("coinData"); // 获取金币的数据
        this.label = this.node.getChildByName("coinNumber").getComponent(cc.Label); // 获取标签组件
        if(this.coinData == null){
            // 如果获取不到金币的数据说明为第一次游戏
            this.coinData = 5000; // 初始金币为 5000
            cc.sys.localStorage.setItem("coinData",this.coinData);
        }
        this.label.string = this.coinData;
        this.node.active = true;
    },

    coinSelfGrow(){
        // 金币自增长
        this.coinGrow = ()=>{
            let coinData = cc.sys.localStorage.getItem("coinData");
            let mainPlaneWeapon = JSON.parse(cc.sys.localStorage.getItem('mainPlaneObject')).mainWeapon;
            // 金币的增长数量 = 基数100+主武器速度和伤害等级的和*50
            coinData = coinData-0+100+(mainPlaneWeapon.attackLevel+mainPlaneWeapon.speedLevel)*50 ; // 这里用了一个JS数据转换技巧，先减0，将字符串变成数字类型
            this.label.string = coinData;
            cc.sys.localStorage.setItem('coinData', coinData);
        }
        this.schedule(this.coinGrow,60); // 60秒执行一次，即60s获得金币
    },

    closeCoinSelfGrow(){
        // 关闭金币自增长，因为在进行游戏过程中不要自增长
        this.unscheduleAllCallbacks();
    },

    hideIcon(){
        this.node.active = false;
    },

    onLoad () {
        
    },

    // update (dt) {},
});
