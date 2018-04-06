<template>
  <div class="container">
      <div class="questions-box">
          <question class="question" :class="question.animation" v-show="question.show" v-for="question in questions" :key="question.id" :question="question" :qlength="questions.length" v-on:previous="previous" v-on:next="next"></question>
      </div>
  </div>
</template>
<script>
import question from "./question";
import examEvents from "./examEvents";
import { MessageBox } from "mint-ui";
export default {
  data: function() {
    return {
      questions: [
        {
          show: true,
          order: 1,
          text: "Jser以哪门编程语言为基石",
          animation: "",
          options: [
            { hasChosen: false, text: "Javascript" },
            { hasChosen: false, text: "Java" },
            { hasChosen: false, text: "Python" },
            { hasChosen: false, text: "由Jser俱乐部自创的Jser编程语言" }
          ],
          answer: { text: "Javascript" }
        },
        {
          show: false,
          order: 2,
          text: "谁是Jser俱乐部的创始人",
          animation: "",
          options: [
            { hasChosen: false, text: "费滕" },
            { hasChosen: false, text: "李宇春" },
            { hasChosen: false, text: "扎克伯格" },
            { hasChosen: false, text: "费腾" }
          ],
          answer: { text: "费腾" }
        },
        {
          show: false,
          order: 3,
          text: "px是什么计量单位",
          animation: "",
          options: [
            { hasChosen: false, text: "厘米" },
            { hasChosen: false, text: "流明" },
            { hasChosen: false, text: "像素" },
            { hasChosen: false, text: "楼层" }
          ],
          answer: { text: "像素" }
        },
        {
          show: false,
          order: 4,
          text: "Jser俱乐部的地址",
          animation: "",
          options: [
            { hasChosen: false, text: "哈尔滨大学科技楼503" },
            { hasChosen: false, text: "东北大学东门教师公寓5号2单元2603" },
            { hasChosen: false, text: "哈尔滨工业大学男生第5寝室303" },
            { hasChosen: false, text: "东北农业大学东门教师公寓5号2单元2603" }
          ],
          answer: { text: "东北农业大学东门教师公寓5号2单元2603" }
        },
        {
          show: false,
          order: 5,
          text: "Jser俱乐部的传销头目",
          animation: "",
          options: [
            { hasChosen: false, text: "刘秉南" },
            { hasChosen: false, text: "王卫国" },
            { hasChosen: false, text: "刘秉楠" },
            { hasChosen: false, text: "杰森" }
          ],
          answer: { text: "刘秉楠" }
        },
        {
          show: false,
          order: 6,
          text: "Oppo品牌logo的底板颜色是什么",
          animation: "",
          options: [
            { hasChosen: false, text: "绿色" },
            { hasChosen: false, text: "蓝色" },
            { hasChosen: false, text: "红色" },
            { hasChosen: false, text: "黄色" }
          ],
          answer: { text: "绿色" }
        },
        {
          show: false,
          order: 7,
          text: "Jser俱乐部一张桌子的尺寸是多大",
          animation: "",
          options: [
            { hasChosen: false, text: "长:240cm,宽:120cm" },
            { hasChosen: false, text: "长:240cm,宽:80cm" },
            { hasChosen: false, text: "长:260cm,宽:120cm" },
            { hasChosen: false, text: "长:260cm,宽:80cm" }
          ],
          answer: { text: "长:240cm,宽:120cm" }
        },
        {
          show: false,
          order: 8,
          text: "以下几组成员中全是Jser俱乐部成员的选项是",
          animation: "",
          options: [
            { hasChosen: false, text: "曾锐 蓝标 崔航 沈星移 贺言" },
            { hasChosen: false, text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" },
            { hasChosen: false, text: "刘斯琦 葛天 高敏 施心平 刘秉楠" },
            { hasChosen: false, text: "韩慧鹏 卢绿萍 周莹 赵白石 郭华鑫" }
          ],
          answer: { text: "吴桐 徐菩 刘培杰 杨钦钦 马天睿" }
        },
        {
          show: false,
          order: 9,
          text: "JS中Math.random()的作用的是",
          animation: "",
          options: [
            { hasChosen: false, text: "随机出一道多元方程数学题" },
            { hasChosen: false, text: "生成0-100的随机数" },
            { hasChosen: false, text: "生成一个二维码...." },
            { hasChosen: false, text: "生成0-1的随机数" }
          ],
          answer: { text: "生成0-1的随机数" }
        },
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
      ],
      rightNumber: 0
    };
  },
  created: function() {
    examEvents.$on("correct", order => {
      this.rightNumber++;
    });
    examEvents.$on("overAnswer", () => {
      let remindtext;
      if (this.rightNumber >= 6) {
        MessageBox({
          title: "恭喜",
          message: `做对了${this.rightNumber}个题目,恭喜你通过啦`,
          confirmButtonText: "哈哈哈"
        }).then(action => {});
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
            console.log("再来一次");
          }
        });
      }
    });
  },
  components: {
    question
  },
  methods: {
    previous: function() {
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
  height: 100vh;
  width: 100vw;
  .questions-box {
    height: 100vh;
    width: 100vw;
    .question{
        left:5vw;
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
