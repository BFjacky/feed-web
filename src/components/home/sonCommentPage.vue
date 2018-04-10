<template>
  <div class="container">
    <div class="content-container">
        <div class="thread-container" @click="replyMainComment">
          <div class="header">
              <div class="part1" v-bind:style="{backgroundImage:`url(${comment.avatarUrl})`}"></div>
              <div class="part2">
                  <div class="name-part">{{comment.nickName}}</div>
                  <div class="time-part">{{comment.createdAt}}</div>
              </div>
          </div>
          <div class="main">
              <div class="content-text">{{comment.content}}</div>
              <div class="content-buttons"></div>
              <div class="imgs-part"  v-if="comment.imgs.length>0">
                <img @click.stop="previewImage(img)"  class="img" :style="singleImgStyle" v-for="img in comment.imgs" v-bind:src="comment.imgs.length===1?img.urlMiddle:img.url"></img>
              </div>
          </div>
          <div class="footer">
              <div class="buttons">
                  <div class="button-praise" @click.stop="praiseComment">
                      <div v-bind:class="{icon:!comment.hasPraised,'icon-praised':comment.hasPraised}"></div>
                      <div class="text">{{comment.praises}}</div>
                  </div>
                  <div class="button-share">
                      <div class="icon" @click.stop="share"></div>
                  </div>
              </div>
          </div>
        </div>
        <div class="comment-show">
            <div class="content-box-title">全部评论({{comments.length}})</div>
            <comment-box v-for="comment in comments" :comment="comment" @replyComment="replyComment" @replySonComment="replySonComment" type="second"></comment-box>
            <div class="divide-line"></div>
        </div>
        <post-bar v-on:sendButton="sendAcomment" :replyFor="replyFor"></post-bar>
        </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
import helper from "../helper/helper";
import events from "../helper/events";
import postBar from "./components/postBar";
import commentBox from "./components/commentBox";
import { Toast } from "mint-ui";
export default {
  activated: async function() {
    if (!this.$route.query.comment._id) {
      //路由回退不带参数
      console.log(`从其他路由回退过来`);
      return;
    }

    this.comment = this.$route.query.comment;

    await this.initComments();
    this.comment = helper.parseDate([this.comment])[0];
    //获得图片宽高
    if (this.comment.imgs.length === 1) {
      const img = new Image();
      img.src = this.comment.imgs[0].urlMiddle;
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
  },
  components: {
    Toast,
    postBar,
    commentBox
  },
  data: function() {
    return {
      comment: {},
      //此条comment的comments
      comments: [],
      //当前选中的commentId
      commentId: "",
      //防止用户过度点赞
      praiseLock: false,
      //在输入框提示 回复谁 的文字
      replyFor: "",
      sending: false,
      singleImgStyle: {},
      commentBox
    };
  },
  watch: {
    comments: function() {
      for (let comment of this.comments) {
        //每条comment的最大显示评论的数量
        comment.maxNumber = 2;
      }
      this.comments = helper.parseDate(this.comments);
    }
  },
  methods: {
    // ---------comment 方法
    praiseComment: async function() {
      const res = await helper.checkOauth();
      if (!res) {
        return;
      }
      if (this.praiseLock) {
        Toast({
          message: "客官慢点...",
          position: "middle",
          duration: 500
        });
        return;
      }
      this.praiseLock = true;
      if (this.comment.hasPraised) {
        //如果已经点赞,则取消点赞
        const cancelRes = await axios({
          url: `${config.url.feedUrl}/comment/cancelPraise`,
          method: "post",
          data: {
            _id: this.comment._id
          },
          withCredentials: true
        });
        this.comment.hasPraised = false;

        //FiX ME 点赞之后不去查询该条说说最新的点赞总数，只是单纯在客户端将点赞数减一
        this.comment.praises = this.comment.praises - 1;
      } else {
        const praiseRes = await axios({
          url: `${config.url.feedUrl}/comment/praise`,
          method: "post",
          data: {
            _id: this.comment._id
          },
          withCredentials: true
        });
        this.comment.hasPraised = true;

        //FiX ME 点赞之后不去查询该条说说最新的点赞总数，只是单纯在客户端将点赞数加一
        this.comment.praises = this.comment.praises + 1;
      }

      this.praiseLock = false;
    },
    previewImage: async function(img) {
      const urls = [];
      const current = img.sourceUrl;
      for (const tempImg of this.comment.imgs) {
        urls.push(tempImg.sourceUrl);
      }
      wx.previewImage({ current, urls });
    },
    share: async function() {
      // helper.wxShare();
      alert("暂无分享功能");
    },

    //-------comments 方法
    initComments: async function() {
      //获得此条comment的评论
      const commentRes = await axios({
        url: `${config.url.feedUrl}/comment/getComment`,
        method: "get",
        withCredentials: true,
        params: {
          _id: this.comment._id,
          sourse: "comment"
        }
      });
      if (!commentRes.data.success) {
        alert("未能获取到评论信息!");
        return;
      }
      if (commentRes.data.success) {
        //获得二级评论
        let newComments = commentRes.data.comments;
        //获得三级评论
        newComments = await axios({
          url: `${config.url.feedUrl}/comment/getAllSubComments`,
          method: "post",
          withCredentials: true,
          data: {
            comments: newComments
          }
        });
        newComments = newComments.data.comments;
        //遍历获得的comments，将所有的commentInfo中的XXX回复XXX填在replyFor字段上
        for (const comment of newComments) {
          for (const commentInfo of comment.commentInfo) {
            if (commentInfo.commentSourceId == comment._id) {
              //此条comment回复的是此条二级评论
            } else {
              //此条comment回复的是其他三级及以上评论
              for (const commentInfo2 of comment.commentInfo) {
                if (commentInfo.commentSourceId == commentInfo2._id) {
                  commentInfo.replyFor =
                    commentInfo.nickName + " 回复 " + commentInfo2.nickName;
                  break;
                }
              }
            }
            // console.log(commentInfo.replyFor);
          }
        }
        this.comments = newComments;
        for (const ele of this.comments) {
          console.log(`fsdfjaksfjaklfjaksf1~~~~~~~~~~~~~~~~~~~~~~~~~`,ele.commentInfo);
        }
      }
    },
    sendAcomment: async function(content, imgs) {
      if (this.sending) {
        return;
      }
      if (content.length === 0 || content == "") {
        Toast({
          message: "评论内容不得为空",
          position: "middle",
          duration: 1000
        });
        return;
      }
      this.sending = true;

      console.log(`即将发送请求发起评论`, this.commentId);
      const sendCommentRes = await axios({
        url: `${config.url.feedUrl}/thread/newComment`,
        method: "post",
        withCredentials: true,
        data: {
          _id: !this.commentId ? this.comment._id : this.commentId,
          comment: { content, imgs },
          sourse: "comment"
        }
      });

      this.sending = false;
      //评论完成后恢复状态
      this.replyFor = "";
      this.commentId = "";
      events.$emit("hasSent");
      if (sendCommentRes.data.success) {
        Toast({
          message: "评论成功",
          position: "middle",
          duration: 500
        });
      } else {
        Toast({
          message: "评论失败",
          position: "middle",
          duration: 1000
        });
      }
      //send comment后重新获取最新的评论信息
      await this.initComments();
    },
    //对主评论的回复
    replyMainComment: function() {
      this.replyFor = ``;
      this.commentId = "";
    },
    //对选中评论 的 回复
    replyComment: function(comment) {
      this.replyFor = `回复${comment.nickName}:`;
      this.commentId = comment.id;
    },
    //对选中子评论 的 回复
    replySonComment: function(comment) {
      this.replyFor = `回复${comment.nickName}:`;
      this.commentId = comment.id;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  justify-content: flex-start;
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: white;
}
.content-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: 100vh;
  overflow-x: hidden;
}
.divide-line {
  border-top: 7px solid rgb(241, 241, 241);
}
.thread-container {
  border-bottom: 2vw solid #eeeded;
  width: 100vw;
  padding: 3vw 5vw;

  .header {
    height: calc(8vw*16/9);
    width: 90vw;
    display: flex;
    .part1 {
      height: calc(8vw*16/9);
      width: calc(8vw*16/9);
      background-size: 80% 80%;
      background-position: center center;
      background-repeat: no-repeat;
      border-radius: 2vw;
    }
    .part2 {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      height: calc(8vw*16/9);
      text-align: left;
      justify-content: center;
      .name-part {
        color: #47a4c9;
      }
      .time-part {
        font-size: 3vw;
        color: #c9c9c9;
      }
    }
  }
  .main {
    width: 90vw;
    margin-top: calc(2vw*16/9);
    .content-text {
      text-align: left;
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
      .img:nth-child(1) {
        margin-left: 0;
      }
      .singleImg {
        width: 65vw;
        margin-bottom: 1vw;
      }
    }
  }
  .footer {
    height: calc(3vw*16/9);
    width: 90vw;
    margin-top: calc(3vw*16/9);
    display: flex;
    .buttons {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .button-praise {
        height: calc(3vw*16/9);
        width: calc(10vw*16/9);
        display: flex;
        .icon {
          flex-shrink: 0;
          height: calc(3vw*16/9);
          width: calc(3vw*16/9);
          background-image: url("../../assets/like.png");
          background-size: 100% 100%;
        }
        //已经点过赞
        .icon-praised {
          flex-shrink: 0;
          height: calc(3vw*16/9);
          width: calc(3vw*16/9);
          background-image: url("../../assets/like-after.png");
          background-size: 100% 100%;
        }
        .text {
          text-align: center;
          line-height: calc(3vw*16/9);
          margin-left: 3vw;
          font-size: 4vw;
          color: #e2e2e2;
        }
      }
      .button-comment {
        margin-left: 7vw;
        height: calc(3vw*16/9);
        width: calc(10vw*16/9);
        display: flex;
        .icon {
          flex-shrink: 0;
          height: calc(3vw*16/9);
          width: calc(3vw*16/9);
          background-image: url("../../assets/comment.png");
          background-size: 100% 100%;
        }
        .text {
          text-align: center;
          line-height: calc(3vw*16/9);
          margin-left: 3vw;
          font-size: 4vw;
          color: #e2e2e2;
        }
      }
      .button-share {
        margin-left: 7vw;
        height: calc(3vw*16/9);
        width: calc(10vw*16/9);
        display: flex;
        .icon {
          flex-shrink: 0;
          height: calc(3vw*16/9);
          width: calc(3vw*16/9);
          background-image: url("../../assets/share.png");
          background-size: 100% 100%;
        }
        .text {
          text-align: center;
          line-height: calc(3vw*16/9);
          margin-left: 3vw;
          font-size: 4vw;
          color: #e2e2e2;
        }
      }
    }
  }
}
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
            background-image: url("../../assets/like.png");
            background-size: 100% 100%;
            width: 5vw;
            height: 5vw;
          }
          .praise-after {
            background-image: url("../../assets/like-after.png");
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
.comment-make {
  box-shadow: 0 -1px 1px 1px rgb(180, 178, 178);
  flex-shrink: 0;
  background-color: white;
  height: 80px;
  bottom: 0;
  display: flex;
  width: 100vw;
  position: fixed;
  justify-content: space-around;
  padding: 0 0vw;
  .content-area {
    resize: none;
    padding: 5px 0;
    min-height: 40px;
    line-height: 20px;
    width: 80vw;
    font-size: 4vw;
    border-width: 0;
    box-sizing: border-box;
  }
  .send-button {
    margin-top: 5px;
    border-radius: 7.5vw;
    box-sizing: border-box;
    border: 1px solid #32a8fc;
    flex-shrink: 0;
    height: 30px;
    width: 15vw;
    flex-grow: 0;
    line-height: 30px;
    color: #32a8fc;
  }
}
</style>
