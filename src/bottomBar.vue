<template>
  <div class="ct-bottom-bar clear"
    :class="{'ct-bottom-bar__menu': side, 'ct-bottom-bar__no-menu' : !notBasicModular }"
  >
    <div class="left">
      <slot name="left" />
    </div>
    <div class="right">
      <ct-button-group>
        <slot />
        <ct-button @click="back" type="text" v-if="notBasicModular">返回</ct-button>
      </ct-button-group>
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'bottomBar',
  computed: {
    ...mapGetters([
      'side',
    ]),
    notBasicModular() {
      return this.$route.name.indexOf('Basic') === -1
    },
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="stylus">
.ct-bottom-bar
  position fixed
  width 100%
  bottom 0px
  right 0px
  height 48px
  line-height 45px
  box-shadow rgba(0, 0, 0, 0.03) 0px -1px 2px
  z-index 4
  background rgb(255, 255, 255)
  border-top 1px solid rgb(232, 232, 232)
  padding-left: 56px + 16px
  padding-right: 16px
  transition: all 0.3s
  &.ct-bottom-bar__menu
    padding-left: 200px + 16px
  &.ct-bottom-bar__no-menu
    padding-left: 16px
  & > .right > .ct-button-group
    vertical-align: middle
    display: inline-block
</style>
