<template>
  <div class="warp" :class="{ 'is-basic': isBasic }">
    <flow-tips v-if="flowVisible"/>
    <errorPage v-else-if="errorVisible" :error="errorInfo" />
    <span v-else>
      <slot v-if="!loading" />
      <warp-loading v-else />
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import flowTips from './flow/tips'
import errorPage from './error/500'
import warpLoading from './warpLoading'

export default {
  name: 'modularWarp',
  data() {
    return {
      // 默认必须为true。否则form获取权限会报错
      loading: true,
      errorVisible: false,
      errorInfo: '',
    }
  },
  computed: {
    ...mapGetters([
      'flowVisible',
    ]),
    isBasic() {
      return this.$route.meta.basic
    },
  },
  methods: {
    showSpin() {
      this.loading = true
    },
    hideSpin() {
      this.loading = false
    },
    showError(payload) {
      this.errorInfo = payload
      this.errorVisible = true
      this.hideSpin()
    },
  },
  components: {
    warpLoading,
    flowTips,
    errorPage,
  },
}
</script>

<style lang="sass">
.warp.is-basic
  padding-bottom: 60px
</style>