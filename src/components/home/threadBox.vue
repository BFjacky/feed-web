<template>
  <div class="container" v-show="!isShield&&!isDelete" @click="clickBox" :class="{fade:fade}">
      <div class="header">
          <div class="part1" v-bind:style="{backgroundImage:`url(${thread.avatarUrl})`}"></div>
          <div class="part2">
              <div class="name-part">{{thread.nickName}}</div>
              <div class="time-part">{{thread.createdAt}}</div>
          </div>
          <div class="part3">
              {{thread.themeText}}
          </div>
      </div>
      <div class="main">
          <div class="content-text">{{thread.content}}</div>
          <div class="content-buttons"></div>
          <video x5-video-player-type="h5" x-webkit-airplay="true" playsinline webkit-playsinline="true" v-if="thread.video" class="video" :src="thread.video.sourceUrl" controls="controls"></video>
          <div class="imgs-part">
            <img @click.stop="previewImage(img)" :style="singleImgStyle"  class="img"  v-for="img in thread.imgs" v-bind:src="thread.imgs.length===1?img.urlMiddle:img.url"></img>
          </div>
      </div>
      <div class="footer">
          <div class="buttons">
              <div class="button-praise" @click.stop="praise">
                  <div v-bind:class="{icon:!thread.hasPraised,'icon-praised':thread.hasPraised}"></div>
                  <div class="text">{{thread.praises}}</div>
              </div>
              <div class="button-comment" @click.stop="gotoComment">
                  <div class="icon"></div>
                  <div class="text">{{thread.comments}}</div>
              </div>
              <div class="button-share">
                  <div class="icon" @click.stop="share"></div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
import helper from "../helper/helper";
import events from "../helper/events";
import { Toast, MessageBox } from "mint-ui";
export default {
  props: ["thread"],
  created: async function() {
    //获得图片宽高
    if (this.thread.imgs.length === 1) {
      const img = new Image();
      img.src = this.thread.imgs[0].urlMiddle;
      if (img.complete) {
        const height = 65 * img.height / img.width + "vw";
        const width = "65vw";
        this.singleImgStyle = { height: height, width: width };
      } else {
        img.onload = () => {
          const height = 65 * img.height / img.width + "vw";
          const width = "65vw";
          this.singleImgStyle = { height: height, width: width };
          img.onload = null; //避免重复加载
        };
      }
    }

    events.$on("deleteThread", threadId => {
      if (this.thread._id === threadId) {
        this.isDelete = true;
      }
    });
    events.$on("shieldThread", uid => {
      if (this.thread.uid === uid) {
        this.isShield = true;
      }
    });
  },
  components: {
    Toast
  },
  data: function() {
    return {
      //避免用户频繁点赞，过度消耗资源
      praiseLock: false,
      singleImgStyle: {},
      fade: false,
      isDelete: false,
      isShield: false,
      item1Text: "",
      myself: false
    };
  },
  methods: {
    praise: async function() {
      const res = await helper.checkOauth();
      if (!res) {
        return;
      }
      if (this.praiseLock) {
        Toast({
          message: "操作太快了...",
          position: "middle",
          duration: 500
        });
        return;
      }
      this.praiseLock = true;
      if (this.thread.hasPraised) {
        //如果已经点赞,则取消点赞
        const cancelRes = await axios({
          url: `${config.url.feedUrl}/thread/cancelPraise`,
          method: "post",
          data: {
            _id: this.thread._id
          },
          withCredentials: true
        });
        this.thread.hasPraised = false;

        //FiX ME 点赞之后不去查询该条说说最新的点赞总数，只是单纯在客户端将点赞数减一
        this.thread.praises = this.thread.praises - 1;
      } else {
        const praiseRes = await axios({
          url: `${config.url.feedUrl}/thread/praise`,
          method: "post",
          data: {
            _id: this.thread._id
          },
          withCredentials: true
        });
        this.thread.hasPraised = true;

        //FiX ME 点赞之后不去查询该条说说最新的点赞总数，只是单纯在客户端将点赞数加一
        this.thread.praises = this.thread.praises + 1;
      }

      this.praiseLock = false;
    },
    gotoComment: async function() {
      const res = await helper.checkOauth();
      if (!res) {
        return;
      }
      this.$router.push({
        name: "commentPage",
        query: {
          thread: this.thread
        }
      });
    },
    previewImage: async function(img) {
      const urls = [];
      const current = img.sourceUrl;
      for (const tempImg of this.thread.imgs) {
        urls.push(tempImg.sourceUrl);
      }
      wx.previewImage({ current, urls });
    },
    share: async function() {
      // helper.wxShare();
      alert("暂无分享功能");
    },
    clickBox: function() {
      //查看该用户是否已经关注了此用户
      this.item1Text = "关注此用户";
      for (const focusUser of config.user.focus) {
        if (focusUser.uid == this.thread.uid) {
          this.item1Text = "取消关注此用户";
          break;
        }
      }
      //查看此用户是否为自己，若为自己则不显示关注或屏蔽
      if (this.thread.uid == config.user._id) {
        this.myself = true;
      } else {
        this.myself = false;
      }

      let items = [];
      if (this.myself) {
        items = [{ text: "删除这条动态" }];
      } else {
        items = [{ text: this.item1Text }, { text: "屏蔽此人的动态" }];
      }
      helper.popup(items).then(async item => {
        if (item) {
          switch (item.text) {
            case "删除这条动态":
              await this.deleteThis();
              break;
            case "屏蔽此人的动态":
              await this.shieldThis();
              break;
            case "关注此用户":
              await this.focusThis();
              break;
            case "取消关注此用户":
              await this.focusThis();
              break;
          }
        }
      });
    },
    focusThis: async function() {
      if (this.item1Text === "关注此用户") {
        const res = await axios({
          url: `${config.url.feedUrl}/user/focus`,
          method: "post",
          withCredentials: true,
          data: {
            uid: this.thread.uid
          }
        });
        //更新本地的
        const { focus } = res.data;
        if (focus !== undefined) {
          config.user.focus = focus;
        }
      } else {
        const res = await axios({
          url: `${config.url.feedUrl}/user/cancelFocus`,
          method: "post",
          withCredentials: true,
          data: {
            uid: this.thread.uid
          }
        });
        //更新本地的
        const { focus } = res.data;
        if (focus !== undefined) {
          config.user.focus = focus;
        }
      }
    },
    shieldThis: async function() {
      const _this = this;
      MessageBox.confirm("以后将无法查看此用户的状态")
        .then(async action => {
          if (action === "confirm") {
            const res = await axios({
              url: `${config.url.feedUrl}/user/shields`,
              method: "post",
              withCredentials: true,
              data: {
                uid: _this.thread.uid
              }
            });
            //更新本地的
            const { shields } = res.data;
            if (shields !== undefined) {
              config.user.shields = shields;
            }
            events.$emit("shieldThread", _this.thread.uid);
          }
        })
        .catch(() => {});
    },
    deleteThis: async function() {
      const _this = this;
      MessageBox.confirm("删除后将不会出现在你或其他人的动态中")
        .then(async action => {
          if (action === "confirm") {
            const res = await axios({
              url: `${config.url.feedUrl}/thread/deleteThread`,
              method: "post",
              withCredentials: true,
              data: {
                thread: _this.thread
              }
            });
            //更新本地的
            console.log("删除完了:", res.data);
            events.$emit("deleteThread", _this.thread._id);
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
// .mask {
//   height: 100vh;
//   width: 100vw;
//   background-color: black;
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 10000;
// }
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
@keyframes fade-in {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.container {
  border-bottom: 2vw solid #eeeded;
  width: 90vw;
  overflow-x: hidden;
  padding: 3vw 5vw;
  display: flex;
  flex-direction: column;
}
.header {
  height: 8vh;
  width: 100%;
  display: flex;
  .part1 {
    height: 8vh;
    width: 8vh;
    background-size: 80% 80%;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 2vw;
  }
  .part2 {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 8vh;
    text-align: left;
    margin-left: 3vw;
    justify-content: center;
    .name-part {
      color: #47a4c9;
    }
    .time-part {
      font-size: 3vw;
      color: #c9c9c9;
    }
  }
  .part3 {
    height: 8vh;
    line-height: 8vh;
    color: #883b6a;
  }
}
.main {
  width: 100%;
  overflow: hidden;
  margin-top: 2vh;
  .content-text {
    text-align: left;
  }
  .video {
    margin-top:5vw;
    margin-left: 1vw;
    box-shadow: 1px 1px 1px 1px #dadada;
    width: 90vw;
    height: calc(90vw*9/16);
  }
  .imgs-part {
    display: flex;
    flex-wrap: wrap;
    margin-top: 2vh;
    .img {
      height: 28vw;
      width: 28vw;
      margin-bottom: 1vw;
      margin-left: 1vw;
    }
    .img:nth-child(1) {
      margin-left: 0;
    }
  }
}
.footer {
  height: 3vh;
  width: 100%;
  margin-top: 3vh;
  display: flex;
  .buttons {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .button-praise {
      height: 3vh;
      width: 10vh;
      display: flex;
      .icon {
        flex-shrink: 0;
        height: 3vh;
        width: 3vh;
        background-image: url("../../assets/like.png");
        background-size: 100% 100%;
      }
      //已经点过赞
      .icon-praised {
        flex-shrink: 0;
        height: 3vh;
        width: 3vh;
        background-image: url("../../assets/like-after.png");
        background-size: 100% 100%;
      }
      .text {
        text-align: center;
        line-height: 3vh;
        margin-left: 3vw;
        font-size: 4vw;
        color: #e2e2e2;
      }
    }
    .button-comment {
      margin-left: 7vw;
      height: 3vh;
      width: 10vh;
      display: flex;
      .icon {
        flex-shrink: 0;
        height: 3vh;
        width: 3vh;
        background-image: url("../../assets/comment.png");
        background-size: 100% 100%;
      }
      .text {
        text-align: center;
        line-height: 3vh;
        margin-left: 3vw;
        font-size: 4vw;
        color: #e2e2e2;
      }
    }
    .button-share {
      margin-left: 7vw;
      height: 3vh;
      width: 10vh;
      display: flex;
      .icon {
        flex-shrink: 0;
        height: 3vh;
        width: 3vh;
        background-image: url("../../assets/share.png");
        background-size: 100% 100%;
      }
      .text {
        text-align: center;
        line-height: 3vh;
        margin-left: 3vw;
        font-size: 4vw;
        color: #e2e2e2;
      }
    }
  }
}
</style>
