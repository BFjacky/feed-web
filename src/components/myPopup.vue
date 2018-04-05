<template>
    <div class="container">
        <div class="popup-container">
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
        </div>
        <div class="mask"></div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.container{
    position: fixed;
    width: 100vw;
    height:100vh;
}
.popup-container {
  position: fixed;
  left: 25vw;
  top: 50%;
  transform: translateY(-50%);
  width: 50vw;
  animation: zoomIn ease-in-out forwards 0.3s;
  .item {
    height: 10vw;
    width: 100%;
    z-index: 10000;
    border: 1px solid rgb(204, 79, 79);
    background-color: rgb(255, 255, 255);
  }
}
@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: scale(0) translateY(-50%);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(-50%);
  }
}
.mask {
  position: fixed;
  background-color: #777676;
  width: 100vw;
  height: 100vh;
  animation: fadeIn ease-in-out forwards 0.3s;
  z-index: 9000;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
