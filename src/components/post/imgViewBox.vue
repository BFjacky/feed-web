<template>
  <div class="container">
    <spinner :type="3" v-if="!finalImg.hasUploaded" class="spinPosition"></spinner>
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
  created: async function() {
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
</style>
