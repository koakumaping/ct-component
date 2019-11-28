<template>
  <div class="topbar clear" :class="{ 'topbar-expand': visible }">
    <!--<div class="topbar-menu left">
      <icon-font name="category"></icon-font>
    </div>-->
    <div class="topbar-left clear">
      <a class="topbar-tab"
        v-for="(item, index) in list"
        :key="item.id"
        v-on:click="changePlatform(item, _.toNumber(item.platform))"
        :class="{ 'active': sys === _.toNumber(item.platform) }"
      >
        {{ item.name }}
      </a>
      <!-- <section class="left relative" v-clickoutside="hidePlatformList">
        <div style="display: inline-block;" class="top-bar-platform clear" @click="showPlatformList">
          <span class="top-bar__platform-name pointer">{{name}}&ensp;</span>
          <fa-font name="caret-down"></fa-font>
          <div class="topbar-dropdown" v-show="visiblePlatformList">
            <ul class="topbar-dropdown-list">
              <li
                v-for="item in list"
                :key="item.id"
                v-on:click="changePlatform(item.name)"
                :class="{ 'active': name === item.name }"
              >
                {{item.name}}
              </li>
            </ul>
          </div>
        </div> -->
      <!-- </section> -->
    </div>
    <div class="topbar-right clear">
      <section class="topbar-block">
        <span>{{ user.name }}</span>
        <div class="topbar-dropdown">
          <div class="topbar-user-list clear">
            <a href="/#/dashboard">
              <icon-font name="data"></icon-font>
              <span>我的主页</span>
            </a>
            <a :href="`/pm/#/peopleManage/personelFiles/modular?id=${user.id}`">
              <icon-font name="account"></icon-font>
              <span>个人信息</span>
            </a>
            <a href="/#/password">
              <icon-font name="edit"></icon-font>
              <span>修改密码</span>
            </a>
          </div>
          <div class="topbar-dropdown-action border-top" style="width: 270px;">
            <a @click="logout">退出平台</a>
          </div>
        </div>
      </section>

      <section class="topbar-block">
        <icon-font name="remind1" :class="{ 'has-message': messageListCount }"></icon-font>
        <span class="topbar-message-count" v-if="messageListCount">{{ messageListCount }}</span>

        <div class="topbar-dropdown">
          <div class="topbar-message">
            <div class="topbar-message-head clear">
              <span>站内消息</span>
              <a href="/#/remind/modular" class="right">消息接收管理</a>
            </div>
            <div class="topbar-message-list text-center" style="padding: 20px" v-if="messageListCount === 0">
              暂无未读消息
            </div>
            <ul class="topbar-message-list" v-else>
              <li
                v-for="item in messageList"
                :key="item.id"
                :data-id="item.id"
              >
                <a @click="changeDialog('message',
                    {
                      id: item.id,
                      title: item.title,
                      content: item.content,
                      status: item.status,
                    })"
                >
                  <div class="text-main hidden" :title="item.title || item.content">{{ item.title || item.content }}</div>
                  <div>{{ item.createtime}}</div>
                </a>
              </li>
            </ul>
            <div class="topbar-dropdown-action">
              <a href="/#/message">查看更多</a>
            </div>
          </div>
        </div>
      </section>

      <!-- <section class="topbar-block">
        <router-link :to="{name: '404'}">
          <icon-font name="help"></icon-font>
        </router-link>
        <div class="topbar-dropdown">
          <ul class="topbar-dropdown-list">
            <li class="pointer">
              <a href="http://192.168.44.44:9100/#/zh-cn/" target="_blank">帮助文档</a>
            </li>
            <li class="pointer" @click="changeDialog('suggest')">提交建议</li>
            <li class="pointer">
              <a href="http://forum.ct108.com/" target="_blank">FAQ</a>
            </li>
          </ul>
        </div>
      </section> -->

      <!-- <section class="topbar-block">
        <span class="pointer">{{name}}</span>
        <div class="topbar-dropdown">
          <ul class="topbar-dropdown-list">
            <li class="pointer"
              v-for="item in list"
              :key="item.id"
              @click="changePlatform(item.name)"
              :class="{ 'active': name === item.name }"
            >
              {{item.name}}
            </li>
          </ul>
        </div>
      </section> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { userMixins } from 'ct-mixin'

export default {
  name: 'topbar',
  mixins: [userMixins],
  props: {
    list: {
      type: Array,
      default: function d() {
        return []
      },
    },
    sys: Number,
    visible: Boolean,
  },
  computed: {
    currentRouter() {
      return this.$route.meta
    },
    isAgent() {
      return this.$cookie.get('agent')
    },
    messageListCount() {
      return this.messageList.length
    },
  },
  data() {
    return {
      visiblePlatformList: false,
      messageList: [],
    }
  },
  mounted() {
    const params = {
      status: 0,
      currentpage: 1,
      pagesize: 9999,
    }
    this.r().get('messageList', { params }).then(response => {
      this.messageList = response.rows
      this.message()
      if (this.list.length === 0) this.logout()
    })
  },
  methods: {
    ...mapActions(['setCountList']),
    logout() {
      window.sessionStorage.clear()
      // 主动退出登录，不做页面还原
      const a = document.createElement('a')
      a.setAttribute('href', '/#/login')
      a.click()
    },
    changePlatform(item, index) {
      this.hidePlatformList()
      let href = item.href
      switch (index) {
        case 0:
          href = '/'
          break
        case 1:
          href = '/pm/#/todo'
          break
        case 2:
          href = '/finance/#/todo'
          break
        case 3:
          href = '/recruit/#/todo'
          break
        case 4:
          href = '/evaluate/#/todo'
          break
        case 5:
          href = '/crm/#/todo'
          break
        case 6:
          href = '/management/#/todo'
          break
        case 9:
          href = '/deal/#/todo'
          break
        default:
          break
      }

      if (href) {
        const a = document.createElement('a')
        a.setAttribute('href', href)
        if (item.target) a.setAttribute('target', item.target)
        a.click()
      }
    },
    changePage(routerName) {
      this.$emit('change-page', routerName)
    },
    changeDialog(dialogName, conf = {}) {
      if (dialogName === 'message' && !conf.status) this.setMessageRead(conf.id)
      this.$emit('change-dialog', dialogName, conf)
    },
    setMessageRead(id) {
      const formdata = {
        id,
      }

      this.r().post('messageList', formdata).then(response => {
        let no = ''
        this.messageList.forEach((item, index) => {
          if (item.id === id) no = index
        })

        if (no !== '') this.messageList.splice(no, 1)
      })
    },
    showPlatformList() {
      this.visiblePlatformList = true
    },
    hidePlatformList() {
      if (!this.visiblePlatformList) return false
      this.$nextTick(() => {
        this.visiblePlatformList = false
      })
    },
    message() {
      const Notification = window.Notification
      // 建立websocket
      const wss = `ws://${window.location.host}/ws`
      let ws = ''

      const connectWebsocket = () => {
        ws = new window.WebSocket(wss)
        ws.onopen = () => {
          console.log('websocket connect:', wss)
          ws.send(window.sessionStorage.getItem('token'))
        }

        ws.onmessage = (response) => {
          console.log('websocket get message from server:', response.data)
          let results = response.data
          results = JSON.parse(results)
          if (results.type === 'message') {
            this.messageList = [...this.messageList, ...results.data]
            const length = results.data.length
            if (length === 0) return false
            // 发送消息
            let n = null

            if (window.Notification && Notification.permission === 'granted') {
              n = new Notification('OA消息', { body: `你有${length}条新消息` })
            } else if (window.Notification && Notification.permission !== 'denied') {
              // 如果用户没有选择是否显示通知
              // 注：因为在 Chrome 中我们无法确定 permission 属性是否有值，因此
              // 检查该属性的值是否是 "default" 是不安全的。
              Notification.requestPermission(status => {
                if (Notification.permission !== status) {
                  Notification.permission = status
                }

                // 如果用户同意了
                if (status === 'granted') {
                  n = new Notification('OA消息', { body: `你有${length}条新消息` })
                } else {
                  // 否则，我们可以让步的使用常规模态的 alert
                  this.$notice.success({
                    content: `你有${length}条新消息`,
                    closeTime: 12 * 1000,
                  })
                }
              })
            } else {
              // 如果用户拒绝接受通知
              // 我们可以让步的使用常规模态的 alert
              this.$notice.success({
                content: `你有${length}条新消息`,
                closeTime: 12 * 1000,
              })
            }

            console.log(n)
          }
          if (results.type === 'msgcnt') {
            this.setCountList(results.data)
          }
        }

        ws.onclose = () => {
          console.log('ws close')
          ws = ''
        }
      }

      connectWebsocket()
    },
  },
}
</script>

<style lang="stylus">
@import '~ct-hodor/src/assets/stylus/var.styl'
@import '~ct-hodor/src/assets/stylus/color.styl'
$color-blue = #fff

.topbar
  // padding-left: 50px + 16
  vertical-align: baseline
  height: 48px
  line-height: 48px
  width: 100%
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 6
  background-color: $color-blue
  transition: all 0.3s
  min-width: $min-width
  box-shadow: 6px 4px 9px rgba(0,21,41,0.08)
  &.topbar-expand
    // padding-left: 200px + 16
    .topbar-menu
      i.iconfont::before
        display inline-block
        transform rotateZ(180deg)
  & > div
    height: inherit
    line-height: inherit

  .topbar-menu
    padding: 0 16px
    margin-right -1px
    cursor: pointer
    transition: all 0.3s
    font-size 0
    i.iconfont::before
      display inline-block
      font-size 24px
      color $color-main
      transition all 0.3s
    &:hover
      fill: $color-blue
      svg.icon
        fill: $color-blue

  .topbar-left
    float: left
    font-size: 14px
    position relative
    .top-bar-platform
      padding: 0 4px 0 8px
    .topbar-block
      float: left
      .topbar-dropdown
        right: auto
        left: 0
    .topbar-tab
      line-height: 47px
      float: left
      margin: 0 16px
      padding: 1px 16px 0 16px
      color: $color-main
      color: rgba(0, 0, 0, 0.7)
      border-bottom: 2px solid transparent
      text-rendering: optimizeLegibility
      cursor: pointer
      transition: color 0.3s linear
      position: relative
      &.active,
      &:hover
        color: $color-main
      &.active:after
        content: ''
        position: absolute
        left: 50%
        top: 43px
        margin-left: -6px
        height: 0
        width: 0
        border-bottom: 6px solid $color-main
        border-left: 6px solid transparent
        border-right: 6px solid transparent
    .topbar-dropdown
      position: absolute
      left: 0
      top: 49px
      z-index: 1
      padding-top: 1px
      line-height: 1.5
      color: #333
      font-size 12px
      text-align left
      box-shadow: $box-shadow
      transition opacity 0.15s, visibility 0s
      cursor: default
      .topbar-dropdown-list
        background-color #fff
        padding 8px 0
        min-width 122px
        li
          height 40px
          line-height 40px
          padding 0 16px
          transition background-color 0.3s
          &.active,
          &:hover
            color $color-main
            background-color #f5f5f5
            cursor pointer
          a
            height 100%
            width 100%
            display block
            text-rendering optimizeLegibility
  .topbar-right
    float: right
    color: $color-main
    font-size: 14px
  .topbar-block
    height: inherit
    line-height: inherit
    letter-spacing: 1px
    padding: 0 16px
    text-align: center
    float: right
    margin-right: -1px
    // border-right: 1px solid $border-color
    transition: background-color 0.3s
    cursor pointer
    position: relative
    &:hover
      color #fff
      background-color $color-main
      .topbar-message-count
        color $color-main
        background-color $color-blue
      .topbar-dropdown
        visibility: visible
        opacity: 1
    .icon-remind1.has-message::before
      display inline-block
      animation ring 0.3s infinite
    .topbar-message-count
      padding 2px 5px
      border-radius 4px
      background-color $color-main
      color $color-blue
      margin-left 4px
    .topbar-dropdown
      position: absolute
      right: 0
      top: 49px
      z-index: 1
      padding-top: 1px
      visibility: hidden
      opacity: 0
      line-height: 1.5
      color: #333
      font-size 12px
      text-align left
      box-shadow: $box-shadow
      transition opacity 0.15s, visibility 0s
      cursor: default
      .topbar-dropdown-action
        height 50px
        line-height 50px
        background-color #fff
        text-align center
        border-color #e5e7ea
        &:hover
          color $color-main
          background-color #f5f5f5
        a
          display block
          height 100%
      .topbar-user-list
        padding: 16px 15px
        width: 270px
        background-color: #fff

        & > a
          display: block
          width: 80px
          height: 80px
          float: left
          text-align center
          cursor: pointer
          &:hover
            color $color-main
            background-color: #f5f5f5
            i.iconfont:before
              color $color-main
          i.iconfont
            font-size 20px
            width 40px
            height 40px
            line-height 40px
            display block
            margin 8px auto 4px
            &:before
              color: #000
          span
            text-rendering optimizeLegibility
      .topbar-message
        width 300px
        .topbar-message-head
          text-align left
          height 50px
          line-height 50px
          background-color #fff
          padding 0 16px
          .right
            color $color-main
        .topbar-message-list
          background-color #fff
          max-height: 300px
          overflow: auto
          li
            height 60px
            transition background-color 0.3s
            &:hover
              background-color #f5f5f5
            a
              display block
              height 100%
              padding 10px
      .topbar-dropdown-list
        background-color #fff
        padding 8px 0
        min-width 140px
        li
          height 40px
          line-height 40px
          padding 0 10px
          transition background-color 0.3s
          &:hover
            color $color-main
            background-color #f5f5f5
          a
            height 100%
            width 100%
            display block
            text-rendering optimizeLegibility

.topbar-overlay
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  background-color: transparent
  z-index: 11

@keyframes ring
  0%
    transform rotateZ(8deg)
  100%
    transform rotateZ(-8deg)
</style>