<template v-slot="scope">
  <a class="file-link text-main pointer" :href="link" :download="download" target="_blank">{{file.filename}}</a>
</template>

<script>
export default {
  name: 'fileLink',
  props: {
    file: {
      type: Object,
      default: function d() {
        return {
          filename: '',
          filepatch: '',
          paramStr: '',
        }
      },
    },
    download: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    link() {
      let url = ''
      const filepatch = this.file.filepatch
      const appkey = window.sessionStorage.getItem('token')
      let paramStr = ''
      if (!this._.isEmpty(this.file.paramStr)) paramStr = `&${this.file.paramStr}`
      if (filepatch.indexOf('http://') === 0 || filepatch.indexOf('https://') === 0) {
        url = filepatch
      } else {
        url = `/ctoa/plat/file/${window.encodeURI(window.encodeURI(filepatch, 'UTF-8'), 'UTF-8')}?appkey=${appkey}${paramStr}`
      }
      return url
    },
  },
}
</script>

<style lang="stylus">
a.file-link:visited
  color: #666
</style>
