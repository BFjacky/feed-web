<template>
  <div class="container">
    <div class="header button" @click="wechatLogin">
      <div class="left" v-bind:style="{backgroundImage:`url(${avatarUrl})`}"></div>
      <div class="right">
        <div class="name">{{nickName}}</div>
        <div v-bind:class="{boy:gender===1,girl:gender===0}"></div>
      </div>
    </div>
    <div class="main">
      <div class="item button">
        <div class="icon icon1"></div>
        <div class="text">我发出的动态</div>
      </div>
      <div class="item button ">
        <div class="icon icon2"></div>
        <div class="text">我收到的回复</div>
      </div>
      <div class="item button">
        <div class="icon icon3"></div>
        <div class="text">我点赞的动态</div>
      </div>
      <div class="item button">
        <div class="icon icon4"></div>
        <div class="text">我发出的回复</div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
export default {
  created: async function() {
    const userGet = await axios({
      url: `${config.url.feedUrl}/user/get`,
      withCredentials: true
    });
    console.log(userGet);
    if (!userGet.data) {
      //未能获取到用户信息
      return;
    }
    const { avatarUrl, nickName, gender } = userGet.data;
    this.avatarUrl = avatarUrl;
    this.nickName = nickName;
    this.gender = gender;
  },
  data: function() {
    return {
      avatarUrl: "",
      nickName: "点我登陆",
      gender: -1
    };
  },
  methods: {
    wechatLogin: function() {
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9fd6bbc89436a5ee&redirect_uri=http%3a%2f%2fmyccc.feit.me%2f&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.header {
  height: 15vh;
  border-top: 10px solid rgb(223, 223, 223);
  width: 100vw;
  display: flex;
  align-items: center;
  padding-left: 4vw;
  .left {
    width: 10vh;
    height: 10vh;
    border: 1px solid rgb(219, 219, 219);
    border-radius: 50%;
    background-size: 100% 100%;
  }
  .right {
    margin-left: 8vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-size: 5vw;
      margin-bottom: 1vw;
    }
    .boy {
      background-size: 100% 100%;
      width: 5vw;
      height: 5vw;
      background-image: url("../../assets/boy.png");
    }
    .girl {
      background-size: 100% 100%;
      width: 5vw;
      height: 5vw;
      background-image: url("../../assets/girl.png");
    }
  }
}
.main {
  display: flex;
  flex-direction: column;
  border-top: 7px solid rgb(223, 223, 223);
  .item {
    height: 7vh;
    display: flex;
    align-items: center;
    padding-left: 4vw;
    border-bottom: 1px solid rgb(223, 223, 223);
  }
  .icon {
    background-size: 100% 100%;
    height: 4vh;
    width: 4vh;
  }
  .text {
    margin-left: 5vw;
  }
  .icon1 {
    background-image: url("../../assets/note.png");
  }
  .icon2 {
    background-image: url("../../assets/accept-message.png");
  }
  .icon3 {
    background-image: url("../../assets/finger.png");
  }
  .icon4 {
    background-image: url("../../assets/send-message.png");
  }
}
.button:active {
  background-color: #e0e0e0;
}
</style>


