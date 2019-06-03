
cc.Class({
    extends: cc.Component,

    properties: {
 
    },

    onCollisionEnter(other, self) {
        this.node.destroy();
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
