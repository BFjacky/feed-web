<template>
  <div class="container"  @click="viewImage">
    <spinner :type="3" v-if="!finalImg.hasUploaded" class="spinPosition"></spinner>
    <div class="delete-button" v-on:click="deleteImg"></div>
    <div v-if="finalImg.hasUploaded" class="img-container" v-bind:style="{backgroundImage:`url(${finalImg.url})`}"></div>
  </div>
</template>
<script>
import { Spinner } from "mint-ui";
import helper from "../helper/helper";
export default {
  props: ["img"],
  data: function() {
    return {
      finalImg: {}
    };
  },
  components: {
    spinner: Spinner
  },
  methods: {
    deleteImg: function() {
      this.$emit("deleteImg", this.img);
    },
    viewImage: function() {
      this.$emit("viewImage", this.img);
    }
  },
  mounted: async function() {
    if (!this.img.hasUploaded) {
      console.log("未上传过的");
      const imgUploaded = await helper.upload(this.img);
      //w200
      this.img.url = imgUploaded.url;
      //原图
      this.img.sourceUrl = imgUploaded.sourceUrl;
      //key
      this.img.key = imgUploaded.key;
      //是否已经上传过
      this.img.hasUploaded = true;

      this.finalImg = this.img;
      this.$emit("uploadImg", this.finalImg);
    } else {
      console.log("上传过的");
      this.finalImg = this.img;
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 30vw;
  height: 30vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(233, 230, 230);
}
.spinPosition {
  position: relative;
}
.img-container {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center center;
}
.delete-button {
  position: absolute;
  width: 5vw;
  height: 5vw;
  background-image: url("../../assets/delete.png");
  background-size: 100% 100%;
  transform: translate(12vw, -12vw);
}
</style>
