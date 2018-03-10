<template>
  <div class="container">
      <textarea class="text-area" :maxlength="maxWordsLength" placeholder="说点什么吧..."></textarea>
      <div class="bottom-bar">
          <div class="functions">
            <div class="function-button photo-button"></div>
            <div class="function-button theme-button">主题</div>
          </div>
          <div class="function-button send-button">发送</div>
      </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      maxWordsLength: 300
    };
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
  box-sizing: boder-box;
  border-width: 0;
  height: 25%;
  padding: 5vw;
  overflow-y: auto;
  box-shadow: 0 0.5vw 0.5vw 0.5vw rgb(180, 178, 178);
  width: 100%;
  font-size: 4vw;
}
.bottom-bar {
  display: flex;
  height: 5%;
  width: 100%;
  padding: 3vw;
  position: fixed;
  bottom: 0;
  border: 1px solid black;
  justify-content: space-between;
  align-items: center;
  .functions {
    display: flex;
  }
  .function-button {
    height: 10vw;
    margin-left: 3vw;
  }
  .photo-button {
    background-image: url(../../assets/photo.png);
    background-size: 100% 100%;
    width: 10vw;
    height: 10vw;
  }
  .theme-button {
    line-height: 10vw;
    font-size: 5vw;
    color: #32a8fc;
  }
  .send-button {
    width: 25vw;
    height: 10vw;
    border-radius: 12.5vw;
    background-color: #32a8fc;
    color: white;
    text-align: center;
    line-height: 10vw;
    margin-right: 7vw;
  }
}
</style>
