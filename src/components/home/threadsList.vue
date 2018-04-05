<template>
  <div class="container">
    <load-more :top-method="refresh" ref="loadmore" v-on:top-status-change="topStatusChange" class="load-more-box"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
      <div slot="top" class="mint-loadmore-top">
        <span class="down-arrow" v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        <spinner v-show="topStatus === 'loading'" color="#32a8fc" type="triple-bounce"></spinner>
      </div>
      <div class="noThreadInfo" v-if="threads.length<=0">暂时还没有动态哦...</div>
      <div class="threadBox" v-for="thread in threads">
        <thread-box :thread="thread"></thread-box>
      </div>
       <div class="spinner-box" v-if="busy">
        <spinner type="triple-bounce" color="#32a8fc" v-if="!nomore"></spinner>
        <div class="text-line" v-if="nomore">没有更多了</div>
      </div>
    </load-more>
  </div>
</template>
<script>
import threadBox from "./threadBox";
import config from "../helper/config";
import axios from "axios";
import helper from "../helper/helper";
import store from "../helper/store";
import events from "../helper/events";
import { Spinner, Loadmore } from "mint-ui";
export default {
  props: ["type", "uid"],
  components: {
    threadBox,
    spinner: Spinner,
    loadMore: Loadmore
  },
  watch: {
    type: async function() {
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
      }
    },
    uid:async function(){
      await this.refresh();
    }
  },
  activated: async function() {
    console.log(`进到了 threadsList`)
    //等待取回用户
    while (!config.user._id && config.user.fetching) {
      await helper.wait(50);
    }
    if (store.threadsList.needRefresh) {
      await this.refresh();
      store.threadsList.needRefresh = false;
    }
    //重新获得scrollTop;
    const elements = $(".load-more-box");
    switch (this.type) {
      case "最新":
        elements.each(function(index) {
          if (index === 0) {
            $(this).scrollTop(store.index.list1.scrollTop);
          }
        });
        break;
      case "热门":
        elements.each(function(index) {
          if (index === 1) {
            $(this).scrollTop(store.index.list2.scrollTop);
          }
        });
        break;
      case "关注":
        elements.each(function(index) {
          if (index === 2) {
            $(this).scrollTop(store.index.list3.scrollTop);
          }
        });
        break;
      case "用户":
        elements.each(function(index) {
          if (index === 4) {
            $(this).scrollTop(store.index.list5.scrollTop);
          }
        });
        break;
      default:
        elements.each(function(index) {
          if (index === 3) {
            $(this).scrollTop(store.index.list4.scrollTop);
          }
        });
        break;
    }
    console.log(`regain：`, store.index);
  },
  deactivated: async function() {
    const elements = $(".load-more-box");
    elements.each(function(index) {
      switch (index) {
        case 0:
          store.index.list1.scrollTop = $(this).scrollTop();
          break;
        case 1:
          store.index.list2.scrollTop = $(this).scrollTop();
          break;
        case 2:
          store.index.list3.scrollTop = $(this).scrollTop();
          break;
        case 3:
          store.index.list4.scrollTop = $(this).scrollTop();
          break;
        case 4:
          store.index.list5.scrollTop = $(this).scrollTop();
          break;
      }
    });
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
      console.log(`触发了loadmore`);
      if (this.threads.length === 0) {
        return;
      }
      if (this.busy || this.nomore) {
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
        case "关注":
          this.busy = true;
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getFocusThread`,
            withCredentials: true,
            data: {
              objectId: this.threads[this.threads.length - 1]._id
            },
            method: "post"
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
        case "用户": {
          this.busy = true;
          const threads = await axios({
            url: `${config.url.feedUrl}/thread/getThreadByUser`,
            withCredentials: true,
            method: "post",
            data: {
              objectId: this.threads[this.threads.length - 1]._id,
              uid: this.uid
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
        default: {
          //根据主题获得thread
          if (this.type === "") {
            return;
          } else {
            this.busy = true;
            const threads = await axios({
              url: `${config.url.feedUrl}/thread/getThreadByType`,
              withCredentials: true,
              method: "post",
              data: {
                objectId: this.threads[this.threads.length - 1]._id,
                themeText: this.type
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
        case "关注":
          console.log("重新刷新", this.threads.length);
          const focusThreads = await axios({
            url: `${config.url.feedUrl}/thread/getFocusThread`,
            method: "post",
            withCredentials: true,
            data: {}
          });
          this.threads = [];
          await helper.wait(10);
          this.threads = focusThreads.data.threads;
          this.threads = helper.parseDate(this.threads);
          break;
        case "用户":
          const userThreads = await axios({
            url: `${config.url.feedUrl}/thread/getThreadByUser`,
            method: "post",
            withCredentials: true,
            data: {
              uid: this.uid
            }
          });
          this.threads = [];
          await helper.wait(10);
          this.threads = userThreads.data.threads;
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
            this.threads = [];
            await helper.wait(10);
            this.threads = typeThreads.data.threads;
            this.threads = helper.parseDate(this.threads);

            break;
          }
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
  height: 100%;
  width: 100%;
}
.threadBox {
  width: 100vw;
}
.load-more-box {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
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



    // switch (this.type) {
    //   case "最新":
    //     const threads = await axios({
    //       url: `${config.url.feedUrl}/thread/getThread`,
    //       withCredentials: true
    //     });
    //     this.threads = threads.data.threads;
    //     this.threads = helper.parseDate(this.threads);
    //     break;
    //   case "热门":
    //     const hotThreads = await axios({
    //       url: `${config.url.feedUrl}/thread/getHotThread`,
    //       method: "post",
    //       withCredentials: true,
    //       data: {}
    //     });
    //     this.threads = hotThreads.data.threads;
    //     this.threads = helper.parseDate(this.threads);
    //     break;
    //   case "关注":
    //     const focusThreads = await axios({
    //       url: `${config.url.feedUrl}/thread/getFocusThread`,
    //       method: "post",
    //       withCredentials: true,
    //       data: {}
    //     });
    //     this.threads = focusThreads.data.threads;
    //     this.threads = helper.parseDate(this.threads);
    //     break;
    //   case "用户":
    //     const userThreads = await axios({
    //       url: `${config.url.feedUrl}/thread/getThreadByUser`,
    //       method: "post",
    //       withCredentials: true,
    //       data: {
    //         uid: this.uid
    //       }
    //     });
    //     this.threads = userThreads.data.threads;
    //     this.threads = helper.parseDate(this.threads);
    //     break;
    //   default:
    //     //根据主题获得thread
    //     if (this.type === "") {
    //       return;
    //     } else {
    //       const typeThreads = await axios({
    //         url: `${config.url.feedUrl}/thread/getThreadByType`,
    //         method: "post",
    //         withCredentials: true,
    //         data: {
    //           themeText: this.type
    //         }
    //       });
    //       this.threads = typeThreads.data.threads;
    //       this.threads = helper.parseDate(this.threads);
    //       break;
    //     }
    // }