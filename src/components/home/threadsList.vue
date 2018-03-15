<template>      
  <div class="container" v-infinite-scroll="loadBottom" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <!-- <load-more :top-method="loadTop"  ref="loadmore"> -->
      <div class="threadBox" v-for="thread in threads">
        <thread-box :thread="thread"></thread-box>
      </div>
      <div class="bottom-remind-box" v-if="allLoaded">没有更多了...</div>
    <!-- </load-more> -->
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
        this.threads = this.threads.concat(threads.data.threads);
        console.log(this.threads);
        break;
    }
  },
  data: function() {
    return {
      threads: [],
      //没有更多了
      allLoaded: false,
      busy: false
    };
  },
  methods: {
    loadTop: async function() {
      switch (this.type) {
        case "热门":
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getThread`,
            withCredentials: true
          });
          this.threads = threads.data.threads;
          break;
      }
      this.allLoaded = false;
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom: async function() {
      console.log(`loadBottom`);
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
        this.allLoaded = true;
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
.bottom-remind-box {
  border: 0px solid black;
  height: 9vh;
  width: 100vw;
  color: #888888;
}
</style>
