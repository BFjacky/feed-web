<template>  
          <div class="page-item">
              <div class="title-box">
                  <div class="title-text">Q{{question.order}}:{{question.text}}</div>
              </div>
              <div class="options-box">
                  <div class="option-box" v-for="(option,index) in question.options" @click="chooseThisOption(index)" :key="option.id">
                      <div class="option-circle" :class="{tickRight:showAnswer&&option.tickRight,tickWrong:showAnswer&&option.tickWrong}">
                          <div class="littleCircle" v-show="option.hasChosen&&!showAnswer"></div>
                      </div>
                      <div class="option-text">{{option.text}}</div>
                  </div>
                  <div class="remind-text" v-show="noChosen&&showAnswer">此题你没有选择答案!</div>
              </div>
              <div class="buttons-box">
                  <div class="button1" @click="goPrevious">{{button1Text}}</div>
                  <div class="text1">{{question.order}}/{{qlength}}</div>
                  <div class="button2" @click="goNext">{{button2Text}}</div>
              </div>
          </div>  
</template>
<script>
import examEvents from "./examEvents";
import config from "../helper/config";
import { MessageBox } from "mint-ui";
export default {
  props: ["question", "qlength"],
  data: function() {
    return {
      button1Text: "上一题",
      button2Text: "下一题",
      showAnswer: false,
      noChosen: true
    };
  },
  components: {},
  created: function() {
    if (this.question.order === this.qlength) {
      this.button2Text = "交卷子";
    }
    if (this.question.order === 1) {
      this.button1Text = "没有了";
    }

    examEvents.$once("checkAnswer", () => {
      this.showAnswer = true;
      //找到选中的选
      for (const option of this.question.options) {
        //正确选项应该被打勾
        if (option.text === this.question.answer.text) {
          option.tickRight = true;
        }
        if (option.hasChosen) {
          this.noChosen = false;
          if (option.text === this.question.answer.text) {
            examEvents.$emit("correct", this.question.order);
          } else {
            option.tickWrong = true;
          }
        }
      }
    });
  },
  methods: {
    goPrevious: function() {
      if (this.button1Text === "上一题") {
        this.$emit("previous");
      }
    },
    goNext: function() {
      if (this.button2Text === "下一题") {
        this.$emit("next");
      } else if (this.button2Text === "交卷子") {
        MessageBox({
          title: "交卷子",
          message: "交了卷子，可就不能改了哦",
          showCancelButton: true,
          confirmButtonText: "自信交卷",
          cancelButtonText: "我再看看"
        })
          .then(async action => {
            if (action === "confirm") {
              examEvents.$emit("checkAnswer");
              (this.button2Text = "再来一次"),
                //examEvents
                setTimeout(() => {
                  //200ms通知exampages结算结果
                  examEvents.$emit("overAnswer");
                }, 200);
            }
          })
          .catch(() => {});
      } else if ((this.button2Text = "再来一次")) {
        examEvents.$emit("again");
      }
    },
    chooseThisOption: function(index) {
      for (const option of this.question.options) {
        option.hasChosen = false;
      }
      this.question.options[index].hasChosen = true;
      this.goNext();
    }
  }
};
</script>
<style lang="less" scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}

.page-item {
  background-image: url("./test-bg.png");
  background-size: 100% 100%;
  width: 90vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title-box {
    margin-top: 1vh;
    width: 80vw;
    height: 12vh;
    display: flex;
    align-items: center;
    .title-text {
      width: 80vw;
      color: white;
      font-size: 3vh;
      text-align: center;
      line-height: 5vh;
      padding: 0 4vw;
    }
  }
  .options-box {
    height: 55vh;
    width: 80vw;
    display: flex;
    margin-top: 4vw;
    flex-direction: column;
    .option-box {
      padding: 1.5vw 4vw;
      width: 80vw;
      display: flex;
      .option-circle {
        height: 7vw;
        width: 7vw;
        border-radius: 50%;
        border: 1px solid rgb(143, 98, 167);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        .littleCircle {
          width: 3.5vw;
          height: 3.5vw;
          border-radius: 50%;
          background-color: rgb(143, 98, 167);
        }
      }
      .tickRight {
        background-image: url("../../assets/tick.png");
        background-size: 100% 100%;
      }
      .tickWrong {
        background-image: url("../../assets/tick-wrong.png");
        background-size: 100% 100%;
      }
      .option-text {
        text-align: left;
        margin-left: 4vw;
        line-height: 7vw;
      }
    }
    .remind-text {
      color: rgb(194, 0, 0);
    }
  }
  .buttons-box {
    width: 80vw;
    flex-grow: 1;
    margin-bottom: 1vh;
    display: flex;
    justify-content: space-around;
    .button1 {
      color: red;
    }
    .button2 {
      color: green;
    }
  }
}
</style>
