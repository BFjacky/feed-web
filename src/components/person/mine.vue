<template>
  <div class="container">
    <div class="head-bar">我的动态</div>
    <div class="main">
        <threads-list  type="用户"></threads-list>
    </div>
  </div>
</template>
<script>
import threadsList from "../home/threadsList";
import store from "../helper/store";
import config from "../helper/config";
import axios from "axios";
export default {
  components: {
    threadsList
  },
  activated: async function() {
    //获得所有该用户发出的thread
    const threadsRes = await axios({
      url: `${config.url.feedUrl}/thread/getThreadByUser`,
      method: "post",
      withCredentials: true,
      data: {}
    });
    console.log(threadsRes.data.threads);
  },
  deactivated: function() {
    const elements = $(".load-more-box");
    elements.each(function(index) {
      switch (index) {
        case 3:
          store.index.list4.scrollTop = $(this).scrollTop();
          break;
      }
    });
  }
};
</script>
<style lang="less" scoped>
div {
  border: 0px solid black;
  box-shadow: border-box;
}
.container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  background-color: white;
}
.head-bar {
  height: 6vh;
  line-height: 6vh;
  padding-left: 15px;
  color: #555555;
  width: 100vw;
  text-align: left;
  box-shadow: 0 3px 1px 1px rgb(219, 219, 219);
}
.main {
  height: 94vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
