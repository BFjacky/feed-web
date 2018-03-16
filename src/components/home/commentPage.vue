<template>
  <div class="container">
    <div class="comment-container ">
        <div class="comment-show">
            <div class="content-box-title">热门评论</div>
            <div class="content-box" v-for="comment in comments">
               <div class="left" v-bind:style="{backgroundImage:`url(${comment.avatarUrl})`}"></div>
               <div class="right">
                    <div class="header">
                        <div class="name">{{comment.nickName}}</div>
                        <div class="time">{{comment.createdAt}}</div>
                    </div>
                    <div class="main">{{comment.content}}</div>
                    <div class="footer"></div>
                </div>
            </div>
        </div>
        <div class="comment-make">
            <textarea class="content-area" :maxlength="maxWordsLength" placeholder="友善的发言更容易获得朋友" v-model:value="content"></textarea> 
            <div class="send-button" @click="sendAcomment">发送</div>
        </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";
export default {
  created: async function() {
    this.thread = this.$route.query.thread;
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
      console.log(this.comments);
    }
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
      sourse: "thread"
    };
  },
  methods: {
    sendAcomment: async function() {
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
    }
  }
};
</script>

<style lang="less" scoped>
.container {
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

.comment-show {
  flex-grow: 1;
  flex-shrink: 1;
  .content-box-title {
    height: 10vw;
    text-align: left;
    line-height: 10vw;
    padding-left: 10px;
  }
  .content-box {
    padding-top: 3vw;
    border-top: 1px solid rgb(196, 196, 196);
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
      .header {
        margin-top: 5px;
        height: 10vw;
        display: flex;
        flex-direction: column;
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
  background-color: white;
  position: fixed;
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
    line-height: 30px;
    width: 80vw;
    font-size: 4vw;
    border-width: 0;
    border: 0px solid black;
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
