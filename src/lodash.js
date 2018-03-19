const lodash = require('lodash');


export default {
    install(Vue, options) {
        Vue.prototype.$lodash = lodash
    }
}