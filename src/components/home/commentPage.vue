<template>
  <div class="container">
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
  created: async function() {
    await this.initComments();
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
          message: "操作太快了...",
          position: "middle",
          duration: 700
        });
        return;
      }
      this.praiseLock = true;
      const time = 700;
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

      setTimeout(() => {
        this.praiseLock = false;
      }, time);

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
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
}
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.divide-line {
  border-top: 7px solid rgb(241, 241, 241);
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
