<template>
  <div class="container">
    <!-- FIX ME 为能够实现点击 主题 navbar而实现的 透明按钮 -->
    <div class="float-button" @click="chooseItem2"></div>
    <nav-bar v-model="selectItem" class="nav-bar">
      <tab-item class="tab-item" :class="selectItem==='0'?'itemChosen':''" id="0">最新</tab-item>
      <tab-item class="tab-item" :class="selectItem==='1'?'itemChosen':''" id="1">热门</tab-item>
      <tab-item class="tab-item" :class="selectItem==='2'?'itemChosen':''" id="2" @click="showThemeList">{{nowTheme===''?'主题':nowTheme}}</tab-item>   
      <div class="moving-bottom-line" :class="moveAnimation"></div>   
      <div class="themeList" v-show="listExist" v-bind:class="{listShow:listShow,listHide:listHide}">
        <div class="themeItem" v-for="theme in themes" @click="chooseTheme(theme)">
          <div class="icon" v-bind:style="{backgroundImage:`url(${theme.icon})`}"></div>
          <div class="text">{{theme.text}}</div>
        </div>
      </div>
    </nav-bar>
    <tab-container v-model="selectItem" class="tab-container">
      <tab-container-item class="tab-container-item" id="0">
        <threads-list  type="最新"></threads-list>
      </tab-container-item>
      <tab-container-item class="tab-container-item" id="1">
          <threads-list type="热门"></threads-list>
      </tab-container-item>
      <tab-container-item class="tab-container-item" id="2">
          <threads-list :type="nowTheme"></threads-list>
      </tab-container-item>
    </tab-container>
  </div>
</template>
<script>
import {
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Popup
} from "mint-ui";
import axios from "axios";
import config from "../helper/config";
import store from "../helper/store";
import threadsList from "./threadsList";
export default {
  components: {
    navBar: Navbar,
    tabItem: TabItem,
    tabContainer: TabContainer,
    tabContainerItem: TabContainerItem,
    threadsList,
    popup: Popup
  },
  methods: {
    hideThemeList: function() {
      this.listShow = false;
      this.listHide = true;
      setTimeout(() => {
        this.listExist = false;
      }, 300);
    },
    showThemeList: function() {
      this.listHide = false;
      this.listExist = true;
      this.listShow = true;
    },
    chooseItem2: function() {
      if (this.listExist) {
        this.hideThemeList();
        return;
      }
      this.showThemeList();
      this.selectItem = "2";
    },
    chooseTheme: function(theme) {
      this.nowTheme = theme.text;
      this.hideThemeList();
    }
  },
  watch: {
    selectItem: function() {
      switch (this.selectItem) {
        case "0":
          if (this.oldSelectItem === "1") {
            this.moveAnimation = "move-1-0";
          }
          if (this.oldSelectItem === "2") {
            this.moveAnimation = "move-2-0";
          }
          this.hideThemeList();
          break;
        case "1":
          if (this.oldSelectItem === "0") {
            this.moveAnimation = "move-0-1";
          }
          if (this.oldSelectItem === "2") {
            this.moveAnimation = "move-2-1";
          }
          this.hideThemeList();
          break;
        case "2":
          if (this.oldSelectItem === "0") {
            this.moveAnimation = "move-0-2";
          }
          if (this.oldSelectItem === "1") {
            this.moveAnimation = "move-1-2";
          }
          break;
      }
      this.oldSelectItem = this.selectItem;
    }
  },
  data: function() {
    return {
      selectItem: "0",
      oldSelectItem: "0",
      moveAnimation: "",
      listShow: false,
      listHide: false,
      listExist: false,
      //当前选择的theme
      nowTheme: "",
      themes: [
        { icon: require("../../assets/search.png"), text: "失物招领" },
        { icon: require("../../assets/cardiogram.png"), text: "表白墙  " },
        { icon: require("../../assets/money-bag.png"), text: "二手交易" },
        { icon: require("../../assets/car.png"), text: "拼车出行" },
        { icon: require("../../assets/learning.png"), text: "寻找研友" }
      ]
    };
  },
  created: async function() {
    if (store.home.stored) {
      this.selectItem = store.home.selectItem;
      this.oldSelectItem = store.home.oldSelectItem;
      this.moveAnimation = store.home.moveAnimation;
      this.listShow = store.home.listShow;
      this.listHide = store.home.listHide;
      this.listExist = store.home.listExist;
      this.nowTheme = store.home.nowTheme;
    }
  },
  beforeDestroy: function() {
    store.home.stored = true;
    store.home.selectItem = this.selectItem;
    store.home.oldSelectItem = this.oldSelectItem;
    store.home.moveAnimation = this.moveAnimation;
    store.home.listShow = this.listShow;
    store.home.listHide = this.listHide;
    store.home.listExist = this.listExist;
    store.home.nowTheme = this.nowTheme;
  }
};
</script>
<style lang="less" scoped>
.float-button {
  position: absolute;
  width: calc(100vw/3);
  height: 7vh;
  background-color: black;
  z-index: 2001;
  left: calc(100vw*2/3);
  opacity: 0;
}
.container {
  height: 92vh;
  width: 100%;
  overflow-y: hidden;
}
.nav-bar {
  height: 7vh;
  width: 100%;
  display: flex;
  box-shadow: 0px 1px 1px 1px #d6d6d6;
  z-index: 2000;
  background-color: white;
  .tab-item {
    background-color: white;
    width: calc(100vw/3);
    flex-shrink: 0;
    flex-wrap: wrap;
    flex-grow: 1;
    z-index: 2000;
    text-align: center;
    padding-top: 10px;
  }
  .moving-bottom-line {
    z-index: 2000;
    border: 0px solid #32a8fc;
    height: 5px;
    background-color: #32a8fc;
    position: absolute;
    width: 10.33vw;
    left: 11.5vw;
    top: 8%;
    transform: translateY(-200%);
  }
}
.itemChosen {
  // border-bottom: 5px solid #32a8fc;
  color: #32a8fc;
}
.tab-container {
  height: 85vh;
  width: 100%;
  overflow-y: auto;

  /*避免遮挡nav-bar的box-shadow*/
  margin-top: 1px;

  .tab-container-item {
    height: 85vh;
    width: 100%;
  }
}
@keyframes list-show {
  0% {
    transform: translateY(0%);
    opacity: 0;
  }
  100% {
    transform: translateY(100%);
    opacity: 1;
  }
}
.listShow {
  animation: list-show 0.3s ease-in-out forwards;
}
@keyframes list-hide {
  0% {
    transform: translateY(100%);
    opacity: 1;
  }
  100% {
    transform: translateY(0%);
    opacity: 0;
  }
}
.listHide {
  animation: list-hide 0.3s ease-in-out forwards;
}
.themeItem:active {
  background-color: #e2e2e2;
}
.themeItem {
  width: calc(100vw/3);
  height: calc(25vh/3);
  border: 1px solid rgb(238, 238, 238);
  box-sizing: border-box;
  background-color: white;
  display: flex;
  align-items: center;
  flex-grow: 0;
  .icon {
    width: 4.5vh;
    height: 4.5vh;
    background-size: 100% 100%;
    margin-left: 3vw;
  }
  .text {
    flex-grow: 1;
    line-height: calc(20vh/3);
    margin-right: 3vw;
  }
}
.themeList {
  width: 100vw;
  position: relative;
  top: 0vh;
  z-index: 1500;
  display: flex;
  right: 33.33vw;
  top: 1px;
  flex-wrap: wrap;
}
// 0-1
@keyframes move-0-1 {
  0% {
    transform: translateY(-200%) translateX(0) scaleX(1);
  }
  50% {
    transform: translateY(-200%) translateX(calc(100vw/6)) scaleX(3);
  }
  100% {
    transform: translateY(-200%) translateX(calc(100vw/3)) scaleX(1);
  }
}
.move-0-1 {
  animation: move-0-1 0.15s ease-in-out forwards;
}
// 1-2
@keyframes move-1-2 {
  0% {
    transform: translateY(-200%) translateX(calc(100vw/3)) scaleX(1);
  }
  50% {
    transform: translateY(-200%) translateX(50vw) scaleX(3);
  }
  100% {
    transform: translateY(-200%) translateX(calc(100vw*2/3)) scaleX(1);
  }
}
.move-1-2 {
  animation: move-1-2 0.15s ease-in-out forwards;
}
// 0-2
@keyframes move-0-2 {
  0% {
    transform: translateY(-200%) translateX(0) scaleX(1);
  }
  50% {
    transform: translateY(-200%) translateX(calc(100vw/3)) scaleX(3);
  }
  100% {
    transform: translateY(-200%) translateX(calc(100vw*2/3)) scaleX(1);
  }
}
.move-0-2 {
  animation: move-0-2 0.15s ease-in-out forwards;
}
// 1-0
@keyframes move-1-0 {
  0% {
    transform: translateY(-200%) translateX(calc(100vw/3)) scaleX(1);
  }
  50% {
    transform: translateY(-200%) translateX(calc(100vw/6)) scaleX(3);
  }
  100% {
    transform: translateY(-200%) translateX(0vw) scaleX(1);
  }
}
.move-1-0 {
  animation: move-1-0 0.15s ease-in-out forwards;
}
// 2-0
@keyframes move-2-0 {
  0% {
    transform: translateY(-200%) translateX(calc(100vw*2/3)) scaleX(1);
  }
  50% {
    transform: translateY(-200%) translateX(calc(100vw/3)) scaleX(3);
  }
  100% {
    transform: translateY(-200%) translateX(0vw) scaleX(1);
  }
}
.move-2-0 {
  animation: move-2-0 0.15s ease-in-out forwards;
}
// 2-1
@keyframes move-2-1 {
  0% {
    transform: translateY(-200%) translateX(calc(100vw*2/3)) scaleX(1);
  }
  50% {
    transform: translateY(-200%) translateX(50vw) scaleX(3);
  }
  100% {
    transform: translateY(-200%) translateX(calc(100vw/3)) scaleX(1);
  }
}
.move-2-1 {
  animation: move-2-1 0.15s ease-in-out forwards;
}
</style>

