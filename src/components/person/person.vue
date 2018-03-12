<template>
  <div class="container">
      这是person页面
      <div class="login-button" @click="wechatLogin">微信登陆</div>
  </div>
</template>
<script>
export default {
  methods: {
    wechatLogin: function() {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9fd6bbc89436a5ee&redirect_uri=http%3a%2f%2ffeedserver.feit.me&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    }
  }
};
</script>
<style lang="less" scoped>

</style>

