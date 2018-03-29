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
         <popup v-model="popupVisible" class="popup" position="bottom">
        <div class="item" @click="focusThis" v-show="!myself">{{item1Text}}</div> 
        <div class="item" @click="shieldThis" v-show="!myself">屏蔽此人的动态</div>
         <div class="item delete" @click="deleteThis" v-show="myself">删除此条动态</div>      
      </popup>
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
      itemSelect: "0",
      popupVisible: false,
      item1Text: "",
      thread: {},
      myself: false
    };
  },
  created: async function() {
    events.$on("clickBox", this.clickBox);
    //提示全局正在登陆
    const res = await helper.wxinit();
  },
  methods: {
    clickBox: function(thread) {
      this.thread = thread;
      this.popupVisible = true;
      //查看该用户是否已经关注了此用户
      this.item1Text = "关注此用户";
      for (const focusUser of config.user.focus) {
        if (focusUser.uid == this.thread.uid) {
          this.item1Text = "取消关注此用户";
          break;
        }
      }
      //查看此用户是否为自己，若为自己则不显示关注或屏蔽
      if (this.thread.uid == config.user._id) {
        this.myself = true;
      } else {
        this.myself = false;
      }
      console.log(`myself:${this.myself}`);
      //显示出popup
      this.popupVisible = true;
    },
    focusThis: async function() {
      this.popupVisible = false;
      if (this.item1Text === "关注此用户") {
        const res = await axios({
          url: `${config.url.feedUrl}/user/focus`,
          method: "post",
          withCredentials: true,
          data: {
            uid: this.thread.uid
          }
        });
        //更新本地的
        const { focus } = res.data;
        if (focus !== undefined) {
          config.user.focus = focus;
        }
      } else {
        const res = await axios({
          url: `${config.url.feedUrl}/user/cancelFocus`,
          method: "post",
          withCredentials: true,
          data: {
            uid: this.thread.uid
          }
        });
        //更新本地的
        const { focus } = res.data;
        if (focus !== undefined) {
          config.user.focus = focus;
        }
      }
    },
    shieldThis: async function() {
      this.popupVisible = false;
      const _this = this;
      MessageBox.confirm("以后将无法查看此用户的状态")
        .then(async action => {
          if (action === "confirm") {
            const res = await axios({
              url: `${config.url.feedUrl}/user/shields`,
              method: "post",
              withCredentials: true,
              data: {
                uid: _this.thread.uid
              }
            });
            //更新本地的
            const { shields } = res.data;
            if (shields !== undefined) {
              config.user.shields = shields;
            }
            console.log("屏蔽完了:", res.data);
          }
        })
        .catch(() => {});
    },
    deleteThis: async function() {
      this.popupVisible = false;
      const _this = this;
      MessageBox.confirm("删除后将不会出现在你或其他人的动态中")
        .then(async action => {
          if (action === "confirm") {
            const res = await axios({
              url: `${config.url.feedUrl}/thread/deleteThread`,
              method: "post",
              withCredentials: true,
              data: {
                thread: _this.thread
              }
            });
            //更新本地的
            console.log("删除完了:", res.data);
            events.$emit("deleteThread", _this.thread._id);
          }
        })
        .catch(() => {});
    },
    gotoPostPage: async function() {
      const res = await helper.checkOauth();
      if (!res) {
        return;
      }
      this.$router.push({ path: "/index/postThread" });
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
.popup {
  width: 100vw;
  .item {
    height: 8vh;
    width: 100%;
    background-color: white;
    border-bottom: 1px solid rgb(221, 221, 221);
    text-align: center;
    line-height: 8vh;
    font-size: 4.5vw;
  }
  .delete {
    color: red;
  }
}
</style>
