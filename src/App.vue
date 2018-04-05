<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
    <router-view/>
      </keep-alive>
    </transition>

    <popup v-model="popupVisible"  style="opacity:0.85;" position="top" :modal="realFalse">
      <div class="feed-top-popup-item1" @click="gotoNotifyPage">你有新的通知</div>
    </popup>

    <popup v-model="popupVisibleMid">
      <div class="feed-mid-popup-item" v-for="item in itemList" @click="clickPopupItem(item)">{{item.text}}</div>
    </popup>
  </div>
</template>

<script>
import events from "./components/helper/events";
import { Popup } from "mint-ui";
export default {
  name: "App",
  created: function() {
    events.$on("newNotifies", notifies => {
      //新的notify发过来，则显示popup提醒
      if (notifies.length <= 0) {
        return;
      }
      this.popupVisible = true;
      setTimeout(() => {
        this.popupVisible = false;
      }, 2000);
    });
    events.$on("show-popup-mid", itemList => {
      this.itemList = itemList;
      this.popupVisibleMid = true;
    });
  },
  data: function() {
    return {
      realFalse: false,
      popupVisible: false,
      popupVisibleMid: false,
      itemList: [],
      transitionName: "forwardMov"
    };
  },
  components: {
    popup: Popup
  },
  methods: {
    gotoNotifyPage: function() {
      this.$router.push({ name: "notify" });
      this.popupVisible = false;
    },
    clickPopupItem: function(item) {
      this.popupVisibleMid = false;
      this.itemList = [];
      events.$emit("click-popup-mid", item);
    }
  },
  watch: {
    $route(to, from) {
      console.log(window.history.length)
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth >= fromDepth ? "forwardMov" : "backMov";
    },
    popupVisibleMid: function() {
      if (!this.popupVisibleMid) {
        events.$emit("click-popup-mid");
      }
    }
  }
};
</script>

<style>
.feed-top-popup-item1 {
  width: 100vw;
  height: 12vw;
  line-height: 12vw;
  font-size: 4vw;
  color: white;
  text-align: center;
  z-index: 5000;
  background-color: #292929;
}
.feed-mid-popup-item {
  width: 50vw;
  height: 12vw;
  line-height: 12vw;
  font-size: 4vw;
  text-align: center;
  z-index: 5000;
  background-color: white;
  border-bottom: 1px solid rgb(199, 199, 199);
}
div {
  -moz-user-select: none;
  word-wrap: break-word;
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: #12312300;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}
.forwardMov-enter-active {
  animation: forwardMov-in 0.4s;
}
.forwardMov-leave-active {
  animation: forwardMov-out 0.4s;
}
@keyframes forwardMov-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
@keyframes forwardMov-out {
  0% {
    transform: translateX(0%);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.backMov-enter-active {
  animation: backMov-in 0.4s;
}
.backMov-leave-active {
  animation: backMov-out 0.4s;
}
@keyframes backMov-in {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
@keyframes backMov-out {
  0% {
    transform: translateX(0%);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
/* -------------------------------------------------------------------------------------------------------- */
.mint-spinner-snake {
  -webkit-animation: mint-spinner-rotate 0.8s infinite linear;
  animation: mint-spinner-rotate 0.8s infinite linear;
  border: 4px solid transparent;
  border-radius: 50%;
}
@-webkit-keyframes mint-spinner-rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes mint-spinner-rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.mint-spinner-double-bounce {
  position: relative;
}
.mint-spinner-double-bounce-bounce1,
.mint-spinner-double-bounce-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-animation: mint-spinner-double-bounce 2s infinite ease-in-out;
  animation: mint-spinner-double-bounce 2s infinite ease-in-out;
}
.mint-spinner-double-bounce-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
@-webkit-keyframes mint-spinner-double-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes mint-spinner-double-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.mint-spinner-triple-bounce {
}
.mint-spinner-triple-bounce-bounce1,
.mint-spinner-triple-bounce-bounce2,
.mint-spinner-triple-bounce-bounce3 {
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: mint-spinner-triple-bounce 1.4s infinite ease-in-out both;
  animation: mint-spinner-triple-bounce 1.4s infinite ease-in-out both;
}
.mint-spinner-triple-bounce-bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.mint-spinner-triple-bounce-bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
@-webkit-keyframes mint-spinner-triple-bounce {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes mint-spinner-triple-bounce {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.mint-spinner-fading-circle {
  position: relative;
}
.mint-spinner-fading-circle-circle {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
}
.mint-spinner-fading-circle-circle::before {
  content: " ";
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  border-radius: 100%;
  -webkit-animation: mint-fading-circle 1.2s infinite ease-in-out both;
  animation: mint-fading-circle 1.2s infinite ease-in-out both;
}
.mint-spinner-fading-circle-circle.is-circle2 {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}
.mint-spinner-fading-circle-circle.is-circle2::before {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.mint-spinner-fading-circle-circle.is-circle3 {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
}
.mint-spinner-fading-circle-circle.is-circle3::before {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.mint-spinner-fading-circle-circle.is-circle4 {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.mint-spinner-fading-circle-circle.is-circle4::before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.mint-spinner-fading-circle-circle.is-circle5 {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
}
.mint-spinner-fading-circle-circle.is-circle5::before {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.mint-spinner-fading-circle-circle.is-circle6 {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
}
.mint-spinner-fading-circle-circle.is-circle6::before {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
.mint-spinner-fading-circle-circle.is-circle7 {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.mint-spinner-fading-circle-circle.is-circle7::before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
.mint-spinner-fading-circle-circle.is-circle8 {
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
}
.mint-spinner-fading-circle-circle.is-circle8::before {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.mint-spinner-fading-circle-circle.is-circle9 {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
}
.mint-spinner-fading-circle-circle.is-circle9::before {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
.mint-spinner-fading-circle-circle.is-circle10 {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
}
.mint-spinner-fading-circle-circle.is-circle10::before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
.mint-spinner-fading-circle-circle.is-circle11 {
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
}
.mint-spinner-fading-circle-circle.is-circle11::before {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
.mint-spinner-fading-circle-circle.is-circle12 {
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
}
.mint-spinner-fading-circle-circle.is-circle12::before {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}
@-webkit-keyframes mint-fading-circle {
  0%,
  39%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
@keyframes mint-fading-circle {
  0%,
  39%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
/* message-box-------------------------------------------------------------------------------------------- */
.mint-msgbox {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  background-color: #fff;
  width: 85%;
  border-radius: 3px;
  font-size: 16px;
  -webkit-user-select: none;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.mint-msgbox-header {
  padding: 15px 0 0;
}
.mint-msgbox-content {
  padding: 10px 20px 15px;
  border-bottom: 1px solid #ddd;
  min-height: 36px;
  position: relative;
}
.mint-msgbox-input {
  padding-top: 15px;
}
.mint-msgbox-input input {
  border: 1px solid #dedede;
  border-radius: 5px;
  padding: 4px 5px;
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
}
.mint-msgbox-input input.invalid {
  border-color: #ff4949;
}
.mint-msgbox-input input.invalid:focus {
  border-color: #ff4949;
}
.mint-msgbox-errormsg {
  color: red;
  font-size: 12px;
  min-height: 18px;
  margin-top: 2px;
}
.mint-msgbox-title {
  text-align: center;
  padding-left: 0;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
}
.mint-msgbox-message {
  color: #999;
  margin: 0;
  text-align: center;
  line-height: 36px;
}
.mint-msgbox-btns {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.mint-msgbox-btn {
  line-height: 35px;
  display: block;
  background-color: #fff;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  margin: 0;
  border: 0;
}
.mint-msgbox-btn:focus {
  outline: none;
}
.mint-msgbox-btn:active {
  background-color: #fff;
}
.mint-msgbox-cancel {
  width: 50%;
  border-right: 1px solid #ddd;
}
.mint-msgbox-cancel:active {
  color: #000;
}
.mint-msgbox-confirm {
  color: #26a2ff;
  width: 50%;
}
.mint-msgbox-confirm:active {
  color: #26a2ff;
}
.msgbox-bounce-enter {
  opacity: 0;
  -webkit-transform: translate3d(-50%, -50%, 0) scale(0.7);
  transform: translate3d(-50%, -50%, 0) scale(0.7);
}
.msgbox-bounce-leave-active {
  opacity: 0;
  -webkit-transform: translate3d(-50%, -50%, 0) scale(0.9);
  transform: translate3d(-50%, -50%, 0) scale(0.9);
}

.v-modal-enter {
  -webkit-animation: v-modal-in 0.2s ease;
  animation: v-modal-in 0.2s ease;
}
.v-modal-leave {
  -webkit-animation: v-modal-out 0.2s ease forwards;
  animation: v-modal-out 0.2s ease forwards;
}
@-webkit-keyframes v-modal-in {
  0% {
    opacity: 0;
  }
  100% {
  }
}
@keyframes v-modal-in {
  0% {
    opacity: 0;
  }
  100% {
  }
}
@-webkit-keyframes v-modal-out {
  0% {
  }
  100% {
    opacity: 0;
  }
}
@keyframes v-modal-out {
  0% {
  }
  100% {
    opacity: 0;
  }
}
.v-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
}
/*--------------------------------------------------------------------------------------------------------------*/
.mint-popup {
  position: fixed;
  background: #fff;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.2s ease-out;
  transition: 0.2s ease-out;
}
.mint-popup-top {
  top: 0;
  right: auto;
  bottom: auto;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}
.mint-popup-right {
  top: 50%;
  right: 0;
  bottom: auto;
  left: auto;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
}
.mint-popup-bottom {
  top: auto;
  right: auto;
  bottom: 0;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}
.mint-popup-left {
  top: 50%;
  right: auto;
  bottom: auto;
  left: 0;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
}
.popup-slide-top-enter,
.popup-slide-top-leave-active {
  -webkit-transform: translate3d(-50%, -100%, 0);
  transform: translate3d(-50%, -100%, 0);
}
.popup-slide-right-enter,
.popup-slide-right-leave-active {
  -webkit-transform: translate3d(100%, -50%, 0);
  transform: translate3d(100%, -50%, 0);
}
.popup-slide-bottom-enter,
.popup-slide-bottom-leave-active {
  -webkit-transform: translate3d(-50%, 100%, 0);
  transform: translate3d(-50%, 100%, 0);
}
.popup-slide-left-enter,
.popup-slide-left-leave-active {
  -webkit-transform: translate3d(-100%, -50%, 0);
  transform: translate3d(-100%, -50%, 0);
}
.popup-fade-enter,
.popup-fade-leave-active {
  opacity: 0;
}
/*Toast -----------------------------------------------------------------------------------------------------------------*/
.mint-toast {
  position: fixed;
  max-width: 80%;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  box-sizing: border-box;
  text-align: center;
  z-index: 1000;
  -webkit-transition: opacity 0.3s linear;
  transition: opacity 0.3s linear;
}
.mint-toast.is-placebottom {
  bottom: 50px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
.mint-toast.is-placemiddle {
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.mint-toast.is-placetop {
  top: 50px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
.mint-toast-icon {
  display: block;
  text-align: center;
  font-size: 56px;
}
.mint-toast-text {
  font-size: 14px;
  display: block;
  text-align: center;
}
.mint-toast-pop-enter,
.mint-toast-pop-leave-active {
  opacity: 0;
}
/*loadmore*/
.mint-loadmore {
  overflow: hidden;
}
.mint-loadmore-content {
}
.mint-loadmore-content.is-dropped {
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.mint-loadmore-top,
.mint-loadmore-bottom {
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.mint-loadmore-top {
  margin-top: -50px;
}
.mint-loadmore-bottom {
  margin-bottom: -50px;
}
.mint-loadmore-spinner {
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
}
.mint-loadmore-text {
  vertical-align: middle;
}
/* indicator------------------------------- */
.mint-indicator {
  -webkit-transition: opacity 0.2s linear;
  transition: opacity 0.2s linear;
}
.mint-indicator-wrapper {
  top: 50%;
  left: 50%;
  position: fixed;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  box-sizing: border-box;
  text-align: center;
}
.mint-indicator-text {
  display: block;
  color: #fff;
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
}
.mint-indicator-spin {
  display: inline-block;
  text-align: center;
}
.mint-indicator-mask {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: transparent;
}
.mint-indicator-enter,
.mint-indicator-leave-active {
  opacity: 0;
}
</style>
