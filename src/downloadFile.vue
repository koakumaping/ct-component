<template v-slot="scope">
  <a class="text-main pointer" :href="getDownloadUrl(fileTemplate.filepatch)" download="download">{{fileTemplate.filename}}</a>
</template>

<script>
export default {
  name: 'getDownloadUrl',
  props: {
    fileTemplate: {
      type: Object,
      default: function d() {
        return {
          downLoadUrl: '',
        }
      },
    },
  },
  methods: {
    getDownloadUrl(filepatch) {
      const url = '/ctoa/plat/platupload?appkey='
      const appkey = window.sessionStorage.getItem('token')
      return `${url}${appkey}&filepatch=${window.encodeURI(filepatch, 'UTF-8')}`
    },
  },
}
</script>
