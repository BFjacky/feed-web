<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
    <div class="header">未读通知({{notifies.length}})</div>
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
          <div class="main">
            <div class="img" v-if="notify.imgs.length!==0" :style="{backgroundImage:`url(${notify.imgs[0].url})`}" @click.stop="previewImage(notify.imgs[0].url)"></div>
            <div class="content">{{notify.commentInfo.content}}</div>
          </div>
          <div class="footer">{{notify.createdAt}}</div>
        </div>
        <div class="right">
          <div class="content-box">{{notify.sourceContent}}</div>
        </div>
      </div>
      <praise-info-bar class="praise-box" v-for="notify in praiseNotifies" :notify ="notify" :key="notify.key"></praise-info-bar>
      <div style="color: #888888;text-align: center;width: 100vw;padding:3vw 0">没有更多了...</div>
    </div>
    <div class="header">已读通知</div>
    <div class="notifies-container" >
      <div class="notify-box" v-for="(notify,index) in oldNotifies" @click="clickNotifyBox(notify,index)" v-bind:class="clickingAni[index]">
        <div class="left">
          <div class="head">
            <div class="avatar" v-bind:style="{backgroundImage:`url(${notify.commentInfo.avatarUrl})`}"></div>
            <div class="title">
              <div class="name">{{notify.commentInfo.nickName}}</div>
              <div class="text"> 回复了你</div>
            </div>
          </div>
          <div class="main">
            <div class="img" v-if="notify.imgs.length!==0" :style="{backgroundImage:`url(${notify.imgs[0].url})`}" @click.stop="previewImage(notify.imgs[0].url)"></div>
            <div class="content">{{notify.commentInfo.content}}</div>
          </div>
          <div class="footer">{{notify.createdAt}}</div>
        </div>
        <div class="right">
          <div class="content-box">{{notify.sourceContent}}</div>
        </div>
      </div>
    </div>
    <div class="spinner-box">
        <spinner type="triple-bounce" color="#32a8fc" v-if="busy"></spinner>
        <div class="text-line" v-if="nomore">没有更多了...</div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import helper from "../helper/helper";
import config from "../helper/config";
import store from "../helper/store";
import praiseInfoBar from "./components/praiseInfoBar";
import { Spinner } from "mint-ui";
export default {
  activated: async function() {
    console.log(`进入了notify页面`, this.notifies, store.notify.notifies);
    //获得 notifies
    this.notifies = store.notify.notifies;
    store.notify.notifies = [];
    this.notifies = helper.parseDate(this.notifies);

    //首次获得oldNotifies的时候，将busy设置为true,禁用loadmore
    this.busy = true;
    //获得oldNotifies
    const oldNotifiesRes = await axios({
      method: "get",
      url: `${config.url.feedUrl}/user/getOldNotifies`,
      withCredentials: true,
      params: {}
    });
    console.log(`获得旧的notify`, oldNotifiesRes);
    let oldNotifies = oldNotifiesRes.data.oldNotifies;
    oldNotifies = helper.parseDate(oldNotifies);
    this.oldNotifies = oldNotifies;
    if (this.oldNotifies.length < 15) {
      this.nomore = true;
    }
    this.busy = false;
    //将所有notifies 设为已读
    const res = await axios({
      method: "post",
      url: `${config.url.feedUrl}/user/readNotify`,
      withCredentials: true,
      data: {
        notifies: this.notifies
      }
    });

    //获得点赞的通知(即:所有有新的点赞状态点赞)
    this.praiseNotifies = store.notify.praiseThreads.concat(
      store.notify.praiseComments
    );
    this.praiseNotifies = helper.parseDate(this.praiseNotifies);
    console.log(`get in notify page and find the solution`,this.praiseNotifies)
  },
  components: {
    spinner: Spinner,
    praiseInfoBar
  },
  data: function() {
    return {
      notifies: [],
      oldNotifies: [],
      praiseNotifies: [],
      choosedNotify: "",
      clickingAni: [],
      busy: false,
      nomore: false
    };
  },
  methods: {
    clickNotifyBox: function(notify, index) {
      this.choosedNotify = notify;
      helper.popup([{ text: "查看此条状态" }]).then(async item => {
        if (item) {
          switch (item.text) {
            case "查看此条状态":
              await this.gotoCommentPage();
              break;
          }
        }
      });
    },
    loadMore: async function() {
      if (this.nomore) {
        return;
      }
      this.busy = true;
      const oldNotifiesRes = await axios({
        method: "get",
        url: `${config.url.feedUrl}/user/getOldNotifies`,
        withCredentials: true,
        params: {
          objectId: this.oldNotifies[this.oldNotifies.length - 1]._id
        }
      });
      let oldNotifies = oldNotifiesRes.data.oldNotifies;
      oldNotifies = helper.parseDate(oldNotifies);
      if (oldNotifies.length <= 5) {
        this.nomore = true;
      }
      this.oldNotifies = this.oldNotifies.concat(oldNotifies);
      this.busy = false;
    },
    gotoCommentPage: async function() {
      let thread;
      const threadData = await axios({
        method: "post",
        url: `${config.url.feedUrl}/thread/getSourceThread`,
        withCredentials: true,
        data: {
          commentId: this.choosedNotify.commentId
        }
      });
      thread = threadData.data.thread;

      console.log("跳转钱获得了thread了吧:", thread);
      //  获得点击的目标thread;
      this.$router.push({
        name: "commentPage",
        query: {
          thread
        }
      });
    },
    previewImage: async function(url) {
      const urls = [url];
      wx.previewImage({ urls });
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
  -webkit-overflow-scrolling: touch;
  background-color: white;
}
.header {
  text-align: left;
  padding-left: 5vw;
  height: 6vh;
  line-height: 6vh;
  color: #555555;
  background-color: #fafafa;
  border-top: 1px solid rgb(223, 223, 223);
  border-bottom: 1px solid rgb(223, 223, 223);
  // box-shadow: 0 2px 1px 1px rgb(204, 204, 204);
}
.notifies-container {
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
  width: 100vw;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.praise-box{
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
      padding-left: 3vw;
      margin-top: 1vw;
      width: 70vw;
      text-align: left;
      font-size: 4vw;
      .img {
        background-size: 100% 100%;
        width: 28vw;
        height: 28vw;
      }
      .content {
        margin-top: 2vw;
      }
    }
    .footer {
      margin-top: 3vw;
      font-size: 2.5vw;
      color: #a7a7a7;
      text-align: left;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .content-box {
      border: 0px solid black;
      color: #b3b3b3;
      font-size: 2vw;
      line-height: 4vw;
      max-height: 31vw;
      max-width: 20vw;
      overflow: auto;
      text-overflow: ellipsis;
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
.spinner-box {
  height: 10vh;
  width: 100vw;
  .text-line {
    color: #888888;
    text-align: center;
    width: 100vw;
    padding: 2vw 0;
  }
}
</style>
