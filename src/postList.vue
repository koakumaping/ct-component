<template>
  <div class="ct-remote-select"
    v-clickoutside="hideList"
    :style="{ width: `${width}px` }"
    :class="{ 'is-readonly': readonly }"
    ref="base"
  >
    <dl class="ct-remote-select__name" @click="showList" v-show="!visible">
      <span>{{ name }}</span>
    </dl>

    <input
      v-show="visible"
      v-model="searchName"
      placeholder="请输入搜索内容"
      type="text"
      ref="input"
    />

    <fa-font class="ct-remote-select__arrow" name="angle-down" />

    <ul ref="list" class="ct-remote-select__list" :style="listStyle" v-show="visible">
      <li v-if="data.length === 0 && searchName !== ''">{{ loading ? '查询中' : '暂无相关数据' }}</li>
      <li
        v-for="line in data"
        :key="line.Id"
        @click="handleClick(line)"
        :data-value="line.Id"
      >
        <flex>
          <flex-item>{{ line.Name }}</flex-item>
          <flex-item v-if="!single">{{ line.EmolumentNo }}</flex-item>
        </flex>
      </li>
      <li class="useless"
        v-for="item in maxItem - 1"
        :key="item"
        v-show="data.length > maxItem"
      >{{item}}</li>
    </ul>
  </div>
</template>

<script>
import { emitter } from 'ct-mixin'

export default {
  name: 'postType-select',
  mixins: [emitter],
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: [String, Number],
      default: '请选择',
    },
    // 最多显示多少行
    maxItem: {
      type: Number,
      default: 8,
    },
    width: {
      default: '',
    },
    value: {
      type: [String, Number, Object, Array],
    },
    single: {
      type: Boolean,
      default: false,
    },
    loading: Boolean,
    readonly: Boolean,
  },
  data() {
    return {
      visible: false,
      searchName: '',
      unwatch: null,
      ret: {
        visibility: 'hidden',
      },
      label: '',
      currentValue: '',
    }
  },
  computed: {
    name: {
      cached: false,
      get() {
        return this.label || this.placeholder
      },
    },
    listStyle() {
      const _ret = this.ret
      _ret.maxHeight = `${this.maxItem * 32}px`
      _ret.minWidth = this.width ? `${this.width}px` : this.$refs.base ? `${this.$refs.base.offsetWidth}px` : ''
      // 保证有一定的高度
      let length =
        this.data.length < this.maxItem ?
          this.data.length :
          this.maxItem
      if (length === 0 && this.searchName !== '') length = 1
      const height = length * 32

      _ret.height = `${height}px`
      _ret.zIndex = 10
      return _ret
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = val
        this.$emit('input', val)
      },
    },
    currentValue(val) {
      this.$emit('input', val)
      this.dispatch('ctFormLine', 'ct.form.change', this.currentValue)
    },
  },
  methods: {
    showList() {
      if (this.readonly) return false
      const base = this.$refs.base
      const _ret = this._.popover(base, this.$refs.list, {
        place: 'bottom-left',
      }, true)
      _ret.visibility = 'visible'
      _ret.position = 'absolute'
      let _top = this._.toNumber(_ret.top.replace('px', '')) + 4
      if (_top + 200 > this._.getWindowHeight()) _top = this._.getWindowHeight() - 200
      _ret.top = `${_top}px`
      _ret.zIndex = '7'
      this.appendModal()
      this.ret = _ret
      document.body.appendChild(this.$refs.list)

      this.visible = true
      this.unwatch = this.$watch('searchName', (val) => {
        this.$emit('change', val)
      })
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    hideList() {
      if (this.visible && this.unwatch) this.unwatch()
      this.data.length = 0
      this.removeModal()
      this.ret.visibility = 'hidden'
      this.visible = false
      this.unwatch = null
      this.searchName = ''
    },
    handleClick(payload) {
      payload = this._.clone(payload)
      this.currentValue = payload.Id
      // this.label = this._.isArray(payload.label) ? payload.label[0] : payload.label
      this.$emit('select', payload)
      this.hideList()
    },
    appendModal() {
      if (!this.modal) {
        this.modal = document.createElement('div')
        this.modal.setAttribute('id', this._.randomString(12, true))
        this.modal.setAttribute('class', 'v-modal')
        this.modal.addEventListener('click', this.hideList)
      }
      window.document.body.appendChild(this.modal)
    },
    removeModal() {
      try {
        document.body.removeChild(this.modal)
      } catch (error) {
        (() => {})()
      }
    },
  },
  beforeDestroy() {
    try {
      this.removeModal()
    } catch (error) {
      (() => {})()
    }
    try {
      window.document.body.removeChild(this.$refs.list)
    } catch (error) {
      (() => {})()
    }
  },
}
</script>

<style lang="stylus">
@import '~ct-hodor/src/assets/stylus/var.styl'
@import '~ct-hodor/src/assets/stylus/color.styl'

.ct-remote-select
  display: inline-block
  vertical-align: top
  font-size: 14px
  width: 100%
  position: relative
  &.is-readonly
    cursor: not-allowed
    .ct-remote-select__name
      cursor: not-allowed
      &:hover
        border-color: $border-color
        box-shadow: none
  .ct-remote-select__name
    padding: 0 24px 0 8px
    vertical-align: top
    display: inline-block
    width: 100%
    height: 32px
    line-height: 30px
    min-width: 50px
    border: 1px solid $border-color
    cursor pointer
    border-radius: 4px
    text-align: left
    background-color: #fff
    position: relative
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    &:hover,
    &.is-active
      border-color $color-main
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3)
  .ct-remote-select__arrow
    position: absolute
    top: -1px
    right: 8px
    transition all 0.3s
    display: block
    height: 32px
    line-height: 30px
    &:before
      font-size: 16px
      display: inline-block
      vertical-align: middle
      color: #ccc
  input
    font-size: $font-size
    color: #000
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
              SimSun, sans-serif
    font-family: "Segoe UI", Roboto,
              "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
              SimSun, sans-serif, "NSimSun", "SimSun"
    padding: 4px 8px
    background-color: #fff
    display: block
    height: 32px
    line-height: 1
    width: 100%
    border: 1px solid $border-color
    border-radius: 4px
    vertical-align: baseline
    -webkit-tap-highlight-color: rgba(0,0,0,0)
    &:hover,
    &:focus
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3)
      outline: none
      border: 1px solid $color-main

.ct-remote-select__list
  background-color: #fff
  border-radius: 4px
  position: fixed
  visibility: hidden
  top: 36px
  left: -9999px
  width: auto
  overflow: auto
  box-shadow: $box-shadow
  li
    background-color: #fff
    padding: 5px 8px 6px 8px
    line-height: 1.5
    cursor: pointer
    white-space: nowrap
    overflow: hidden
    transition: background .3s ease
    position: relative
    &.is-disabled
      background-color: $background-main
      &:hover
        cursor: not-allowed
        background-color: $background-main
    &.current
      color #fff
      background-color $color-main
      &:hover
        color #fff
        background-color $color-main
    &:hover
      color #000
      background-color: $color-hover
    &.useless
      color #fff
      user-select none
      cursor default
      &:hover
        cursor default
        color #fff
        background-color #fff

</style>
