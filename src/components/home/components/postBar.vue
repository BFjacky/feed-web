<template>
  <div class="post-bar-container">
    <div class="img-area"  v-if="img" >
        <img-view-box :img="img" v-on:uploadImg="uploadHandler" v-on:deleteImg="deleteHandler" v-on:viewImage="viewImageHandler">123</img-view-box>
    </div>
    <div class="comment-make">
        <textarea :placeHolder="!replyFor?holderText:replyFor" class="postBar-content-area" :maxlength="150" v-on:keyup="clickKeyBoard" v-on:keydown.delete="deletecontent" v-model:value="content"></textarea> 
        <div class="function-buttons">
            <div class="photo-button" @click="addImg"></div>
            <div class="send-button" @click="sendAComment">发送</div>
        </div>
    </div>
     <input class="hide-button" ref="filesButton" type="file"  accept="image/*" @change="chooseFile($event)"></input>
  </div>
</template>
<script>
import imgViewBox from "../../post/imgViewBox";
import events from "../../helper/events";
import { Toast } from "mint-ui";
export default {
  props: {
    replyFor: ""
  },
  data: function() {
    return {
      content: "",
      img: undefined,
      holderText: "友善的发言更容易得到赞同"
    };
  },
  components: {
    imgViewBox,
    Toast
  },
  created: function() {
    events.$on("hasSent", () => {
      //接收到了已经成功发送的事件
      this.content = "";
      this.img = "";
    });
  },
  methods: {
    clickKeyBoard: function() {
      //检测输入框内容的变化，适应调整输入框大小
      const scrollTop = $(".postBar-content-area").scrollTop();
      const height = $(".postBar-content-area").height();
      $(".postBar-content-area").height(height + scrollTop);
    },
    deletecontent: function() {
      console.log("初始", $(".postBar-content-area").height());
      //输入框中的内容减少时检查是否需要，缩小输入框
      $(".postBar-content-area").height("6vw");
      const scrollTop = $(".postBar-content-area").scrollTop();
      const height = $(".postBar-content-area").height();
      $(".postBar-content-area").height(height + scrollTop);
      console.log("跟新高度", $(".postBar-content-area").height());
    },
    addImg: function() {
      if (this.img) {
        //提示只能选择一张图片
        Toast({
          message: "只能选择一张图片",
          position: "middle",
          duration: 1000
        });
        return;
      }

      this.$refs.filesButton.click();
    },
    chooseFile: async function(event) {
      this.img = event.target.files[0];
    },
    uploadHandler: function(img) {
      console.log(`上传结束:`, img);
      this.img = img;
    },
    deleteHandler: function() {
      this.img = undefined;
    },
    viewImageHandler: function() {
      wx.previewImage({ urls: [this.img.sourceUrl] });
    },
    sendAComment: function() {
      //恢复输入框原来的大小，高度
      $(".postBar-content-area").height("6vw");

      if (!this.img) {
        this.$emit("sendButton", this.content, []);
      } else {
        this.$emit("sendButton", this.content, [this.img]);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.post-bar-container {
  div {
    border: 0px solid red;
    box-sizing: border-box;
  }
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  width: 100vw;
  .img-area {
    margin-left: 1vw;
    margin-bottom: 1px;
    background-color: white;
    box-shadow: 1px 1px 1px 1px #b3b3b3;
    height: 30vw;
    width: 30vw;
  }
  .comment-make {
    // box-shadow: 0 -1px 1px 1px rgb(180, 178, 178);
    border-top: 1px solid rgb(243, 243, 243);
    background-color: white;
    display: flex;
    width: 100vw;
    justify-content: space-around;
    align-items: center;
    padding: 0 0vw;
    .postBar-content-area {
      resize: none;
      width: 75vw;
      font-size: 4vw;
      border-width: 0;
      box-sizing: border-box;
      //   输入框初始高度10vw
      height:6vw;
      padding-left:1vw;
      line-height: 6vw;
    }
    .function-buttons {
      align-self: flex-end;
      display: flex;
      width: 25vw;
      justify-content: space-around;
      align-items: center;
      .send-button {
        box-sizing: border-box;
        flex-shrink: 0;
        flex-grow: 0;
        color: #32a8fc;
        font-size: 5.5vw;
      }
      .photo-button {
        background-image: url(../../../assets/photo.png);
        background-size: 80% 80%;
        background-repeat: no-repeat;
        background-position: center;
        width: 10vw;
        height: 10vw;
      }
    }
  }
}
.hide-button {
  position: fixed;
  left: -200vw;
}
</style>
