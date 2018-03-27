<template>
  <div class="container">

        <div class="thread-container">
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
                <img @click="previewImage(img)"  class="img" :class="{singleImg:thread.imgs.length===1}" v-for="img in thread.imgs" v-bind:src="thread.imgs.length===1?img.urlMiddle:img.url"></img>
              </div>
          </div>
          <div class="footer">
              <div class="buttons">
                  <div class="button-praise" @click="praiseThread">
                      <div v-bind:class="{icon:!thread.hasPraised,'icon-praised':thread.hasPraised}"></div>
                      <div class="text">{{thread.praises}}</div>
                  </div>
                  <div class="button-share">
                      <div class="icon" @click="share"></div>
                  </div>
              </div>
          </div>
        </div>





        <div class="comment-show"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
            <div class="content-box-title">热门评论({{hotComments.length}})</div>
            <div class="content-box" v-bind:class="hotFades[index]" v-for="(comment,index) in hotComments" @click="replyComment(comment,index,'hot')">
               <div class="left" v-bind:style="{backgroundImage:`url(${comment.avatarUrl})`}"></div>
               <div class="right">
                    <div class="header">
                      <div class="header-left">
                        <div class="name">{{comment.nickName}}</div>
                        <div class="time">{{comment.createdAt}}</div>
                      </div>
                      <div class="header-right">
                        <div v-bind:class="{praise:!comment.hasPraised,'praise-after':comment.hasPraised}" v-on:click.stop="praise(comment)"></div>
                        <div class="number">{{comment.praises}}</div>
                      </div>
                    </div>
                    <div class="main">{{comment.content}}</div>
                    <div class="footer"  v-if="comment.commentInfo.length>0">
                      <div class="footer-comment" v-for="(subComment,index) in comment.commentInfo"  v-if="index<comment.maxNumber">
                        <div class="name">{{subComment.nickName}}:</div>
                        <div class="content">{{subComment.content}}</div>
                      </div>
                      <div class="open-button" v-on:click.stop="showComments(comment,'hot')" v-if="comment.commentInfo.length>=3 && comment.maxNumber<=2">还有{{comment.commentInfo.length-2}}条评论&nbsp&nbsp&nbsp>></div>
                      <div class="open-button" v-on:click.stop="showComments(comment,'hot')" v-if="comment.commentInfo.length>=3 && comment.maxNumber>3">收起评论&nbsp&nbsp&nbsp>></div>
                    </div>
                </div>
            </div>
            <div class="divide-line"></div>
            <div class="content-box-title">最新评论({{comments.length}})</div>
            <div class="content-box" v-bind:class="fades[index]" v-for="(comment,index) in comments" @click="replyComment(comment,index,'')">
               <div class="left" v-bind:style="{backgroundImage:`url(${comment.avatarUrl})`}"></div>
               <div class="right">
                    <div class="header">
                      <div class="header-left">
                        <div class="name">{{comment.nickName}}</div>
                        <div class="time">{{comment.createdAt}}</div>
                      </div>
                      <div class="header-right">
                        <div v-bind:class="{praise:!comment.hasPraised,'praise-after':comment.hasPraised}" v-on:click.stop="praise(comment)"></div>
                        <div class="number">{{comment.praises}}</div>
                      </div>
                    </div>
                    <div class="main">{{comment.content}}</div>
                    <div class="footer"  v-if="comment.commentInfo.length>0">
                      <div class="footer-comment" v-for="(subComment,index) in comment.commentInfo"  v-if="index<comment.maxNumber">
                        <div class="name">{{subComment.nickName}}:</div>
                        <div class="content">{{subComment.content}}</div>
                      </div>
                      <div class="open-button" v-on:click.stop="showComments(comment,'')" v-if="comment.commentInfo.length>=3 && comment.maxNumber<=2">还有{{comment.commentInfo.length-2}}条评论&nbsp&nbsp&nbsp>></div>
                      <div class="open-button" v-on:click.stop="showComments(comment,'')" v-if="comment.commentInfo.length>=3 && comment.maxNumber>3">收起评论&nbsp&nbsp&nbsp>></div>
                    </div>
                </div>
            </div>
            <div class="divide-line"></div>
        </div>
        <div class="comment-make">
            <textarea class="content-area" :maxlength="maxWordsLength" :placeholder="commentPlaceHolder" v-model:value="content"></textarea> 
            <div class="send-button" v-on:click="sendAcomment">发送</div>
        </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
import helper from "../helper/helper";
import { Toast } from "mint-ui";
export default {
  activated: async function() {
    await this.initComments();
    this.thread = helper.parseDate([this.thread])[0];
  },
  components: {
    Toast
  },
  data: function() {
    return {
      thread: {},
      //此条thread的comments
      comments: [],
      //用户评论的内容
      content: "",
      //当前选中的commentId
      commentId: "",
      //评论区placeholder
      commentPlaceHolder: "友善的发言更容易获得朋友",
      //评论最大字数
      maxWordsLength: 150,
      //进行评论时的对象: thread||comment
      sourse: "thread",
      //防止用户过度点赞
      praiseLock: false,
      busy: false,
      nomore: false,
      hotComments: [],
      //在输入框提示 回复谁 的文字
      replyFor: "",

      fades: [],
      hotFades: []
    };
  },
  watch: {
    comments: function() {
      for (let comment of this.comments) {
        //每条comment的最大显示评论的数量
        comment.maxNumber = 2;
      }
      this.comments = helper.parseDate(this.comments);
    },
    content: function() {
      //判断当前replyFor 的 文字 有没有没修改一旦 replyFor的文字被修改了,清空这个效果,将sourse改为thread
      for (let i = 0; i < this.replyFor.length; i++) {
        if (this.replyFor[i] !== this.content[i]) {
          this.replyFor = "";
          this.content = "";
          this.sourse = "thread";
          this.commentId = "";
          break;
        }
      }
    },
    hotComments: function() {
      for (let comment of this.hotComments) {
        //每条comment的最大显示评论的数量
        comment.maxNumber = 2;
      }
      this.hotComments = helper.parseDate(this.hotComments);
    }
  },
  methods: {
    // ---------threads 方法
    praiseThread: async function() {
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

    //-------comments 方法
    initComments: async function() {
      this.busy = true;

      this.thread = this.$route.query.thread;
      //获得此条thread的热门评论(点赞量前三)
      const hotCommentRes = await axios({
        url: `${config.url.feedUrl}/comment/getHotComment`,
        method: "get",
        withCredentials: true,
        params: {
          _id: this.thread._id,
          sourse: "thread"
        }
      });
      if (!hotCommentRes.data.success) {
        alert("未能获取到热门评论信息!");
        return;
      }
      if (hotCommentRes.data.success) {
        this.hotComments = hotCommentRes.data.comments;
      }
      //获得此条thread的评论
      const commentRes = await axios({
        url: `${config.url.feedUrl}/comment/getComment`,
        method: "get",
        withCredentials: true,
        params: {
          _id: this.thread._id,
          sourse: "thread"
        }
      });
      if (!commentRes.data.success) {
        alert("未能获取到评论信息!");
        return;
      }
      if (commentRes.data.success) {
        this.comments = commentRes.data.comments;
      }

      this.busy = false;
    },
    loadMore: async function() {
      if (this.nomore) {
        return;
      }
      this.busy = true;
      //获得此条thread的评论
      const commentRes = await axios({
        url: `${config.url.feedUrl}/comment/getComment`,
        method: "get",
        withCredentials: true,
        params: {
          _id: this.thread._id,
          sourse: "thread",
          commentId: this.comments[this.comments.length - 1]._id
        }
      });
      if (!commentRes.data.success) {
        alert("未能获取到评论信息!");
        return;
      }
      if (commentRes.data.success) {
        this.comments = this.comments.concat(commentRes.data.comments);
      }
      if (commentRes.data.comments.length < 10) {
        this.nomore = true;
      }
      this.busy = false;
    },
    sendAcomment: async function() {
      if (this.content.length === 0 || this.content == "") {
        Toast({
          message: "评论内容不得为空",
          position: "middle",
          duration: 1000
        });
        return;
      }
      //去掉评论内容的前缀
      this.content = this.content.slice(this.replyFor.length);

      const sendCommentRes = await axios({
        url: `${config.url.feedUrl}/thread/newComment`,
        method: "post",
        withCredentials: true,
        data: {
          _id: this.sourse === "thread" ? this.thread._id : this.commentId,
          comment: { content: this.content },
          sourse: this.sourse
        }
      });
      //评论完成后恢复状态
      this.content = "";
      this.sourse = "thread";
      this.replyFor = "";
      this.commentId = "";
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
    praise: async function(comment) {
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
      if (comment.hasPraised) {
        const praiseRes = await axios({
          url: `${config.url.feedUrl}/comment/cancelPraise`,
          method: "post",
          withCredentials: true,
          data: {
            _id: comment._id
          }
        });
        comment.hasPraised = false;
        comment.praises--;
      } else {
        const praiseRes = await axios({
          url: `${config.url.feedUrl}/comment/praise`,
          method: "post",
          withCredentials: true,
          data: {
            _id: comment._id
          }
        });
        comment.hasPraised = true;
        comment.praises++;
      }

      this.praiseLock = false;

      // //send comment后重新获取最新的评论信息
      // await this.initComments();
    },
    //回复评论
    replyComment: async function(comment, index, hot) {
      if (hot) {
        this.$set(this.hotFades, index, "fade");
        setTimeout(() => {
          this.$set(this.hotFades, index, "");
        }, 500);
      } else {
        this.$set(this.fades, index, "fade");
        setTimeout(() => {
          this.$set(this.fades, index, "");
        }, 500);
      }

      this.content = `回复${comment.nickName}:`;
      this.replyFor = `回复${comment.nickName}:`;
      this.sourse = "comment";
      this.commentId = comment.id;
    },
    //展示所有comments 或收起 comments
    showComments: async function(comment, type) {
      if (type === "hot") {
        for (const hotComment of this.hotComments) {
          //找到了hotComment中对应的那个
          if (hotComment._id === comment._id) {
            const tempInfo = hotComment.commentInfo;
            hotComment.commentInfo = [];
            hotComment.commentInfo = tempInfo;
            if (hotComment.maxNumber === 999) {
              console.log("收起");
              hotComment.maxNumber = 2;
              console.log(hotComment.maxNumber);
              return;
            }
            hotComment.maxNumber = 999;
          }
        }
      } else {
        for (const hotComment of this.comments) {
          //找到了hotComment中对应的那个
          if (hotComment._id === comment._id) {
            const tempInfo = hotComment.commentInfo;
            hotComment.commentInfo = [];
            hotComment.commentInfo = tempInfo;
            if (hotComment.maxNumber === 999) {
              console.log("收起");
              hotComment.maxNumber = 2;
              console.log(hotComment.maxNumber);
              return;
            }
            hotComment.maxNumber = 999;
          }
        }
      }
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
  display: flex;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex-direction: column;
  background-color: white;
}
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.divide-line {
  border-top: 7px solid rgb(241, 241, 241);
}

.thread-container {
  div {
    border: 0px solid red;
    box-sizing: border-box;
  }
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
    .part3 {
      height: calc(8vw*16/9);
      line-height: calc(8vw*16/9);
      color: #883b6a;
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
          height: calc(3vw*16/9);
          width: calc(3vw*16/9);
          background-image: url("../../assets/like.png");
          background-size: 100% 100%;
        }
        //已经点过赞
        .icon-praised {
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
  margin-bottom: 84px;
  .content-box-title {
    height: 10vw;
    text-align: left;
    line-height: 10vw;
    padding-left: 10px;
  }
  // 点击commentBox 的渐变动画效果
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
          .name:active {
            color: #5b99b6;
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
