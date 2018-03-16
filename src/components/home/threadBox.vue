<template>
  <div class="container">
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
            <div class="img" :class="{singleImg:thread.imgs.length===1}" v-for="img in thread.imgs" v-bind:style="{backgroundImage:`url(${img.url})`}"></div>
          </div>
      </div>
      <div class="footer">
          <div class="buttons">
              <div class="button-praise" @click="praise">
                  <div v-bind:class="{icon:!hasPraised,'icon-praised':hasPraised}"></div>
                  <div class="text">{{thread.praises}}</div>
              </div>
              <div class="button-comment" @click="gotoComment">
                  <div class="icon"></div>
                  <div class="text">{{thread.comments}}</div>
              </div>
              <div class="button-share">
                  <div class="icon"></div>
              </div>
          </div>
      </div>

      <!-- 评论页 -->


  </div>
</template>
<script>
import axios from "axios";
import config from "../helper/config";

export default {
  props: ["thread"],
  created: async function() {
    for (const praise of this.thread.praiseInfo) {
      if (praise.openid === config.user.openid) {
        this.hasPraised = true;
        break;
      }
    }
    // console.log(this.thread);
  },
  components: {},
  data: function() {
    return {
      hasPraised: false,
      popupVisible: false,
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
    praise: async function() {
      if (this.hasPraised) {
        //如果已经点赞,则取消点赞
        const cancelRes = await axios({
          url: `${config.url.feedUrl}/thread/cancelPraise`,
          method: "post",
          data: {
            _id: this.thread._id
          },
          withCredentials: true
        });
        this.hasPraised = false;

        //FiX ME 点赞之后不去查询该条说说最新的点赞总数，只是单纯在客户端将点赞数减一
        this.thread.praises = this.thread.praises - 1;
        return;
      }
      const praiseRes = await axios({
        url: `${config.url.feedUrl}/thread/praise`,
        method: "post",
        data: {
          _id: this.thread._id
        },
        withCredentials: true
      });
      this.hasPraised = true;

      //FiX ME 点赞之后不去查询该条说说最新的点赞总数，只是单纯在客户端将点赞数加一
      this.thread.praises = this.thread.praises + 1;
    },
    gotoComment: async function() {
      this.$router.push({
        path: "/commentPage",
        query: {
          thread: this.thread
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.container {
  border-bottom: 2vw solid #eeeded;
  height: 100%;
  width: 100%;
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
    justify-content: space-between;
    margin-top: 2vh;
    .img {
      height: 28vw;
      width: 28vw;
      margin-bottom: 1vw;
      background-size: 100% 100%;
    }
    .singleImg {
      height: 65vw;
      width: 65vw;
      margin-bottom: 1vw;
      background-size: 100% 100%;
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
        height: 3vh;
        width: 3vh;
        background-image: url("../../assets/like.png");
        background-size: 100% 100%;
      }
      //已经点过赞
      .icon-praised {
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
