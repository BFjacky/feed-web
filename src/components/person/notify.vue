<template>
  <div class="container">
    <div class="header">我的通知</div>
    <div class="notifies-container">
      <div class="notify-box" v-for="(notify,index) in notifies" @click="clickNotifyBox(notify,index)" v-bind:class="clickingAni[index]">
        <div class="left">
          <div class="head">
            <div class="avatar" v-bind:style="{backgroundImage:`url(${notify.commentInfo.avatarUrl})`}"></div>
            <div class="title">
              <div class="name">{{notify.commentInfo.nickName}}</div>
              <div class="text"> 回复了你</div>
            </div>
          </div>
          <div class="main">{{notify.commentInfo.content}}</div>
          <div class="footer">{{notify.createdAt}}</div>
        </div>
        <div class="right">
          <div class="content-box">{{notify.sourceContent}}</div>
        </div>
      </div>
      <div class="nomore-remind">没有更多了</div>
    </div>
    <popup v-model="popupVisible" class="popup" >
      <div class="item" @click="gotoCommentPage">查看此条动态</div>
    </popup>
  </div>
</template>
<script>
import axios from "axios";
import pageHelper from "./helper";
import helper from "../helper/helper";
import config from "../helper/config";
import { Popup } from "mint-ui";
export default {
  activated: async function() {
    //获得 notifies
    this.notifies = pageHelper.notifies;

    console.log(`获得了notifies`, this.notifies);
    this.notifies = helper.parseDate(this.notifies);

    //将所有notifies 设为已读
    const res = await axios({
      method: "post",
      url: `${config.url.feedUrl}/user/readNotify`,
      withCredentials: true,
      data: {
        notifies: this.notifies
      }
    });

    console.log(res);
  },
  components: {
    popup: Popup
  },
  data: function() {
    return {
      notifies: [],
      choosedNotify: "",
      clickingAni: [],
      popupVisible: false
    };
  },
  methods: {
    clickNotifyBox: function(notify, index) {
      //显示动画效果
      this.$set(this.clickingAni, index, "fade");
      setTimeout(() => {
        this.$set(this.clickingAni, index, "");
      }, 500);
      //显示toast
      this.popupVisible = true;
      this.choosedNotify = notify;
    },
    gotoCommentPage: async function() {
      //popupVisible
      this.popupVisible = false;

      let thread;
      if (this.choosedNotify.threadSourceId) {
        const threadData = await axios({
          method: "post",
          url: `${config.url.feedUrl}/thread/getOneThread`,
          withCredentials: true,
          data: {
            threadId: this.choosedNotify.threadSourceId
          }
        });
        thread = threadData.data.thread;
      }

      //commment 连套问题 FIX ME
      if (this.choosedNotify.commentSourceId) {
        const commentData = await axios({
          method: "post",
          url: `${config.url.feedUrl}/comment/getOneComment`,
          withCredentials: true,
          data: {
            commentId: this.choosedNotify.commentSourceId
          }
        });
        const comment = commentData.data.comment;
        const threadData = await axios({
          method: "post",
          url: `${config.url.feedUrl}/thread/getOneThread`,
          withCredentials: true,
          data: {
            threadId: comment.threadSourceId
          }
        });
        thread = threadData.data.thread;
      }
      //  获得点击的目标thread;
      this.$router.push({
        path: "/index/commentPage",
        query: {
          thread
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
// 点击notifyBox 的渐变动画效果
@keyframes fade-in-out {
  0% {
    background-color: #d4d4d400;
  }
  25% {
    background-color: #e6e6e6;
  }
  50% {
    background-color: #e6e6e6;
  }
  75% {
    background-color: #e6e6e6;
  }
  100% {
    background-color: #d4d4d400;
  }
}

.fade {
  animation: fade-in-out ease-in-out 0.5s;
}
.container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  overflow: auto;
}
.header {
  text-align: left;
  padding-left: 5vw;
  height: 6vh;
  line-height: 6vh;
  color: #555555;
  box-shadow: 0 2px 1px 1px rgb(207, 207, 207);
}
.notifies-container {
  height: 94vh;
  width: 100vw;
  overflow: auto;
}
.notify-box {
  border-bottom: 1px solid rgb(211, 211, 211);
  display: flex;
  justify-content: space-between;
  padding: 4vw;
  .left {
    display: flex;
    flex-direction: column;
    .head {
      display: flex;
      .avatar {
        height: 10vw;
        width: 10vw;
        border-radius: 5vw;
        background-size: 100% 100%;
      }
      .title {
        display: flex;
        .name {
          line-height: 10vw;
          height: 10vw;
          color: #47a4c9;
          padding-left: 2vw;
        }
        .text {
          line-height: 10vw;
          height: 10vw;
          padding-left: 1vw;
        }
      }
    }
    .main {
      padding: 1vw;
      margin-top: 1vw;
      text-align: left;
      font-size: 4vw;
    }
    .footer {
      margin-top: 3vw;
      font-size: 2.5vw;
      color: #a7a7a7;
      text-align: left;
    }
  }
  .right {
    .content-box {
      color: #b3b3b3;
      font-size: 2vw;
      height: 100%;
    }
  }
}
.nomore-remind {
  background-color: #eeeeee;
  text-align: center;
  height: 10vw;
  line-height: 10vw;
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
  animation: fade-in 0.3s ease-in-out forwards;
  height: 8vh;
  width: 60vw;
  .item {
    height: 8vh;
    width: 100%;
    text-align: center;
    line-height: 8vh;
    font-size: 4.5vw;
  }
}
</style>
