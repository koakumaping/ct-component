<template>
  <div class="server-error">
    <div class="server-error-warp">
      <div class="title">Oops!</div>
      <div class="text">服务器出错啦</div>
      <div class="error-info" v-if="error">
        <pre
          class="pre"
          v-html="syntaxHighlight(convert(error))"
          v-if="_.isObject(error)"
        />
        <span v-else>{{ error }}</span>
      </div>
      <div class="tip">请点击以下按钮或者发送错误报告</div>
      <ct-button-group>
        <ct-button routerName="index" type="primary">回首页</ct-button>
        <ct-button @click="$router.go(-1)">上一页</ct-button>
      </ct-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'err500',
  props: {
    error: [String, Object],
  },
  data() {
    return {
      jsonView: '',
    }
  },
  methods: {
    getJSONView(payload) {
      this.jsonView = payload
    },
    convert(payload) {
      return JSON.stringify(JSON.parse(JSON.stringify(payload)), null, 4)
    },
    /* eslint-disable */
    syntaxHighlight(json) {
      if (!json) return
      if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 4)
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, (match) => {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    },
    /* eslint-enable */
  },
}
</script>

<style lang="stylus">
.server-error
  height: 100%
  background-color: #fff
  position: relative
  .server-error-warp
    width: 800px
    height: 500px
    margin: 0 auto
    background-image: url(../../assets/500.png)
    background-position: top right
    background-repeat: no-repeat
    background-size: 438px
    position: absolute
    left: 50%
    top: 50%
    margin-left: -400px
    margin-top: -250px
    .title
      font-size: 64px
      padding-bttom: 48px
    .text
      font-size: 24px
    .tip
      font-size: 16px
      padding: 24px 0
  
  .error-info
    width: 300px

  .pre
    padding: 6px
    min-width: 100%
    max-width: 100%
    max-height: 500px
    overflow: auto
    color: #666
    font-size: 14px
    font-family: Inconsolata-Regular, Helvetica, Hiragino Sans GB, Arial, Microsoft YaHei, sans-serif
    .key
      color: #eb6161
    .string
      color: #397c79
    .number
      color: tomato
    .boolean
      color: lightseagreen
    .null
      color: lightskyblue
</style>