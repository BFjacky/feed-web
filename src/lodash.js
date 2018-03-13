const lodash = require('lodash');


export default {
    install(Vue, options) {
        console.log(lodash)
        Vue.prototype.$lodash = lodash
    }
}