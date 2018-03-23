<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
    <load-more :top-method="refresh" ref="loadmore" v-on:top-status-change="topStatusChange">
      <div slot="top" class="mint-loadmore-top">
        <span class="down-arrow" v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        <spinner v-show="topStatus === 'loading'" color="#32a8fc" type="triple-bounce"></spinner>
      </div>
      <div class="noThreadInfo" v-if="threads.length<=0">暂时还没有动态哦...</div>
      <div class="threadBox" v-for="thread in threads">
        <thread-box :thread="thread"></thread-box>
      </div>
    </load-more>
      <div class="spinner-box" v-if="busy">
        <spinner type="triple-bounce" color="#32a8fc" v-if="!nomore"></spinner>
        <div class="text-line" v-if="nomore">没有更多了...</div>
      </div>
  </div>
</template>
<script>
import threadBox from "./threadBox";
import config from "../helper/config";
import axios from "axios";
import helper from "../helper/helper";
import { Spinner, Loadmore } from "mint-ui";
export default {
  props: ["type"],
  components: {
    threadBox,
    spinner: Spinner,
    loadMore: Loadmore
  },
  watch: {
    type: async function() {
      switch (this.type) {
        case "最新":
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getThread`,
            withCredentials: true
          });
          this.threads = threads.data.threads;
          this.threads = helper.parseDate(this.threads);
          break;
        case "热门":
          const hotThreads = await axios({
            url: `${config.url.feedUrl}/thread/getHotThread`,
            method: "post",
            withCredentials: true,
            data: {}
          });
          this.threads = hotThreads.data.threads;
          this.threads = helper.parseDate(this.threads);
          break;
        default:
          //根据主题获得thread
          if (this.type === "") {
            return;
          } else {
            console.log("here");
            const typeThreads = await axios({
              url: `${config.url.feedUrl}/thread/getThreadByType`,
              method: "post",
              withCredentials: true,
              data: {
                themeText: this.type
              }
            });
            this.threads = typeThreads.data.threads;
            this.threads = helper.parseDate(this.threads);
            break;
          }
      }
    }
  },
  created: async function() {
    switch (this.type) {
      case "最新":
        const threads = await axios({
          url: `${config.url.feedUrl}/thread/getThread`,
          withCredentials: true
        });
        this.threads = threads.data.threads;
        this.threads = helper.parseDate(this.threads);
        break;
      case "热门":
        const hotThreads = await axios({
          url: `${config.url.feedUrl}/thread/getHotThread`,
          method: "post",
          withCredentials: true,
          data: {}
        });
        this.threads = hotThreads.data.threads;
        this.threads = helper.parseDate(this.threads);
        break;
      default:
        //根据主题获得thread
        if (this.type === "") {
          return;
        } else {
          const typeThreads = await axios({
            url: `${config.url.feedUrl}/thread/getThreadByType`,
            method: "post",
            withCredentials: true,
            data: {
              themeText: this.type
            }
          });
          this.threads = typeThreads.data.threads;
          this.threads = helper.parseDate(this.threads);
          break;
        }
    }
  },
  data: function() {
    return {
      threads: [],
      busy: false,
      //没有更多了
      nomore: false,
      topStatus: "",
      forbidLoadmore: false
    };
  },
  methods: {
    loadMore: async function() {
      if (this.threads.length === 0) {
        return;
      }
      switch (this.type) {
        case "最新": {
          this.busy = true;
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getThread`,
            withCredentials: true,
            params: {
              objectId: this.threads[this.threads.length - 1]._id
            }
          });
          this.threads = this.threads.concat(threads.data.threads);
          this.threads = helper.parseDate(this.threads);
          if (threads.data.threads.length < 5) {
            this.nomore = true;
            this.busy = true;
            return;
          }
          this.busy = false;
          break;
        }
        case "热门": {
          this.busy = true;
          const objectIds = [];
          //获得所有已经在客户端的threadsId
          for (const thread of this.threads) {
            objectIds.push(thread._id);
          }
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getHotThread`,
            method: "post",
            withCredentials: true,
            data: {
              objectIds
            }
          });
          this.threads = this.threads.concat(threads.data.threads);
          this.threads = helper.parseDate(this.threads);
          if (threads.data.threads.length < 5) {
            this.nomore = true;
            this.busy = true;
            return;
          }
          this.busy = false;
          break;
        }
      }
    },
    refresh: async function() {
      switch (this.type) {
        case "最新":
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getThread`,
            withCredentials: true
          });
          this.threads = [];
          await helper.wait(10);
          this.threads = threads.data.threads;
          this.threads = helper.parseDate(this.threads);
          break;
        case "热门":
          const hotThreads = await axios({
            url: `${config.url.feedUrl}/thread/getHotThread`,
            method: "post",
            withCredentials: true,
            data: {}
          });
          this.threads = [];
          await helper.wait(10);
          this.threads = hotThreads.data.threads;
          this.threads = helper.parseDate(this.threads);
          break;
      }
      this.nomore = false;
      this.busy = false;
      this.$refs.loadmore.onTopLoaded();
    },
    topStatusChange: function(e) {
      this.topStatus = e;
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 85vh;
  width: 100%;
  overflow-y: auto;
}
.threadBox {
  width: 100vw;
}
.noThreadInfo {
  color: #919191;
  margin-top: 37vh;
}
.down-arrow {
  color: #32a8fc;
}
.spinner-box {
  height: 10vh;
  width: 100vw;
  .text-line {
    color: #888888;
    text-align: center;
    width: 100vw;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.rotate {
  animation: rotate 0.1s ease-in-out forwards;
}
</style>
