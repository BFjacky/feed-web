const qiniu = require('qiniu-js');
import myconfig from './config'
import axios from 'axios'
export default {
    async wxinit() {
        return new Promise(async (resolve, reject) => {
            function getTimesTamp() {
                return parseInt(new Date().getTime() / 1000) + '';
            }
            function getNonceStr() {
                return Math.random().toString(36).substr(2, 15);
            }
            const getSignature = async function () {
                const signatureRes = await axios({
                    url: `${myconfig.url.feedUrl}/sign`,
                    params: {
                        nonceStr, timestamp
                    },
                    headers: {
                        'content-type': 'application/json'
                    },
                    withCredentials: true,
                })
                return signatureRes.data.signature;
            }
            const nonceStr = getNonceStr();
            const timestamp = getTimesTamp();
            const signature = await getSignature();

            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wx9fd6bbc89436a5ee', // 必填，公众号的唯一标识
                timestamp, // 必填，生成签名的时间戳
                nonceStr, // 必填，生成签名的随机串
                signature,// 必填，签名
                jsApiList: ['chooseImage', 'previewImage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                resolve('ok')
                wx.onMenuShareTimeline({
                    title: '自己的标题', // 分享标题
                    link: 'http://myccc.feit.me/#/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: '', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        alert('分享成功')
                    },
                    cancel: function () {
                        alert('分享失败')
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({
                    title: '校友圈', // 分享标题
                    desc: '快来看看吧', // 分享描述
                    link: 'http://myccc.feit.me/#/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: '', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            })
        })
    },
    async upload(file) {
        return new Promise(async (resolve, reject) => {
            const tokenRes = await axios({
                method: 'post',
                url: `${myconfig.url.feedUrl}/file/transfer`,
                data: {
                    from: myconfig.user._id,
                    filename: file.name
                },
                withCredentials: true
            })
            const { key, token } = tokenRes.data;
            const config = {
                useCdnDomain: true,
                region: qiniu.region.z1
            }
            var observable = qiniu.upload(file, key, token, {}, config)
            var subscription = observable.subscribe({
                next(res) {

                },
                error(err) {
                    reject(err);
                },
                complete(res) {
                    console.log('上传结束:', res)
                    resolve(res);
                }
            })
        })
    },
    async checkOauth() {
        if (!myconfig.user._id) {
            //如果没有oauth,则发起oauth登陆请求
            window.location.href = myconfig.url.oauthUrl;
            return false;
        }
        if (myconfig.user.oauth) {
            return true;
        }
        //如果没有oauth,则发起oauth登陆请求
        window.location.href = myconfig.url.oauthUrl;
        return false;
    },
    async  wait(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("ok");
            }, time);
        });
    },
    //解析日期时间
    parseDate(array) {
        for (const ele of array) {
            if (ele.createdAt.indexOf('-') === -1) {
                continue
            }
            const now = new Date();
            ele.createdAt = new Date(ele.createdAt)
            //获得分钟数，如果分钟数小于10则:例如 9:01,
            const minute = ele.createdAt.getMinutes();

            if (minute < 10) {
                minute = '0' + minute;
            }
            if (now.getDate() - ele.createdAt.getDate() <= 0) {
                // 一天内 :只显示:小时:分钟
                ele.createdAt = `${ele.createdAt.getHours()}:${minute}`;
            }
            else if (now.getDate() - ele.createdAt.getDate() <= 1) {
                ele.createdAt = `昨天  ${ele.createdAt.getHours()}:${minute}`;
                //超过一天,不超过两天:显示昨天
            } else {
                ele.createdAt = `${ele.createdAt.getMonth() + 1}月${ele.createdAt.getDate()}日  ${ele.createdAt.getHours()}:${minute}`;
                //超过两天，显示日期和时间
            }
        }
        return array;
    },

    //为已经被屏蔽的thread添加needShield参数
    parseShield(threads) {
        for (const thread of threads) {
            for (const shield of myconfig.user.shields) {
                if (shield.uid === thread.uid) {
                    thread.needShield = true;
                }
            }
        }
        return threads;
    }

}