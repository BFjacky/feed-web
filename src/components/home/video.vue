<template>
  <div class="container" v-show="display" @click="undisplay" v-bind:class="animation">
      <video class="myvideo" :src=videoSrc autoplay="autoplay" controls="controls" v-on:webkitendfullscreen="exitFullScreen" v-on:x5videoexitfullscreen="exitFullScreen" ref="video"></video>
  </div>
</template>
<script>
import events from "../helper/events";
import store from "../helper/store";
export default {
  created: function() {
    events.$on("displayVideo", videoSrc => {
      this.animation = "fadeIn";
      this.$refs.video.play();
      this.display = true;
      this.videoSrc = videoSrc;
    });
  },
  methods: {
    undisplay: function() {
      this.animation = "fadeOut";
      setTimeout(() => {
        this.display = false;
      }, 300);
    },
    exitFullScreen: function() {
      this.undisplay();
    }
  },
  data: function() {
    return {
      videoSrc: "",
      display: false,
      animation: ""
    };
  }
};
</script>
<style lang="less" scoped>
@keyframes fadeIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.fadeIn {
  animation: fadeIn ease-in-out 0.3s forwards;
}
@keyframes fadeOut {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
.fadeOut {
  animation: fadeOut ease-in-out 0.3s forwards;
}
.container {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(230, 230, 230);
  height: 100vh;
  width: 100vw;
}
.myvideo {
  height: 100vh;
  width: 100vw;
}
</style>
