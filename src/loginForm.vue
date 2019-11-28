<template>
  <div class="login-warp">
    <ct-form v-show="!mobileVisible" labelWidth="0" ref="loginForm" :model="form" :rules="rules">
      <ct-form-line prop="username" class="login-section">
        <ct-input placeholder="请输入用户名"
          width="100%"
          v-model.trim="form.username"
          name="username"
        ></ct-input>
      </ct-form-line>
      <ct-form-line prop="password" class="login-section">
        <ct-input placeholder="请输入密码"
          width="100%"
          type="password"
          name="password"
          v-model.trim="form.password"
        ></ct-input>
      </ct-form-line>
      <ct-form-line class="login-captcha login-section" prop="captcha">
        <ct-input placeholder="请输入验证码"
          width="100%"
          v-model.trim="form.captcha"
          :maxlength="4"
          :enter="login"
        ></ct-input>
        <canvas ref="captcha" width="80" height="30" @click="getCaptcha"></canvas>
      </ct-form-line>
      <ct-form-line class="login-actions">
        <ct-button type="primary" @click="login" :loading="loading">{{loginBtnText}}</ct-button>
        <ct-button
          v-if="type === 'dialog'"
          style="margin-top: 16px"
          v-on:click="returnToLoginPage"
        >返回登录页</ct-button>
      </ct-form-line>
      <div class="clear" style="margin-top: 16px;">
        <!-- <ctCheckbox class="left">记住密码</ctCheckbox> -->
        <span class="right pointer">忘记密码</span>
      </div>
    </ct-form>

    <ct-form v-show="mobileVisible" labelWidth="0" ref="mobileForm" :model="mobileForm" :rules="mobileRules">
      <div class="login-mobile text-left">
        {{mobileContent}}
      </div>
      <ct-form-line class="login-section" prop="code">
        <ct-input placeholder="请输入手机验证码"
          width="100%"
          v-model.trim="mobileForm.code"
          :maxlength="4"
          autofocus
        />
      </ct-form-line>
      <ct-form-line class="login-actions">
        <ct-button
          type="primary"
          v-on:click="mobileLogin()"
          :loading="mobileLoading"
        >提交</ct-button>
        <ct-button
          style="margin-top: 16px"
          v-on:click="goLogin"
        >返回登录界面</ct-button>
      </ct-form-line>
    </ct-form>
  </div>
</template>

<script>
import store from 'store'
import { dictMixins } from 'ct-mixin'
import captcha from './captcha'

export default {
  name: 'loginForm',
  mixins: [dictMixins],
  props: {
    type: {
      default: 'page',
      validator: value => ['page', 'dialog'].indexOf(value) > -1,
    },
  },
  data() {
    const validateCaptcha = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.cc) {
        this.getCaptcha()
        callback(new Error('验证码不正确，请重新输入新生成的验证码!'))
      } else {
        callback()
      }
    }
    return {
      loginBtnText: '登录',
      loading: false,
      mobileVisible: false,
      mobileLoading: false,
      mobileContent: '本次登陆需要手机二次验证',
      form: {
        username: '',
        password: '',
        captcha: '',
      },
      mobileForm: {
        code: '',
      },
      // 要存的用户数据
      user: {
        // 短信认证时用
        id: store.get('id'),
        // 短信认证成功后得到
        // 没有后要重新发送短信获取
        masterKey: store.get('masterKey'),
      },
      // 浏览器关闭后消失，存sessionStorage里
      // 登录成功后得到
      token: '',
      to: this.$route.query.from,
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '密码太短', trigger: 'blur' },
        ],
        captcha: { validator: validateCaptcha, trigger: 'blur' },
      },
      mobileRules: {
        code: { required: true, message: '请输入手机验证码', trigger: 'blur' },
      },
    }
  },
  mounted() {
    let clientrandid = store.get('clientrandid') || ''
    if (!clientrandid) clientrandid = this._.randomString(24)
    const version = store.get('version')
    const packageName = store.get('package')

    this.user.masterKey = store.get('masterKey') || ''
    this.clearAllCookie()
    store.clearAll()
    this.getCaptcha()

    // 必须保存下来
    store.set('version', version)
    store.set('package', packageName)
    store.set('masterKey', this.user.masterKey)
    store.set('clientrandid', clientrandid)
    store.set('perPage', 10)
    this.$cookie.set('masterKey', this.user.masterKey, { expires: 5 })
    document.onkeydown = (event) => {
      const e = event || window.event
      if (e && e.keyCode === 13) {
        if (this.mobileVisible) this.mobileLogin()
        if (!this.mobileVisible) this.login()
      }
    }
  },
  computed: {
    greet() {
      const now = new Date()
      const hour = now.getHours()
      let greetingWord = {
        title: '',
        words: '',
      }

      if (hour < 6) {
        greetingWord = { title: '凌晨好~', words: '早起的鸟儿有虫吃~' }
      } else if (hour >= 6 && hour < 9) {
        greetingWord = { title: '早上好~', words: '来一杯咖啡开启美好的一天~' }
      } else if (hour >= 9 && hour < 12) {
        greetingWord = { title: '上午好~', words: '工作要加油哦~' }
      } else if (hour >= 12 && hour < 14) {
        greetingWord = { title: '中午好~', words: '午饭要吃饱~' }
      } else if (hour >= 14 && hour < 17) {
        greetingWord = { title: '下午好~', words: '下午也要活力满满哦~' }
      } else if (hour >= 17 && hour < 19) {
        greetingWord = { title: '傍晚好~', words: '下班没事记得锻炼身体哦~' }
      } else if (hour >= 19 && hour < 21) {
        greetingWord = { title: '晚上好~', words: '工作之余品一品书香吧~' }
      } else {
        greetingWord = { title: '深夜好~', words: '夜深了，注意休息哦~' }
      }

      return greetingWord
    },
  },
  methods: {
    setCookies() {
      for (const key in this.user) {
        if (this._.hasOwn(this.user, key)) {
          const value = this.user[key]
          console.log('key, value', key, value)
          if (value) {
            window.localStorage.setItem(key, value)
            this.$cookie.set(key, value, { expires: 5 })
          }
        }
      }
      this.$cookie.remove('CheckCode')
    },
    // 清除所有cookie函数
    clearAllCookie() {
      const keys = document.cookie.match(/[^ =;]+(?==)/g)
      if (keys) {
        for (let i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
      }
    },
    goIndex() {
      this.setCookies()
      window.sessionStorage.setItem('token', this.token)
      // 如果是弹窗打开，则不做跳转
      if (this.type === 'dialog') {
        this.$store.commit('SET_NEED_LOGIN', false)
        this.$emit('on-success', false)
        return false
      }

      console.log('this.to', this.to)

      if (this.to) {
        window.location.replace(`/${this.to}`)
      } else {
        try {
          const routerName = store.get('menu')[0].children[0].children[0].routerName
          this.$router.replace({ name: routerName })
        } catch (e) {
          this.$notice.error({
            content: '菜单错误，请刷新页面后重试！',
          })
        }
      }
    },
    goLogin() {
      this.$refs.mobileForm.resetFields()
      this.code = ''
      this.form.password = ''
      this.form.captcha = ''
      this.mobileForm.code = ''
      this.loginBtnText = '登录'
      this.getCaptcha()
      this.loading = false
      this.mobileVisible = false
    },
    returnToLoginPage() {
      window.sessionStorage.clear()
      this.$router.go({ name: 'login' })
    },
    getCaptcha() {
      this.cc = captcha(this.$refs.captcha)
      if (this.isDevMode) {
        this.form.captcha = this.cc
      }
    },
    setLoginBtnText() {
      this.loginBtnText = '重试'
    },
    login() {
      if (this.loading) return
      let canLogin = false
      this.loading = true
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          canLogin = true
          this.$notice.info({
            title: '验证通过',
            content: '正在登录，请稍后',
            closeTime: 1000,
          })
        } else {
          this.$notice.error({
            title: '提交失败',
            content: '请检查填写的数据',
          })
          this.loading = false
          this.setLoginBtnText()
        }
      })

      if (!canLogin) return
      const formdata = {
        logname: this.form.username,
        psd: this.form.password,
        verificationcode: this.form.captcha,
        ctaatoken: this.user.masterKey || '',
      }

      this.$cookie.set('CheckCode', this.form.captcha)

      this.r().post('login', formdata).then(response => {
        const results = response
        this.token = results.appkey
        this.user = results.menu.user

        this.setCookies()
        window.sessionStorage.setItem('token', this.token)

        const list = results.menu.sys
        list.forEach(block => {
          block.children.forEach(item => {
            item.expand = false
          })
        })
        store.set('menu', list)

        this.getDictionaries().then(res => {
          this.goIndex()
        })
      }).catch(error => {
        window.setTimeout(() => {
          this.loading = false
        }, 1000)
        if (error.errcode === 6) {
          this.mobileVisible = true
          this.mobileContent = error.err
          this.user.id = error.data
          this.$notice.warn({
            title: '提示',
            content: '请注意查收短信',
            closeTime: 5000,
          })
        }
        this.setLoginBtnText()
      })
    },
    mobileLogin() {
      if (this.mobileLoading) return
      let canLogin = false
      this.mobileLoading = true
      this.$refs.mobileForm.validate((valid) => {
        if (valid) {
          canLogin = true
          this.$notice.info({
            title: '验证通过',
            content: '正在登录，请稍后',
            closeTime: 1000,
          })
        } else {
          this.$notice.error({
            title: '提交失败',
            content: '请检查填写的数据',
          })
          this.mobileLoading = false
        }
      })

      if (!canLogin) return
      const formdata = {
        userid: this.user.id,
        verificationcode: this.mobileForm.code,
      }

      this.r().post('smsAccess', formdata).then(response => {
        const results = response
        // token作为url中的appKey
        this.token = results.token
        this.user = results.menu.user
        // accesstoken放入请求的Headers["Access-Token"]属性里
        this.user.masterKey = results.accesstoken

        this.setCookies()
        window.sessionStorage.setItem('token', this.token)

        const list = results.menu.sys
        list.forEach(block => {
          block.children.forEach(item => {
            item.expand = false
          })
        })
        store.set('menu', list)
        this.mobileLoading = false
        this.getDictionaries().then(res => {
          this.goIndex()
        })
      }).catch(() => {
        this.mobileLoading = false
      })
    },
  },
}
</script>

<style lang="stylus">
.ct-dialog-content .login-warp
  padding: 0
  box-shadow: none
.login-warp
  padding: 16px 16px
  background-color: #fff
  margin: 0 auto
  text-align: center
  // border-radius: 4px
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0, 0, 0, .2),0 1px 8px 0 rgba(0, 0, 0, .12)

  .login-section
    margin-bottom: 16px

  .login-captcha
    canvas
      position: absolute
      right: 2px
      top: 3px
      user-select: none
      cursor: pointer
    .ct-input > input
      padding-right: 96px
  .login-actions
    text-align: right
    .ct-button
      width: 100%
      padding: 10px 0
      font-size: 14px

  .login-header
    width: 100%;
    height: 96px;
    margin-left: auto
    margin-right: auto
    margin-bottom: 20px
    overflow hidden
    img
      width: 100%

  .ct-input > input,
  .login-input
    height: 36px
    width: 100%
    direction: ltr
    font-size: 14px
    border-radius: 4px

  .login-find
    padding-top: 10px
  
  .login-mobile
    font-size: 14px
    margin-bottom: 8px

</style>
