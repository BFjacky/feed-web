<template>
    <div class="playVideo" @click.stop="playVideo" :style="singleVideoStyle" v-if="video">
      <spinner :type="3" class="spinPosition" v-show="!hasUploaded"></spinner>
      <div class="play-button" v-show="hasUploaded"></div>
       <div class="delete-button" @click.stop="deleteVideo"></div>
    </div>
</template>
<script>
import { Spinner } from "mint-ui";
import events from "../helper/events";
import config from "../helper/config";
import helper from "../helper/helper";
export default {
  props: ["video"],
  data: function() {
    return {
      hasUploaded: false,
      singleVideoStyle: {}
    };
  },
  components: {
    spinner: Spinner
  },

  methods: {
    playVideo: function() {
      events.$emit("displayVideo", this.video.sourceUrl);
    },
    deleteVideo: function() {
      this.$emit("deleteVideo");
      this.hasUploaded = false;
      this.singleVideoStyle = {};
    }
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

      //获得video 封面图片宽高
      if (this.video) {
        const img = new Image();
        img.src = `${this.video.sourceUrl}${config.videoVframe}`;
        if (img.complete) {
          const height = 45 * img.height / img.width + "vw";
          const width = "45vw";
          this.singleVideoStyle = {
            height: height,
            width: width,
            backgroundImage: `url(${img.src})`
          };
        } else {
          img.onload = () => {
            const height = 45 * img.height / img.width + "vw";
            const width = "45vw";
            this.singleVideoStyle = {
              height: height,
              width: width,
              backgroundImage: `url(${img.src})`
            };
            img.onload = null; //避免重复加载
          };
        }
      }

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
.playVideo {
  position: relative;
  width: 65vw;
  height: calc(65vw*9/16);
  margin-top: 3vw;
  background-size: 100% 100%;
  border: 0px solid black;
  margin-left: 5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .spinPosition {
  }
  .delete-button {
    position: absolute;
    left: 39.5vw;
    top: 0vw;
    width: 5vw;
    height: 5vw;
    border-radius: 50%;
    opacity: 0.8;
    background-image: url("../../assets/delete.png");
    background-size: 100% 100%;
    border: 0px solid black;
    background-color: black;
  }
  .play-button {
    background-image: url("../../assets/play-button.png");
    height: 10vw;
    width: 10vw;
    position: absolute;
    left: calc((65vw-10vw)/2);
    background-size: 100%;
  }
}
</style>
