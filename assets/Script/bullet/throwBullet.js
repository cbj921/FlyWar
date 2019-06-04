

cc.Class({
    extends: cc.Component,

    properties: {
 
    },

    onCollisionEnter(other, self) {
        if(other.tag == 0){
            this.node.destroy();
        }
    },

    start () {

    },

    // update (dt) {},
});
