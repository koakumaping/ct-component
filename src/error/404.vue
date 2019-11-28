<template>
  <div class="not-found">
    <div class="not-found-warp">
      <div class="title">Oops!</div>
      <div class="text">没有找到该页面</div>
      <div class="tip">请检查您输入的网址是否正确，请点击以下按钮返回首页或者发送错误报告</div>
      <ct-button-group>
        <ct-button routerName="index" type="primary">回首页</ct-button>
        <ct-button @click="$router.go(-1)">上一页</ct-button>
      </ct-button-group>
    </div>
  </div>
</template>

<style lang="stylus">
.not-found
  height: 100%
  background-color: #fff
  position: relative
  .not-found-warp
    width: 800px
    height: 500px
    margin: 0 auto
    background-image: url(../../assets/404.gif)
    background-position: center right
    background-repeat: no-repeat
    position: absolute
    left: 50%
    top: 50%
    margin-left: -400px
    margin-top: -250px
    .title
      font-size: 64px
      padding: 48px 0
    .text
      font-size: 24px
    .tip
      font-size: 16px
      padding: 24px 0
</style>