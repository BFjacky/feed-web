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
      <img slot="icon" width="27vh" :src="itemSelect==='0'?require('../assets/home1.png'):require('../assets/home.png')">
        首页
      </tab-item>
      <tab-item class="one-item" id="1" :class="{'item-chosen':itemSelect==='1'}">
      <img slot="icon" width="27vh"  :src="itemSelect==='0'?require('../assets/person.png'):require('../assets/person1.png')">
        我的
      </tab-item>
    </tab-bar>
    <div class="send-button" @click="gotoPostPage"></div>
  </div>

</template>
<script>
import {
  Tabbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Popup,
  MessageBox
} from "mint-ui";
import home from "@/components/home/home";
import store from "@/components/helper/store";
import person from "@/components/person/person";
import helper from "@/components/helper/helper";
import config from "@/components/helper/config";
import events from "@/components/helper/events";
import indicatorModal from "@/components/commonVue/indicatorModal";
import axios from "axios";
export default {
  data: function() {
    return {
      realFalse: false,
      itemSelect: "0"
    };
  },
  created: async function() {
    //在页面最初的组件中，告诉全局，页面正在尝试获取用户信息
    config.user.fetching = true;
    //提示全局正在登陆
    const res = await helper.wxinit();
  },
  methods: {
    gotoPostPage: async function() {
      const res = await helper.checkOauth();
      if (!res) {
        return;
      }
      //检查该用户是否通过了答题测试
      if (!config.user.pass) {
        MessageBox({
          title: "Jser",
          message:
            "还没有完成Jser团队提供的题目测试，完成题目测试后才可发状态哟~",
          showCancelButton: true,
          confirmButtonText: "现在去答题",
          cancelButtonText: "算了吧"
        })
          .then(async action => {
            if (action === "confirm") {
              this.$router.push({ name: "exampages" });
              return;
            }
          })
          .catch(() => {});
        return;
      }
      this.$router.push({ name: "postThread" });
    }
  },
  watch: {},
  components: {
    tabBar: Tabbar,
    tabItem: TabItem,
    tabContainer: TabContainer,
    tabContainerItem: TabContainerItem,
    homePage: home,
    personPage: person,
    indicatorModal,
    popup: Popup
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  overflow-y: hidden;
  background-color: white;
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
  height: 16vw;
  width: 16vw;
  position: fixed;
  bottom: 0;
  left: 42vw;
  z-index: 2000;
  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    left: 50%;
    transform: translateX(-60px);
  }
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
