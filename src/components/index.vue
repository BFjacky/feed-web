<template>
  <div class="container">
    <indicator-modal></indicator-modal>
    <tab-container class="tab-container" v-model="itemSelect" :swipeable=false>
      <tab-container-item class="item" id="0">
        <home-page></home-page>
      </tab-container-item>
      <tab-container-item class='item' id="1">
        <person-page></person-page>
      </tab-container-item>
    </tab-container>
    <tab-bar class="tab-bar" v-model="itemSelect">
      <tab-item class="one-item" id="0" :class="{'item-chosen':itemSelect==='0'}">
      <img slot="icon" width="30vh" :src="itemSelect==='0'?require('../assets/home1.png'):require('../assets/home.png')">
        首页
      </tab-item>
      <tab-item class="one-item" id="1" :class="{'item-chosen':itemSelect==='1'}">
      <img slot="icon" width="30vh"  :src="itemSelect==='0'?require('../assets/person.png'):require('../assets/person1.png')">
        我的
      </tab-item>
    </tab-bar>
    <div class="send-button" @click="gotoPostPage"></div>
  </div>
</template>
<script>
import { Tabbar, TabItem, TabContainer, TabContainerItem } from "mint-ui";
import home from "@/components/home/home";
import person from "@/components/person/person";
import helper from "@/components/helper/helper";
import config from "@/components/helper/config";
import indicatorModal from "@/components/commonVue/indicatorModal";
import axios from "axios";
export default {
  data: function() {
    return {
      itemSelect: "0"
    };
  },
  created: async function() {
    const { code } = this.$route.query;
    if (!code) {
      const res = await helper.wxinit();
      return;
    }
    // 告诉整个页面，该用户正在鉴权中
    config.user.updating = true;
    //提示全局正在登陆

    const res = await helper.wxinit();
    const oauthRes = await axios({
      url: `${config.url.feedUrl}/oauth`,
      method: "post",
      data: {
        code
      },
      withCredentials: true
    });

    config.user.updating = false;
    //在这里获得用户跳转到此页面的参数,将code传到后端进行鉴权
  },
  methods: {
    gotoPostPage: async function() {
      const res = await helper.checkOauth();
      if (!res) {
        return;
      }
      this.$router.push({ path: "/index/postThread" });
    }
  },
  components: {
    tabBar: Tabbar,
    tabItem: TabItem,
    tabContainer: TabContainer,
    tabContainerItem: TabContainerItem,
    homePage: home,
    personPage: person,
    indicatorModal
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  overflow-y: hidden;
}
.tab-bar {
  position: fixed;
  bottom: 0;
  height: 8vh;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -1px 1px 1px rgb(201, 201, 201);
  align-items: center;
  .one-item {
    padding: 5px;
    width: 40vw;
    flex-shrink: 1;
    font-size: 10px;
  }
}
.send-button {
  box-shadow: 0 -1px 1px 1px rgb(201, 201, 201);
  background-color: #32a8fc;
  background-image: url(../assets/send.png);
  background-size: 75% 75%;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
  height: 20vw;
  width: 20vw;
  position: fixed;
  bottom: 0;
  left: 40vw;
  z-index: 2000;
}
.item-chosen {
  color: #32a8fc;
}
.tab-container {
  width: 100vw;
  height: 92vh;
  margin-bottom: 8vh;
  .item {
    height: 92vh;
    width: 100vw;
  }
}
</style>
