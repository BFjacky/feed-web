<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
    <load-more :top-method="refresh" ref="loadmore" v-on:top-status-change="topStatusChange">
      <div slot="top" class="mint-loadmore-top">
        <span class="down-arrow" v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        <spinner v-show="topStatus === 'loading'" color="#32a8fc" type="triple-bounce"></spinner>
      </div>
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
import { Spinner, Loadmore } from "mint-ui";
export default {
  props: ["type"],
  components: {
    threadBox,
    spinner: Spinner,
    loadMore: Loadmore
  },
  created: async function() {
    switch (this.type) {
      case "热门":
        const threads = await axios({
          url: `${config.url.feedUrl}/thread/getThread`,
          withCredentials: true
        });
        this.threads = threads.data.threads;
        console.log(this.threads);
        break;
    }
  },
  data: function() {
    return {
      threads: [],
      busy: false,
      //没有更多了
      nomore: false,
      topStatus: ""
    };
  },
  methods: {
    loadMore: async function() {
      if (this.threads.length === 0) {
        return;
      }

      this.busy = true;
      const threads = await axios({
        url: `${config.url.feedUrl}/thread/getThread`,
        withCredentials: true,
        params: {
          objectId: this.threads[this.threads.length - 1]._id
        }
      });
      this.threads = this.threads.concat(threads.data.threads);
      if (threads.data.threads.length === 0) {
        this.busy = true;
        this.nomore = true;
        return;
      }
      this.busy = false;
    },
    refresh: async function() {
      switch (this.type) {
        case "热门":
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getThread`,
            withCredentials: true
          });
          this.threads = threads.data.threads;
          console.log(this.threads);
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
