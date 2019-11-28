<template>
  <warpper>
    <div class="login">
      <div class="login-bg" id="bg"></div>
      <div class="login-q">
        <transition name="down-fade" appear>
          <div class="login-system clear">
            <img class="center" src="../assets/logo.png" alt="logo"> 
            <div>
              <h1>办公自动化系统</h1>
              <p>OFFICE AUTOMATION SYSTEM</p>
            </div>
          </div>
        </transition>
        <login-form />
      </div>
      <div class="login-footer">
        <ul class="footer clear">
          <li>
            v {{version}}
          </li>
        </ul>
      </div>
    </div>  
  </warpper>
</template>

<script>
import loginForm from './loginForm'

export default {
  name: 'login',
  data() {
    return {
      version: this.$store.getters.version,
    }
  },
  components: {
    loginForm,
  },
  computed: {
    isAgent() {
      return this.$route.meta.agent
    },
  },
}
</script>

<style lang="stylus">
.login
  background-color: #fff
  background: -webkit-gradient(linear, 0 0, 0 bottom, from(#DDD), color-stop(0.2, #FBFBFB), to(#FBFBFB))
  background-size: 100% 100%
  background-position: center center
  background-repeat: no-repeat
  height: 100%
  position: relative
  .login-q
    height: 500px
    width 360px
    position: absolute
    left: 50%
    top: 40%
    margin-top: -250px
    margin-left: -180px
  p
    color: #ccc
    padding-bottom: 16px

  .login-system
    line-height: 1
    padding: 0 12px
    text-align: center
    img[alt=logo]
      display: block
      width: 72px
      height: 72px
    h1
      font-size: 36px
      font-weight: 400
      color: #333
      padding-top: 16px
    p
      font-size: 18px
      color: #999
      line-height: 2
      font-weight: normal
      padding: 8px 0
    .left
      padding-left: 12px

  .login-footer
    position: absolute
    bottom: 0
    height: 35px
    line-height: 35px
    width: 100%
    overflow: hidden
    font-size: 12px
    color: #333
    .footer
      padding-left: 44px
      padding-right: 44px
      white-space: nowrap
      li
        float: right
        display: inline-block
  .login-bg
    position: absolute
    display: block
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 0
    overflow: hidden
</style>
