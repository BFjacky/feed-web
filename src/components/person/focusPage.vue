<template>
  <div class="container">
    <div class="personBox" v-for="user in users" @click="clickUserBox(user)">
      <div class="left" v-bind:style="{backgroundImage:`url(${user.avatarUrl})`}"></div>
      <div class="right">
        <div class="name">{{user.nickName}}</div>
        <div v-bind:class="{boy:user.gender===1,girl:user.gender===2}"></div>
      </div>
    </div>
    <div class="nomore-text">{{remindText}}</div>
    <!-- <popup class="popup" v-model="popupVisible" pop-transition="popup-fade">
      <div class="item" @click="cancelFocus">取消关注</div>
    </popup> -->
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
import events from "../helper/events";
import helper from "../helper/helper";
export default {
  data: function() {
    return {
      users: [],
      choiseUser: {},
      remindText: "没有数据了..."
    };
  },
  activated: async function() {
    const res = await axios({
      url: `${config.url.feedUrl}/user/getFocusUesrById`,
      withCredentials: true
    });
    this.users = res.data.users;
  },
  methods: {
    clickUserBox: function(user) {
      this.choiseUser = user;
      helper
        .popup([{ text: "取消关注" }, { text: "查看他的状态" }])
        .then(async item => {
          if (item) {
            switch (item.text) {
              case "取消关注":
                await this.cancelFocus();
                break;
              case "查看他的状态":
                console.log("查看他的状态");
                break;
            }
          }
        });
    },
    cancelFocus: async function() {
      const cancelRes = await axios({
        method: "post",
        url: `${config.url.feedUrl}/user/cancelFocus`,
        data: {
          uid: this.choiseUser._id
        },
        withCredentials: true
      });
      if (cancelRes.data.success) {
        config.user.shields = cancelRes.data.shields;
        let users = this.users;
        this.$lodash.remove(users, user => {
          return user._id === this.choiseUser._id;
        });
        this.users = [];
        this.users = users;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.personBox {
  border-bottom: 1px solid rgb(187, 187, 187);
  height: 15vh;
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
.personBox:active {
  background-color: #e0e0e0;
}
@keyframes fade-in {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.popup {
  width: 65vw;
  display: flex;
  flex-direction: column;
  animation: fade-in 0.3s forwards ease-in-out;
  .item {
    height: 7vh;
    width: 100%;
    line-height: 7vh;
    font-size: 3.5vh;
  }
}
.nomore-text {
  height: 5vh;
  color: #949494;
  line-height: 5vh;
  font-size: 3vh;
}
</style>