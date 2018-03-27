export default {
    url: {
        oauthUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3ff5c48ba9ac6552&redirect_uri=https%3a%2f%2fneau-lib.xiaonei.io%2ffeed%2foauth&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
        feedUrl: 'https://neau-lib.xiaonei.io/feed'
        // oauthUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9fd6bbc89436a5ee&redirect_uri=https%3a%2f%2fneau-lib.xiaonei.io%2ffeed%2foauth&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
        // feedUrl: 'http://localhost:7004'
    },
    //全局user
    user: {
        oauth: false,
        //后台服务正在获取此微信用户信息
        updating: false,
        //前端页面正在从后台服务器获取用户信息
        fetching: false,
        _id: '',
    }
}