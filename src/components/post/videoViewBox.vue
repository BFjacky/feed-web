<template>
  <div class="container"  v-if="video">
    <spinner :type="3" class="spinPosition" v-show="!hasUploaded"></spinner>
    <video class="video" :src="video.sourceUrl" controls="controls"></video>
  </div>
</template>
<script>
import { Spinner } from "mint-ui";
import helper from "../helper/helper";
export default {
  props: ["video"],
  data: function() {
    return {
      hasUploaded: false
    };
  },
  components: {
    spinner: Spinner
  },
  watch: {
    video: async function() {
      this.hasUploaded = false;
      const videoUploaded = await helper.upload(this.video);
      //w200
      this.video.url = videoUploaded.url;
      //w500
      this.video.urlMiddle = videoUploaded.urlMiddle;
      //原图
      this.video.sourceUrl = videoUploaded.sourceUrl;
      //key
      this.video.key = videoUploaded.key;

      this.hasUploaded = true;

      this.$emit("uploaded", this.video);
    }
  }
};
</script>
<style lang="less" scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.container {
  margin-left: 5vw;
  box-shadow: 1px 1px 1px 1px #dadada;
  width: 90vw;
  height: calc(90vw*9/16);
  .video {
    height: 100%;
    width: 100%;
  }
  .spinPosition {
    position: relative;
    left: 42vw;
    top: 20vw;
  }
  .delete-button {
    position: absolute;
    width: 5vw;
    height: 5vw;
    background-image: url("../../assets/delete.png");
    background-size: 100% 100%;
    transform: translate(12vw, -12vw);
  }
}
</style>
