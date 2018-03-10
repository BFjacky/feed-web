<template>
  <div class="container">
      {{message}}
  </div>
</template>
<script>
export default {
  props: ['message']
};
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
