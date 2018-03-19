<template>
  <div class="container">
        <div class="comment-show"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
            <div class="content-box-title">热门评论({{hotComments.length}})</div>
            <div class="content-box" v-for="comment in hotComments">
               <div class="left" v-bind:style="{backgroundImage:`url(${comment.avatarUrl})`}"></div>
               <div class="right">
                    <div class="header">
                      <div class="header-left">
                        <div class="name">{{comment.nickName}}</div>
                        <div class="time">{{comment.createdAt}}</div>
                      </div>
                      <div class="header-right">
                        <div v-bind:class="{praise:!comment.hasPraised,'praise-after':comment.hasPraised}" @click="praise(comment)"></div>
                        <div class="number">{{comment.praises}}</div>
                      </div>
                    </div>
                    <div class="main">{{comment.content}}</div>
                    <div class="footer"></div>
                </div>
            </div>
            <div class="divide-line"></div>
            <div class="content-box-title">最新评论({{comments.length}})</div>
            <div class="content-box" v-for="comment in comments">
               <div class="left" v-bind:style="{backgroundImage:`url(${comment.avatarUrl})`}"></div>
               <div class="right">
                    <div class="header">
                      <div class="header-left">
                        <div class="name">{{comment.nickName}}</div>
                        <div class="time">{{comment.createdAt}}</div>
                      </div>
                      <div class="header-right">
                        <div v-bind:class="{praise:!comment.hasPraised,'praise-after':comment.hasPraised}" @click="praise(comment)"></div>
                        <div class="number">{{comment.praises}}</div>
                      </div>
                    </div>
                    <div class="main">{{comment.content}}</div>
                    <div class="footer"></div>
                </div>
            </div>
            <div class="divide-line"></div>
        </div>
        <div class="comment-make">
            <textarea class="content-area" :maxlength="maxWordsLength" placeholder="友善的发言更容易获得朋友" v-model:value="content"></textarea> 
            <div class="send-button" @click="sendAcomment">发送</div>
        </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
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
      //评论最大字数
      maxWordsLength: 150,
      //进行评论时的对象: thread||comment
      sourse: "thread",
      //防止用户过度点赞
      praiseLock: false,
      busy: false,
      nomore: false,
      hotComments: []
    };
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
        alert("未能获取到评论信息!");
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
      for (const comment of this.comments) {
        for (const praise of comment.praiseInfo) {
          if (praise.uid === config.user._id) {
            comment.hasPraised = true;
            break;
          }
        }
      }
      for (const comment of this.hotComments) {
        for (const praise of comment.praiseInfo) {
          if (praise.uid === config.user._id) {
            comment.hasPraised = true;
            break;
          }
        }
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
      console.log(`loadmore: ${this.comments.length}`);
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
      const sendCommentRes = await axios({
        url: `${config.url.feedUrl}/thread/newComment`,
        method: "post",
        withCredentials: true,
        data: {
          _id: this.thread._id,
          comment: { content: this.content },
          sourse: this.sourse
        }
      });
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
      const time = 1000;
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
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.divide-line {
  border-top: 7px solid rgb(241, 241, 241);
}
.comment-show {
  overflow-y: auto;
  flex-grow: 1;
  margin-bottom: 3px;
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
    margin-bottom: 3vw;
    .left {
      width: 15vw;
      height: 15vw;
      border-radius: 50%;
      background-size: 100% 100%;
    }
    .right {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      padding-left: 10px;
      div {
        border: 0px solid black;
        box-sizing: border-box;
      }
      .header {
        margin-top: 5px;
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
        margin-top: 2vw;
        text-align: left;
        font-size: 3.5vw;
      }
      .footer {
        margin-top: 0vw;
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
