<template>
  <div class="container">
    <div class="header button" @click="wechatLogin">
      <div class="left" v-bind:style="{backgroundImage:`url(${avatarUrl})`}"></div>
      <div class="middle">
        <div class="name">{{nickName}}</div>
        <div v-bind:class="{boy:gender===1,girl:gender===2}"></div>
      </div>
      <div class="right">
        <div class="text1">粉丝数:{{followers.length}}</div>
      </div>
    </div>
    <div class="main">
      <div class="item button" @click="item1Click">
        <div class="icon icon1"></div>
        <div class="text">我发出的动态</div>
      </div>
      <div class="item button" @click="item2Click">
        <div class="icon icon2"></div>
        <div class="text">未读通知</div>
        <div class="number-text">{{notifies.length}}</div>
      </div>
      <div class="item button" @click="item3Click">
        <div class="icon icon1"></div>
        <div class="text">我的关注</div>
      </div>
        <div class="item button" @click="item4Click">
        <div class="icon icon1"></div>
        <div class="text">黑名单</div>
      </div>
      <!-- <div class="item button">
        <div class="icon icon3"></div>
        <div class="text">我收到的点赞</div>
      </div>
      <div class="item button">
        <div class="icon icon4"></div>
        <div class="text">我发出的回复</div>
      </div> -->
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
import pageHelper from "./helper";
export default {
  created: async function() {
    const userGet = await axios({
      url: `${config.url.feedUrl}/user/get`,
      withCredentials: true
    });
    config.user.fetching = false;
    this.prepared = true;
    if (!userGet.data || !userGet.data._id) {
      //未能获取到用户信息
      return;
    }
    const {
      avatarUrl,
      nickName,
      gender,
      _id,
      focus,
      followers,
      shields
    } = userGet.data;
    this.avatarUrl = avatarUrl;
    this.nickName = nickName;
    this.gender = gender;
    config.user.focus = focus;
    config.user.followers = followers;
    config.user.shields = shields;
    config.user.oauth = true;
    config.user._id = _id;
    //web-socket 通过 之前的http请求获得了该用户的用户信息后,发送一条socket消息;
    this.$socket.emit("init", _id);
  },
  activated: async function() {
    //查看 客户端 是否已经获得了用户信息
    const _this = this;
    async function checkPrepared() {
      return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (_this.prepared) {
            resolve("ok");
            clearInterval(intervalId);
          }
        }, 100);
      });
    }

    await checkPrepared();

    this.$options.sockets.res = data => {
      this.notifies =data;
    };
    this.followers = config.user.followers;
  },
  data: function() {
    return {
      avatarUrl: "",
      nickName: "点我登陆",
      gender: -1,
      notifiesNumber: 0,
      notifies: [],
      prepared: false,
      followers: []
    };
  },
  methods: {
    wechatLogin: function() {
      window.location.href = config.url.oauthUrl;
    },
    item1Click: function() {
      this.$router.push({ name: "mine" });
    },
    item2Click: function() {
      this.$router.push({ name: "notify" });
    },
    item3Click: function() {
      this.$router.push({ name: "focusPage" });
    },
    item4Click: function() {
      this.$router.push({ name: "shieldPage" });
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  position: fixed;
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
  .middle {
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
  .right {
    display: flex;
    flex-direction: column;
    margin-left: 20vw;
    .text1 {
      font-size: 4vw;
      color: #59a181;
    }
  }
}
.main {
  display: flex;
  flex-direction: column;
  border-top: 7px solid rgb(223, 223, 223);
  .item {
    height: 9vh;
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
  .number-text {
    padding: 0.5vw;
    height: 3.5vw;
    min-width: 3.5vw;
    background-color: rgb(248, 94, 94);
    border-radius: 1.75vw;
    line-height: 3.5vw;
    font-size: 3.5vw;
    color: white;
    text-align: center;
    position: relative;
    left: -1.5vw;
    top: -2vw;
  }
  .text {
    margin-left: 5vw;
  }
  .icon1 {
    background-image: url("../../assets/note.png");
  }
  .icon2 {
    background-image: url("../../assets/letter.png");
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


