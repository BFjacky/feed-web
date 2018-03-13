<template>
  <div class="container">
      <textarea class="text-area" :maxlength="maxWordsLength" placeholder="说点什么吧..."></textarea>
      <div class="imgs-area">
        <img-view-box v-for="img in imgs" :img="img" :key="index" v-on:uploadImg="uploadHandler" v-on:deleteImg="deleteHandler"></img-view-box>
      </div>
      <div class="bottom-bar">
          <div class="functions">
            <div class="function-button photo-button" @click="addImage"></div>
            <div class="function-button theme-button">主题</div>
          </div>
          <div class="function-button send-button" @click="confirmToSend">发送</div>
      </div>
      <input class="hide-button" ref="filesButton" type="file" multiple="multiple" accept="image/*" @change="chooseFile($event)"></input>
  </div>
</template>
<script>
import { MessageBox, Spinner } from "mint-ui";
import imgViewBox from "./imgViewBox";
import helper from "../helper/helper";
export default {
  methods: {
    addImage: function() {
      this.$refs.filesButton.click();
    },
    chooseFile: async function(event) {
      const newFiles = [];
      for (let i = 0; i < event.target.files.length; i++) {
        newFiles.push(event.target.files[i]);
      }
      this.imgs = this.imgs.concat(newFiles);
      if (this.imgs.length > this.maxImgNumbers) {
        MessageBox.alert(`最多选择${this.maxImgNumbers}张图片`, "提示");
        this.imgs = this.imgs.slice(0, 9);
      }
    },
    uploadHandler: function(img) {
      this.finalImgs.push(img);
    },
    deleteHandler: async function(img) {
      async function wait(time) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("ok");
          }, time);
        });
      }

      for (let i = 0; i < this.imgs.length; i++) {
        if (this.imgs[i].sourceUrl === img.sourceUrl) {
          this.imgs.splice(i, 1);
          break;
        }
      }
      //FIXED ME
      const imgs = this.imgs;
      this.imgs = [];
      await wait(10);
      this.imgs = imgs;
    },
    confirmToSend: function() {
      if (this.finalImgs.length !== this.imgs.length) {
        MessageBox.alert(
          `还差${this.imgs.length - this.finalImgs.length}张图片没有上传完`,
          "提示"
        );
      }
    }
  },

  created: function() {},
  data: function() {
    return {
      maxWordsLength: 300,
      imgs: [],
      finalImgs: [],
      maxImgNumbers: 9
    };
  },
  components: {
    MessageBox,
    spinner: Spinner,
    imgViewBox
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
.text-area {
  resize: none;
  box-sizing: boder-box;
  border-width: 0;
  height: 25vh;
  padding: 5vw;
  overflow-y: auto;
  // box-shadow: 0 0.5vw 0.5vw 0.5vw rgb(180, 178, 178);
  width: 90vw;
  font-size: 4vw;
}
.hide-button {
  position: fixed;
  left: -200vw;
}
.imgs-area {
  width: 100%;
  border: 0px solid black;
  display: flex;
  flex-wrap: wrap;
  padding: 3vw;
  .img {
    width: 25vw;
    height: 25vw;
    background-size: 100% 100%;
    background-position: center center;
  }
}
.bottom-bar {
  display: flex;
  height: 5%;
  width: 100%;
  padding: 3vw;
  padding-left: 6vw;
  position: fixed;
  bottom: 0;
  border: 0px solid black;
  background-color: rgb(245, 245, 245);
  justify-content: space-between;
  opacity: 0.9;
  align-items: center;
  .functions {
    display: flex;
  }
  .function-button {
    height: 10vw;
  }
  .photo-button {
    background-image: url(../../assets/photo.png);
    background-size: 100% 100%;
    width: 10vw;
    height: 10vw;
  }
  .theme-button {
    line-height: 7vw;
    height: 7vw;
    margin: auto auto;
    font-size: 4vw;
    color: #32a8fc;
    margin-left: 6vw;
    border: 0px solid #32a8fc;
    width: 12vw;
    border-radius: 3.5vw;
  }
  .send-button {
    width: 25vw;
    height: 10vw;
    border-radius: 12.5vw;
    background-color: #32a8fc;
    color: white;
    text-align: center;
    line-height: 10vw;
    margin-right: 10vw;
  }
}
</style>
