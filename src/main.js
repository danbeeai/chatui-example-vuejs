//import "core-js/stable";
//import "regenerator-runtime/runtime";
//import "core-js/modules/web.immediate";
import 'babel-polyfill'
import Vue from 'vue'
import chatBtn from './chatBtn.vue'
//import chatBody from './chatBody.vue'
import VueAgile from 'vue-agile'

Vue.use(VueAgile);

new Vue({
    el: '#container',
    render(h) {
        return h(chatBtn, {props: this.nodeProperties()});
    },
    methods: {
        nodeProperties() {
            let props = {};
            Array.prototype.forEach.call(this.$el.attributes, (node) => {
                //console.log('node.name : ' + node.name + ', node.value : ' + node.value);
                props[node.name] = node.value;
            });
            return props;
        },
    }
});
