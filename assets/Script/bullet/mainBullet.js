
cc.Class({
    extends: cc.Component,

    properties: {

    },



    onCollisionEnter: function (other, self) {
        this.node.destroy();
    },

    // onLoad () {},



    // update (dt) {},
});
