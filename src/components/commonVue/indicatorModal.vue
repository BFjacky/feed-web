<template>
  <div class="container" v-if="show">
      <div class="mask-modal fadeOut"></div>
  </div>
</template>
<script>
import config from "@/components/helper/config";
import { Indicator } from "mint-ui";
export default {
  data: function() {
    return {
      updating: false,
      fetching: false,
      show: false,
      text: "正在登陆"
    };
  },
  created: function() {
    this.updating = config.user.updating;
    this.fetching = config.user.fetching;
    if (!this.updating && !this.fetching) {
      return;
    }
    const intervalId = setInterval(() => {
      this.updating = config.user.updating;
      this.fetching = config.user.fetching;
      if (this.updating || this.fetching) {
        Indicator.open({
          text: this.text,
          spinnerType: "fading-circle"
        });
        this.show = true;
      } else {
        Indicator.close();
        this.show = false;
        clearInterval(intervalId)
      }
    }, 100);
  }
};
</script>

<style lang="less" scoped>
.container {
  z-index: 5000;
  position: fixed;
  height: 100vh;
  width: 100vw;
}
@keyframes fadeOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.6;
  }
}
.fadeOut {
  animation: fadeOut ease-in-out 0.3s forwards;
}
.mask-modal {
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: black;
}
</style>
