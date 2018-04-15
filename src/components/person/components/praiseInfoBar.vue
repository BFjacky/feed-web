<template>
  <div class="praiseBox">
    <div class="left">
      <div class="name-top">
          <div class="name-text" v-for="(notReadPraiseinfo,index) in notify.notReadPraiseInfo" v-if="index<5">{{notReadPraiseinfo.nickName}}&nbsp&nbsp</div>
          <div class="remind-text" v-if="notify.notReadPraiseInfo.length>5">等多人赞了你的动态</div>
          <div class="remind-text" v-if="notify.notReadPraiseInfo.length<=5">&nbsp&nbsp赞了你的动态</div>
      </div>
      <div class="avatar-mid">
        <div class="avatar" v-for="(notReadPraiseinfo,index) in notify.notReadPraiseInfo" v-bind:style="{backgroundImage:`url(${notReadPraiseinfo.avatarUrl})`}" v-if="index<5"></div>
        <div class="more-avatar" v-if="notify.notReadPraiseInfo.length>5"></div>      
      </div>
      <div class="time-bototm"></div>
    </div>
    <div class="right">
      <div class="thread-text">{{notify.content}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["notify"],
  data: function() {
    return {};
  },
  created: function() {}
};
</script>
<style lang="less" scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.praiseBox {
  position: relative;
  border-bottom: 1px solid rgb(218, 218, 218);
  display: flex;
  padding: 4vw;
  .left {
    display: flex;
    width: 70vw;
    flex-direction: column;
    justify-content: space-around;
    .name-top {
      display: flex;
      flex-wrap: wrap;
      line-height: 6vw;
      .name-text {
        color: #47a4c9;
      }
      .remind-text {
        color: #414141;
      }
    }
    .avatar-mid {
      padding: 1vw 0;
      display: flex;
      flex-wrap: wrap;
      .avatar {
        width: 10vw;
        height: 10vw;
        border-radius: 50%;
        background-size: 100% 100%;
      }
      .more-avatar {
        width: 10vw;
        height: 10vw;
        border-radius: 50%;
        background-size: 90% 90%;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("../../../assets/more.png");
        background-color: #d1d1d1;
      }
    }
  }
  .right {
    .thread-text {
      border: 0px solid red;
      overflow-y: auto;
      text-align: left;
      color: #b3b3b3;
      font-size: 4vw;
      line-height: 4vw;
      max-height: 30vw;
      width: 20vw;
    }
    border: 0px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
