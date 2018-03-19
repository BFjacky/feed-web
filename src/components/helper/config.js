export default {
    url: {
        oauthUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9fd6bbc89436a5ee&redirect_uri=http%3a%2f%2fmyccc.feit.me%2f&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
        feedUrl: 'http://feedServer.feit.me'
    },
    //全局user
    user: {
        oauth: false,
        //后台服务正在获取此微信用户信息
        updating: false,
        //前端页面正在从后台服务器获取用户信息
        fetching:false,
        _id: '',
    }
}