<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="5">
      <div class="threadBox" v-for="thread in threads">
        <thread-box :thread="thread"></thread-box>
      </div>
  </div>
</template>
<script>
import threadBox from "./threadBox";
import config from "../helper/config";
import axios from "axios";
export default {
  props: ["type"],
  components: {
    threadBox
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
      busy: false
    };
  },
  methods: {
    loadMore: async function() {
      console.log("loadmore");
      // console.log(this.threads[this.threads.length])
      // const threads = await axios({
      //   url: `${config.url.feedUrl}/thread/getThread`,
      //   withCredentials: true,
      //   params: {
      //     objectId: this.threads[this.threads.length]._id
      //   }
      // });
      // this.threads = this.threads.concat(threads.data.threads);
      // console.log(this.threads);
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
</style>
