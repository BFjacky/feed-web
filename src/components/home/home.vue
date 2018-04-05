<template>
  <div class="container">
    <!-- FIX ME 为能够实现点击 主题 navbar而实现的 透明按钮 -->
    <div class="float-button" @click="chooseItem3"></div>
    <nav-bar v-model="selectItem" class="nav-bar">
      <tab-item class="tab-item" :class="selectItem==='0'?'itemChosen':''" id="0">最新</tab-item>
      <tab-item class="tab-item" :class="selectItem==='1'?'itemChosen':''" id="1">热门</tab-item>
      <tab-item class="tab-item" :class="selectItem==='2'?'itemChosen':''" id="2">关注</tab-item>
      <tab-item class="tab-item" :class="selectItem==='3'?'itemChosen':''" id="3" @click="showThemeList">{{nowTheme===''?'主题':nowTheme}}</tab-item>   
      <div class="themeList" v-show="listExist" v-bind:class="{listShow:listShow,listHide:listHide}">
        <div class="themeItem" v-for="theme in themes" @click="chooseTheme(theme)">
          <div class="icon" v-bind:style="{backgroundImage:`url(${theme.icon})`}"></div>
          <div class="text">{{theme.text}}</div>
        </div>
      </div>
    </nav-bar>
    <tab-container v-model="selectItem" class="tab-container">
      <tab-container-item class="tab-container-item" id="0">
        <threads-list  type="最新" ></threads-list>
      </tab-container-item>
      <tab-container-item class="tab-container-item" id="1">
          <threads-list type="热门" ></threads-list>
      </tab-container-item>
      <tab-container-item class="tab-container-item" id="2">
          <threads-list type="关注" ></threads-list>
      </tab-container-item>
      <tab-container-item class="tab-container-item" id="3">
          <threads-list :type="nowTheme"  ></threads-list>
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
    chooseItem3: function() {
      if (this.listExist) {
        this.hideThemeList();
        return;
      }
      this.showThemeList();
      this.selectItem = "3";
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
          this.hideThemeList();
          break;
        case "1":
          this.hideThemeList();
          break;
        case "2":
          this.hideThemeList();
          break;
      }
    }
  },
  data: function() {
    return {
      selectItem: "0",
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
  activated: async function() {
    //刚发完一条状态的时候,将type切换到最新,并刷新 最新 页面的内容
    if (store.threadsList.needRefresh) {
      this.oldSelectItem = this.selectItem;
      this.selectItem = "0";
    }
  },
  created: async function() {}
};
</script>
<style lang="less" scoped>
.float-button {
  position: absolute;
  width: calc(100vw/4);
  height: 7vh;
  background-color: black;
  z-index: 2001;
  left: calc(100vw*3/4);
  opacity: 0;
}
.container {
  height: 92vh;
  width: 100%;
}
.nav-bar {
  position: fixed;
  top: 0;
  height: 7vh;
  width: 100%;
  display: flex;
  box-shadow: 0px 1px 1px 1px #d6d6d6;
  z-index: 2000;
  background-color: white;
  .tab-item {
    background-color: white;
    width: calc(100vw/4);
    flex-shrink: 0;
    flex-wrap: wrap;
    flex-grow: 1;
    z-index: 2000;
    text-align: center;
    padding-top: 10px;
  }
  .moving-bottom-line {
    z-index: 2100;
    border: 0px solid #32a8fc;
    height: 5px;
    background-color: #32a8fc;
    position: absolute;
    width: 10.33vw;
    left: 11.5vw;
    top: 8vh;
    transform: translateY(-200%);
  }
}
@keyframes fade-in {
  0% {
    background-color: white;
  }
  100% {
    background-color: #e0e0e0;
  }
}
.itemChosen {
  animation: fade-in 0.3s forwards ease-in-out;
  // border-bottom: 5px solid #32a8fc;
  color: #32a8fc;
}
.tab-container {
  height: 85vh;
  width: 100%;
  margin-top: 7vh;
  /*避免遮挡nav-bar的box-shadow*/

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
  width: calc(100vw/4);
  height: calc(25vh/3);
  border: 1px solid rgb(238, 238, 238);
  box-sizing: border-box;
  background-color: white;
  display: flex;
  align-items: center;
  flex-grow: 0;
  .icon {
    width: 7vw;
    height: 7vw;
    background-size: 100% 100%;
    margin-left: 2vw;
  }
  .text {
    flex-grow: 1;
    font-size:3vw;
    line-height: calc(20vh/3);
    margin-right: 1vw;
  }
}
.themeList {
  width: 100vw;
  position: relative;
  top: 0vh;
  z-index: 1500;
  display: flex;
  right: calc(100vw/4);
  top: 1px;
  flex-wrap: wrap;
}
</style>

