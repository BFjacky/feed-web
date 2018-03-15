<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="5">
      <div class="threadBox" v-for="thread in threads">
        <thread-box :thread="thread"></thread-box>
      </div>
      <div class="spinner-box" v-if="busy">
        <spinner type="triple-bounce" v-if="!nomore"></spinner>
        <div class="text-line" v-if="nomore">没有更多了...</div>
      </div>
  </div>
</template>
<script>
import threadBox from "./threadBox";
import config from "../helper/config";
import axios from "axios";
import { Spinner } from "mint-ui";
export default {
  props: ["type"],
  components: {
    threadBox,
    spinner: Spinner
  },
  created: async function() {
    switch (this.type) {
      case "热门":
        const threads = await axios({
          url: `${config.url.feedUrl}/thread/getThread`,
          withCredentials: true
        });
        this.threads = this.threads.concat(threads.data.threads);
        console.log(this.threads);
        break;
    }
    this.busy = false;
  },
  data: function() {
    return {
      threads: [],
      busy: true,
      //没有更多了
      nomore: false
    };
  },
  methods: {
    loadMore: async function() {
      console.log("loadmore");
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
.spinner-box {
  height: 10vh;

  width: 100vw;
  .text-line {
    color: #888888;
    text-align: center;
    width: 100vw;
  }
}
</style>
