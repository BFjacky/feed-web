<template>
  <div class="container">
    <tab-container class="tab-container" v-model="itemSelect" :swipeable=false>
      <tab-container-item class="item" id="0">
        <home-page></home-page>
      </tab-container-item>
      <tab-container-item class='item' id="1">
        <person-page></person-page>
      </tab-container-item>
    </tab-container>
    <tab-bar class="tab-bar" v-model="itemSelect">
      <tab-item class="one-item" id="0" :class="itemChoosenClass[0]">
      <img slot="icon" width="30vh" :src="itemIcon[0]">
        首页
      </tab-item>
      <tab-item class="one-item" id="1" :class="itemChoosenClass[1]">
      <img slot="icon" width="30vh" :src="itemIcon[1]">
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
export default {
  data: function() {
    return {
      itemSelect: "0",
      itemIcon: [
        require("../assets/home1.png"),
        require("../assets/person.png")
      ],
      itemChoosenClass: ["item-chosen", ""],
      realTrue: true
    };
  },
  created: async function() {
    const res = await helper.wxinit();
    console.log(this.$route)
  },
  watch: {
    itemSelect: function() {
      switch (this.itemSelect) {
        case "0":
          //图标更换
          this.itemIcon[0] = require("../assets/home1.png");
          this.itemIcon[1] = require("../assets/person.png");
          //样式更换
          this.itemChoosenClass[0] = "item-chosen";
          this.itemChoosenClass[1] = "";
          break;
        case "1":
          //图标更换
          this.itemIcon[0] = require("../assets/home.png");
          this.itemIcon[1] = require("../assets/person1.png");
          //样式更换
          this.itemChoosenClass[0] = "";
          this.itemChoosenClass[1] = "item-chosen";
          break;
      }
    }
  },
  methods: {
    gotoPostPage: function() {
      this.$router.push({ path: "/postThread" });
    }
  },
  components: {
    tabBar: Tabbar,
    tabItem: TabItem,
    tabContainer: TabContainer,
    tabContainerItem: TabContainerItem,
    homePage: home,
    personPage: person
  }
};
</script>
<style lang="less" scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.container {
  height: 100vh;
  width: 100vw;
}
.tab-bar {
  position: fixed;
  bottom: 0;
  height: 8vh;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .one-item {
    padding: 5px;
    width: 40vw;
    flex-shrink: 1;
    font-size: 10px;
  }
}
.send-button {
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
  overflow-y: auto;
  .item {
    height: 92vh;
    width: 100vw;
  }
}
</style>
