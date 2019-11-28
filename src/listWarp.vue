<template>
  <div class="warp">
    <ct-card :label="label">
      <slot></slot>
    </ct-card>

    <ct-spin v-if="loading" :loading="loading" />
  </div>
</template>

<script>

export default {
  name: 'listWarp',
  props: {
    label: String,
  },
  data() {
    return {
      loading: false,
      timer: null,
    }
  },
  methods: {
    showSpin() {
      this.timer = window.setTimeout(() => {
        this.loading = true
      }, 200)
    },
    hideSpin() {
      if (this.timer) {
        window.clearTimeout(this.timer)
        this.timer = null
      }
      this.loading = false
    },
  },
}
</script>

<style lang="stylus" scoped>
.warp > .ct-card
  min-height 100%
  margin-bottom 0
</style>
