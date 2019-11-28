<template>
  <ct-button @click="chooseFileType" type="dashed" width="100%"
    :loading="loading"
    icon="upload"
  >{{text}}
    <ct-dialog title="请选择" ref="choose">
      <single-block v-model="filetype" :data="chooseList.length > 0 ? chooseList : dictionaries.FileType"/>
      <ct-button @click="startUpload">确定</ct-button>
    </ct-dialog>
  </ct-button>
</template>

<script>
import { dictMixins } from 'ct-mixin'

export default {
  name: 'upload',
  mixins: [dictMixins],
  props: {
    fileTemplate: {
      type: Object,
      default: function d() {
        return {
          attachment: {
            creater: '',
            createrid: '',
            createtime: '',
            filename: '',
            filepatch: '',
            filetype: '',
            id: '',
            parentid: '',
            candel: 1,
          },
        }
      },
    },
    text: {
      type: String,
      default: '上传文件',
    },
    accept: {
      type: String,
      default: '*',
    },
    type: {
      type: Number,
      default: 1,
    },
    choose: {
      type: Boolean,
      default: false,
    },
    // 上传路径
    apiName: {
      type: String,
      default: 'uploadFile',
    },
    // 附加条件
    options: {
      type: Object,
      default: function d() {
        return {}
      },
    },
    chooseList: {
      type: Array,
      default: () => [],
    },
    // 上传大小限制，单位MB
    limit: {
      type: [String, Number],
      default: 30,
    },
  },
  data() {
    return {
      parent: '',
      input: '',
      loading: false,
      filetype: 1,
    }
  },
  methods: {
    chooseFileType() {
      if (this.choose) {
        if (this.chooseList.length > 0) this.filetype = this.chooseList[0].value
        this.$refs.choose.show()
      } else {
        this.startUpload()
      }
    },
    startUpload() {
      if (this._.isEmpty(this.filetype)) {
        this.$notice.error({
          content: '请选择上传附件类型',
        })
        return false
      }
      this.$refs.choose.hide()
      this.parent = document.createElement('div')
      this.parent.setAttribute('id', 'file')
      this.input = document.createElement('input')
      this.input.setAttribute('type', 'file')
      this.input.setAttribute('multiple', 'multiple')
      this.input.setAttribute('accept', this.accept)
      this.parent.appendChild(this.input)

      this.input.addEventListener('change', this.upload)
      this.input.click()
    },
    upload(event) {
      const obj = event.srcElement ? event.srcElement : event.target

      const files = obj.files
      console.log(files)
      const formdata = new window.FormData()
      if (files) {
        if (files[0].size / 1024 / 1024 > this._.toNumber(this.limit)) {
          this.$notice.error({
            title: '提示',
            content: `只能上传 ${this.limit} MB以下的文件`,
          })
          return false
        }
      }

      this.loading = true

      this.$emit('start')

      if (files.length > 1) {
        for (const key in files) {
          console.log(files[key])
          formdata.append(`upload${key}`, files[key])
          if (this._.toNumber(key) === files.length - 1) break
        }
      } else {
        formdata.append('upload', files[0])
      }
      formdata.append('uptype', this.type)
      formdata.append('attachttype', this.filetype)

      for (const prop in this.options) {
        formdata.append(prop, this.options[prop])
      }

      this.r().post(this.apiName, formdata).then(response => {
        this.loading = false
        const process = (payload) => {
          const fileTemplate = {
            id: '',
            parentid: '',
            candel: 1,
          }

          Object.assign(fileTemplate, payload)
          fileTemplate.filepatch = fileTemplate.patch
          delete fileTemplate.patch

          this.$emit('success', fileTemplate)
        }

        if (this._.isObject(response)) process(response)
        if (this._.isArray(response)) {
          response.forEach(line => process(line))
        }
      }).catch(error => {
        this.parent = null
        this.input = null
        this.loading = false
        this.$emit('fail', error)
      })
    },
  },
}
</script>