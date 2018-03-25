<template>
  <div class="container">
    <div class="header">我的通知</div>
    <div class="notifies-container">
      <div class="notify-box" v-for="notify in notifies">
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
  </div>
</template>
<script>
import axios from "axios";
import pageHelper from "./helper";
import helper from "../helper/helper";
export default {
  activated: async function() {
    //获得 notifies
    this.notifies = pageHelper.notifies;

    console.log(`获得了notifies`, this.notifies);
    this.notifies = helper.parseDate(this.notifies);
  },
  data: function() {
    return {
      notifies: []
    };
  }
};
</script>
<style lang="less" scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
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
</style>
