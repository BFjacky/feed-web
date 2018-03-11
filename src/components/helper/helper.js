const qiniu = require('qiniu-js');
import config from './config'
import axios from 'axios'
function getTimesTamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}
function getNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}
const nonceStr = getNonceStr();
const timestamp = getTimesTamp();
let signature;
const getSignature = async function () {
    const signatureRes = await axios({
        url: `http://feedServer.feit.me/sign`,
        params: {
            nonceStr, timestamp
        },
        headers: {
            'content-type': 'application/json'
        }
    })
    signature = signatureRes.data.signature;
}
export default {
    async wxConfig() {
        await getSignature();
        console.log(signature)
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx9fd6bbc89436a5ee', // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature,// 必填，签名
            jsApiList: ['chooseImage'] // 必填，需要使用的JS接口列表
        });
    }
}