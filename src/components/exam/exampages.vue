<template>
  <div class="container">
      <div class="questions-box">
          <question class="question" :class="question.animation" v-show="question.show" v-for="question in questions" :key="question.id" :question="question" :qlength="questions.length" v-on:previous="previous" v-on:next="next"></question>
      </div>
  </div>
</template>
<script>
import question from "./question";
import config from "../helper/config";
import helper from "../helper/helper";
import examEvents from "./examEvents";
import Questions from "./questions.js";
import axios from "axios";
import { MessageBox } from "mint-ui";
export default {
  data: function() {
    return {
      questions: [],
      rightNumber: 0
    };
  },
  created: function() {
    this.initQuestions();
    examEvents.$on("correct", order => {
      this.rightNumber++;
    });
    examEvents.$on("overAnswer", async () => {
      if (this.rightNumber >= 6) {
        //更新本地config.user.pass 为true
        config.user.pass = true;
        MessageBox({
          title: "恭喜",
          message: `做对了${this.rightNumber}个题目,恭喜你通过啦`,
          confirmButtonText: "哈哈哈"
        }).then(action => {
          if (action === "confirm") {
            this.$router.go(-1);
          }
        });
        //发送后端请求，告知服务端此用户通过测试
        const passRes = await axios({
          url: `${config.url.feedUrl}/user/userpass`,
          withCredentials: true,
          params: {}
        });
      } else {
        MessageBox({
          title: "遗憾",
          message: `做对了${
            this.rightNumber
          }个题目,做对6个即可通过，不要灰心，加油!`,
          showCancelButton: true,
          confirmButtonText: "再来一次",
          cancelButtonText: "不来了"
        }).then(action => {
          if (action === "confirm") {
            examEvents.$emit("again");
          }
        });
      }
    });
    examEvents.$on("again", () => {
      //再来一次则还原题库
      this.initQuestions();
    });
  },
  components: {
    question
  },
  methods: {
    initQuestions: async function() {
      //初始化问题
      const tempQuestions = Questions(10);
      const newQuestions = this.$lodash.cloneDeep(tempQuestions);
      //将答对的题目数量置为0
      this.rightNumber = 0;
      /*为每一项问题加上order,show,animation等是其结构变为这样
        {
          show: false,
          order: 10,
          text: "vuejs 默认情况下启动项目一般会监听哪一个端口",
          animation: "",
          options: [
            { hasChosen: false, text: "localhost:7001" },
            { hasChosen: false, text: "localhost:6379" },
            { hasChosen: false, text: "localhost:8080" },
            { hasChosen: false, text: "localhost:27017" }
          ],
          answer: { text: "localhost:8080" }
        }
      */
      let index = 0;
      for (const question of newQuestions) {
        index++;
        question.show = false;
        question.order = index;
        question.animation = "";
        //将answer变为对象形式
        const answerText = question.answer;
        question.answer = { text: answerText };
        //将选项变为对象形式
        const newOptions = [];
        for (let option of question.options) {
          let objOption = { hasChosen: false, text: option };
          newOptions.push(objOption);
        }
        question.options = newOptions;
      }
      //显示第一个question
      newQuestions[0].show = true;
      this.questions = [];
      await helper.wait(10);
      this.questions = newQuestions;
    },
    previous: function() {
      //找到当前显示的index
      let index = -1;
      for (const question of this.questions) {
        index++;
        if (question.show) {
          break;
        }
      }

      //将本题向上弹出
      this.questions[index].animation = "leaveUp";
      setTimeout(() => {
        this.questions[index].show = false;
      }, 500);
      //将上一题从后方推出
      setTimeout(() => {
        this.questions[index - 1].show = true;
        this.questions[index - 1].animation = "comeGrow";
      }, 100);
    },
    next: function() {
      //找到当前显示的index
      let index = -1;
      for (const question of this.questions) {
        index++;
        if (question.show) {
          break;
        }
      }

      //如果显示的为最后一页
      //code....

      //将本题向后缩小
      this.questions[index].animation = "leaveShrink";
      setTimeout(() => {
        this.questions[index].show = false;
      }, 500);
      //将下一题从上方滑落
      setTimeout(() => {
        this.questions[index + 1].show = true;
        this.questions[index + 1].animation = "comeDown";
      }, 100);
    }
  }
};
</script>
<style lang="less" scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
  position: fixed;
}
.container {
  background: linear-gradient(rgb(209, 209, 209), rgb(236, 236, 236));
  height: 100vh;
  width: 100vw;
  .questions-box {
    height: 100vh;
    width: 100vw;
    .question {
      left: 5vw;
      top: 10vh;
    }
  }
}
@keyframes leave-up {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}
.leaveUp {
  animation: leave-up 0.5s ease-in-out forwards;
}
@keyframes come-down {
  0% {
    transform: translateY(-100vh);
    opacity: 0;
  }
  100% {
    transform: translateY(0vh);
    opacity: 1;
  }
}
.comeDown {
  animation: come-down 0.5s ease-in-out forwards;
}
@keyframes leave-shrink {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0;
  }
}
.leaveShrink {
  animation: leave-shrink 0.5s ease-in-out forwards;
  position: fixed;
}
@keyframes come-grow {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.comeGrow {
  animation: come-grow 0.5s ease-in-out forwards;
  position: fixed;
}
</style>
