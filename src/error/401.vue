<template>
  <div class="no-permission">
    <div class="no-permission-warp">
      <div class="title">Oops!</div>
      <div class="text">你没有权限去该页面</div>
      <div class="tip">如有问题请联系你领导，或者</div>
      <ct-button-group>
        <ct-button routerName="index" type="primary">回首页</ct-button>
        <ct-button @click="$router.go(-1)">上一页</ct-button>
      </ct-button-group>
    </div>
  </div>
</template>

<style lang="stylus">
  .no-permission
    height: 100%
    background-color: #fff
    position: relative
    .no-permission-warp
      width: 800px
      height: 500px
      margin: 0 auto
      background-image: url(../../assets/401.gif)
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