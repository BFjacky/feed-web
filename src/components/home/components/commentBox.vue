<template>
  <div class="content-box" @click.stop="replyComment" :class="clickAnimation">
    <div class="left" v-bind:style="{backgroundImage:`url(${comment.avatarUrl})`}"></div>
      <div class="right">
        <div class="header">
          <div class="header-left">
            <div class="name">{{comment.nickName}}</div>
            <div class="time">{{comment.createdAt}}</div>
          </div>
          <div class="header-right">
            <div v-bind:class="{praise:!comment.hasPraised,'praise-after':comment.hasPraised}" @click.stop="praise"></div>
            <div class="number">{{comment.praises}}</div>
          </div>
        </div>
        <div class="main">{{comment.content}}</div>
        <div class="imgs-part" v-if="comment.imgs.length>0">
          <img @click.stop="previewImage"  class="img" v-for="img in comment.imgs" v-bind:src="img.url"></img>
        </div>
        <div class="footer"  v-if="comment.commentInfo.length>0" v-on:click.stop="goCommentDetailPage(comment)">
          <div class="footer-comment" v-for="(subComment,index) in comment.commentInfo" v-if="index<comment.maxNumber" @click.stop="replySonComment(subComment)">
              <div class="name">{{!subComment.replyFor?subComment.nickName:subComment.replyFor}}:</div>
              <div class="content">{{subComment.content}}</div>
          </div>
          <div class="open-button" v-on:click.stop="showComments(comment,'hot')" v-if="comment.commentInfo.length>=3 && comment.maxNumber<=2">还有{{comment.commentInfo.length-2}}条评论&nbsp&nbsp&nbsp>></div>
          <div class="open-button" v-on:click.stop="showComments(comment,'hot')" v-if="comment.commentInfo.length>=3 && comment.maxNumber>3">收起评论&nbsp&nbsp&nbsp>></div>
        </div>
      </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../../helper/config";
import helper from "../../helper/helper";
import events from "../../helper/events";
import common from "../../helper/common.css";
import { Toast } from "mint-ui";
export default {
  props: ["comment", "type"],
  data: function() {
    return {
      praiseLock: false,
      clickAnimation: ""
    };
  },
  methods: {
    replyComment: function() {
      this.clickAnimation = "clickFade";
      setTimeout(() => {
        this.clickAnimation = "";
      }, 300);
      this.$emit("replyComment", this.comment);
    },
    goCommentDetailPage: function() {
      //进入该评论的详情页面，如果已经是详情页面，则无操作
      if (this.type === "first") {
        this.$router.push({
          name: "sonCommentPage",
          query: { comment: this.comment }
        });
      }
    },
    replySonComment: function(subComment) {
      if (this.type === "first") {
        this.goCommentDetailPage();
        return;
      }
      this.$emit("replySonComment", subComment);
    },
    praise: async function() {
      if (this.praiseLock) {
        Toast({
          message: "客官慢点...",
          position: "middle",
          duration: 500
        });
        return;
      }
      this.praiseLock = true;
      //如果已经点过赞了则 取消点赞
      if (this.comment.hasPraised) {
        const praiseRes = await axios({
          url: `${config.url.feedUrl}/comment/cancelPraise`,
          method: "post",
          withCredentials: true,
          data: {
            _id: this.comment._id
          }
        });
        this.comment.hasPraised = false;
        this.comment.praises--;
      } else {
        const praiseRes = await axios({
          url: `${config.url.feedUrl}/comment/praise`,
          method: "post",
          withCredentials: true,
          data: {
            _id: this.comment._id
          }
        });
        this.comment.hasPraised = true;
        this.comment.praises++;
      }

      this.praiseLock = false;
    },
    previewImage: function() {
      const urls = [this.comment.imgs[0].url];
      wx.previewImage({ urls });
    },
    showComments: function() {
      const tempInfo = this.comment.commentInfo;
      this.comment.commentInfo = [];
      this.comment.commentInfo = tempInfo;
      if (this.comment.maxNumber === 999) {
        this.comment.maxNumber = 2;
        return;
      }
      this.comment.maxNumber = 999;
    }
  }
};
</script>
<style lang="less" scoped>
.comment-show {
  flex-grow: 1;
  margin-bottom: 14vw;
  .content-box-title {
    height: 10vw;
    text-align: left;
    line-height: 10vw;
    padding-left: 10px;
  }
  .content-box {
    padding-top: 3vw;
    border-top: 1px solid rgb(233, 233, 233);
    display: flex;
    width: 100%;
    padding-left: 10px;
    padding: 3vw;
    .left {
      width: 15vw;
      height: 15vw;
      border-radius: 50%;
      background-size: 100% 100%;
    }
    .right {
      width: 75vw;
      display: flex;
      flex-direction: column;
      padding-left: 10px;
      div {
        border: 0px solid black;
        box-sizing: border-box;
      }
      .header {
        margin-top: 5px;
        width: 75vw;
        height: 10vw;
        display: flex;
        justify-content: space-between;
        .header-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            height: 5vw;
            text-align: left;
          }
          .time {
            margin-top: 1vw;
            height: 5vw;
            font-size: 3vw;
            text-align: left;
            color: #b9b9b9;
          }
        }
        .header-right {
          display: flex;
          margin-right: 3vw;
          margin-top: 1vw;
          .praise {
            background-image: url("../../../assets/like.png");
            background-size: 100% 100%;
            width: 5vw;
            height: 5vw;
          }
          .praise-after {
            background-image: url("../../../assets/like-after.png");
            background-size: 100% 100%;
            width: 5vw;
            height: 5vw;
          }
          .number {
            width: 5vw;
            height: 5vw;
            margin-left: 2vw;
            font-size: 4vw;
            line-height: 5vw;
            color: rgb(167, 165, 165);
          }
        }
        .praise {
          background-size: 100% 100%;
        }
      }
      .main {
        width: 75vw;
        margin-top: 2vw;
        text-align: left;
        font-size: 3.5vw;
      }
      .imgs-part {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: calc(2vw*16/9);
        .img {
          height: 28vw;
          width: 28vw;
          margin-left: 1vw;
          margin-bottom: 1vw;
        }
      }
      .footer {
        width: 75vw;
        margin-top: 3vw;
        background-color: rgb(230, 230, 230);
        flex-direction: column;
        border-radius: 5vw;
        padding: 10px;
        .footer-comment {
          width: 71vw;
          margin-top: 5px;
          border: 0px solid black;
          font-size: 3.5vw;
          text-align: left;
          overflow-y: hidden;
          max-height: 40vh;
          .name {
            height: 5vw;
            line-height: 5vw;
            float: left;
            flex-shrink: 0;
            color: #3594ca;
          }
          .content {
            line-height: 5vw;
            flex-grow: 1;
            word-wrap: break-word;
            text-align: left;
          }
        }
        .open-button {
          margin-top: 10px;
          font-size: 3vw;
        }
      }
    }
  }
}
</style>
