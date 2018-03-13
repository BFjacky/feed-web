<template>
  <div class="container">
    <nav-bar v-model="selectItem" class="nav-bar">
      <tab-item class="tab-item" :class="itemChosenClass[0]" id="0">热门</tab-item>
      <tab-item class="tab-item" :class="itemChosenClass[1]" id="1">关注</tab-item>
      <tab-item class="tab-item" :class="itemChosenClass[2]" id="2">主题</tab-item>   
      <div class="moving-bottom-line" :class="moveAnimation"></div>   
    </nav-bar>
    <tab-container v-model="selectItem" class="tab-container">
      <tab-container-item class="tab-container-item" id="0">
        <threads-list :message='1'></threads-list>
      </tab-container-item>
      <tab-container-item class="tab-container-item" id="1">
          <threads-list :message='2'></threads-list>
      </tab-container-item>
      <tab-container-item class="tab-container-item" id="2">
          <threads-list :message='3'></threads-list>
      </tab-container-item>
    </tab-container>
  </div>
</template>
<script>
import { Navbar, TabItem, TabContainer, TabContainerItem } from "mint-ui";
import threadsList from "./threadsList";
export default {
  components: {
    navBar: Navbar,
    tabItem: TabItem,
    tabContainer: TabContainer,
    tabContainerItem: TabContainerItem,
    threadsList
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
          this.itemChosenClass = ["itemChosen", "", ""];
          break;
        case "1":
          if (this.oldSelectItem === "0") {
            this.moveAnimation = "move-0-1";
          }
          if (this.oldSelectItem === "2") {
            this.moveAnimation = "move-2-1";
          }
          this.itemChosenClass = ["", "itemChosen", ""];
          break;
        case "2":
          if (this.oldSelectItem === "0") {
            this.moveAnimation = "move-0-2";
          }
          if (this.oldSelectItem === "1") {
            this.moveAnimation = "move-1-2";
          }
          this.itemChosenClass = ["", "", "itemChosen"];
          break;
      }
      this.oldSelectItem = this.selectItem;
    }
  },
  data: function() {
    return {
      selectItem: "0",
      oldSelectItem: "0",
      itemChosenClass: ["itemChosen", "", ""],
      moveAnimation: ""
    };
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
}
.nav-bar {
  height: 8%;
  width: 100%;
  display: flex;
  .tab-item {
    flex-grow: 1;
    text-align: center;
    padding-top: 10px;
  }
  .moving-bottom-line {
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
  height: 92%;
  width: 100%;
  .tab-container-item {
    height: 100%;
    width: 100%;
  }
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

