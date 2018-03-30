<template>
  <div class="container" v-show="!thread.needShield&&!isDelete" @click="clickBox" :class="{fade:fade}">
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
import { Toast, Popup } from "mint-ui";
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
  },
  components: {
    Toast,
    popup: Popup
  },
  data: function() {
    return {
      //避免用户频繁点赞，过度消耗资源
      praiseLock: false,
      singleImgStyle: {},
      fade: false,
      isDelete: false
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
        path: "/index/commentPage",
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
    clickBox: function() {
      events.$emit("clickBox", this.thread);
      //点击了箱子 添加动画效果
      this.fade = true;
      setTimeout(() => {
        this.fade = false;
      }, 500);
    },
    share: async function() {
      // helper.wxShare();
      alert("暂无分享功能");
    }
  }
};
</script>

<style lang="less" scoped>
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
