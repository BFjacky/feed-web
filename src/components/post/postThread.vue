<template>
  <div class="container">
    <div class="text-area">
      <textarea class="content-area" :maxlength="maxWordsLength" placeholder="说点什么吧..." v-model:value="content"></textarea>
      <div class="number-remind">{{content.length}}/{{maxWordsLength}}</div>
    </div>
      <div class="imgs-area">
        <img-view-box v-for="img in imgs" :img="img" :key="index" v-on:uploadImg="uploadHandler" v-on:deleteImg="deleteHandler" v-on:viewImage="viewImageHandler"></img-view-box>
      </div>
      <div class="bottom-bar">
          <div class="functions">
            <div class="function-button photo-button" @click="addImage"></div>
            <div class="function-button theme-button" @click="showThemes">{{themeText==='无主题'?'主题':themeText}}</div>
          </div>
          <div class="function-button send-button" @click="confirmToSend">发送</div>
      </div>
      <input class="hide-button" ref="filesButton" type="file" multiple="multiple" accept="image/*" @change="chooseFile($event)"></input>
      <popup v-model="popupVisible" position="right" class="popup-area">
        <div class="popup-item" v-for="theme in themes" @click="chooseTheme(theme.text)">
          <div class="item-icon" :style="{backgroundImage:`url(${theme.icon})`}"></div>
          <div class="item-text">{{theme.text}}</div>
        </div>
      </popup>
  </div>
</template>
<script>
import { MessageBox, Spinner, Popup, Toast } from "mint-ui";
import imgViewBox from "./imgViewBox";
import helper from "../helper/helper";
import config from "../helper/config";
import axios from "axios";
export default {
  watch: {
    content: function() {}
  },
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
      for (let i = 0; i < this.finalImgs.length; i++) {
        if (this.finalImgs[i].sourceUrl === img.sourceUrl) {
          this.finalImgs.splice(i, 1);
          break;
        }
      }
      //FIX ME
      const imgs = this.imgs;
      this.imgs = [];
      await wait(10);
      this.imgs = imgs;
    },
    confirmToSend: async function() {
      if (this.hasSent) {
        return;
      }
      if (this.finalImgs.length !== this.imgs.length) {
        MessageBox.alert(
          `还差${this.imgs.length - this.finalImgs.length}张图片没有上传完`,
          "提示"
        );
        return;
      }

      this.hasSent = true;
      const _this = this;
      const sendRes = await axios({
        method: "post",
        url: `${config.url.feedUrl}/thread/newThread`,
        data: {
          thread: {
            imgs: _this.finalImgs,
            themeText: _this.themeText,
            content: _this.content
          }
        },
        withCredentials: true
      });
      if (sendRes.data.success) {
        Toast({
          message: "发送成功",
          position: "middle",
          duration: 500
        });
        setTimeout(() => {
          this.hasSent = false;
          this.$router.push({ name: "index", params: { allowBack: true } });
        }, 500);
      } else {
        this.hasSent = false;
        Toast({
          message: "发送失败",
          position: "middle",
          duration: 2000
        });
      }
    },
    showThemes: function() {
      this.popupVisible = true;
    },
    chooseTheme: function(themeText) {
      this.themeText = themeText;
      this.popupVisible = false;
    },
    viewImageHandler: function(img) {
      const urls = [];
      const current = img.sourceUrl;
      for (const img of this.imgs) {
        urls.push(img.sourceUrl);
      }
      wx.previewImage({ current, urls });
    },
    //提示用户是否要回退
    showBackModal: function() {
      return new Promise((resolve, reject) => {
        MessageBox.confirm("确定要退出此次编辑吗")
          .then(action => {
            if (action === "confirm") {
              resolve("ok");
            }
          })
          .catch(() => {
            console.log(123);
            window.history.forward(1);
          });
      });
    }
  },

  created: function() {},
  data: function() {
    return {
      maxWordsLength: 300,
      imgs: [],
      finalImgs: [],
      maxImgNumbers: 9,
      popupVisible: false,
      themeText: "无主题",
      themes: [
        { icon: require("../../assets/search.png"), text: "失物招领" },
        { icon: require("../../assets/cardiogram.png"), text: "表白墙  " },
        { icon: require("../../assets/money-bag.png"), text: "二手交易" },
        { icon: require("../../assets/car.png"), text: "拼车出行" },
        { icon: require("../../assets/learning.png"), text: "寻找研友" }
      ],
      content: "",
      hasSent: false
    };
  },
  components: {
    MessageBox,
    spinner: Spinner,
    imgViewBox,
    popup: Popup,
    Toast
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  // position: absolute;
}
.text-area {
  resize: none;
  box-sizing: boder-box;
  border-width: 0;
  height: 25vh;
  padding: 5vw;
  padding-top: 2vw;
  overflow-x: hidden;
  overflow-y: hidden;
  // box-shadow: 0 0.5vw 0.5vw 0.5vw rgb(180, 178, 178);
  width: 90vw;
  font-size: 4vw;
  .content-area {
    resize: none;
    box-sizing: boder-box;
    border-width: 0;
    height: 100%;
    // box-shadow: 0 0.5vw 0.5vw 0.5vw rgb(180, 178, 178);
    width: 90vw;
    font-size: 4vw;
  }
  .number-remind {
    position: absolute;
    right: 5vw;
    top: 28vh;
    opacity: 0.5;
  }
}

.hide-button {
  position: fixed;
  left: -200vw;
}
.imgs-area {
  width: 100%;
  position: relative;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  padding: 3vw;

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
    width: 20vw;
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
.popup-area {
  height: 100vh;
  width: 50vw;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  .popup-item {
    margin: 0;
    height: 10vh;
    width: 50vw;
    display: flex;
    justify-content: space-between;
    padding: 1vh;
    border-bottom: 1px solid rgb(223, 223, 223);
    box-sizing: border-box;
    .item-icon {
      height: 8vh;
      width: 8vh;
      background-size: 100% 100%;
      border: 0px solid black;
    }
    .item-text {
      flex-grow: 1;
      line-height: 8vh;
      font-size: 6vw;
    }
  }
  .popup-item:active {
    background-color: #e2e2e2;
  }
}
</style>
