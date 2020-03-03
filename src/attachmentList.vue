<template>
  <div class="ct-attachment-list">
    <ct-table :data="data.list" no-empty-pic max-height="500">
      <ct-table-column label="文件名称" prop="filename">
        <template v-slot="scope">
          <fileLink :file="scope.row" :download="download" />
        </template>
      </ct-table-column>
      <ct-table-column label="类型" prop="filetype" :formatter="typeFormatter" width="160"/>
      <ct-table-column label="上传人" prop="creater" width="160"/>
      <ct-table-column label="操作" v-if="data.candel || data.noId" width="160">
        <template v-slot="scope">
          <delete-tip
            v-if="scope.row.candel"
            @on-confirm="deleteFile(scope.row.filepatch, scope.row.id, scope.$index)"
          />
          <span v-else>不可删除</span>
        </template>
      </ct-table-column>
    </ct-table>
    <upload
      @success="uploadList"
      :fileTemplate="data.template"
      style="margin-top: 8px"
      :accept="accept"
      :choose="choose"
      :type="type"
      :chooseList="chooseList"
      v-if="data.edit || data.noId"
    />
  </div>
</template>

<script>
import { dictMixins } from 'ct-mixin'
import upload from './upload'

export default {
  name: 'attachmentList',
  components: {
    upload,
  },
  mixins: [dictMixins],
  props: {
    data: {
      type: Object,
      default: function d() {
        return {
          list: [],
          template: {},
          candel: false,
          readonly: false,
          edit: false,
          noId: this.noId,
        }
      },
    },
    download: {
      type: Boolean,
      default: false, // 辉哥要改成默认不下载
    },
    accept: {
      type: String,
      default: '*',
    },
    choose: {
      type: Boolean,
      default: false,
    },
    chooseList: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      default: 1,
    },
    // 附件数量限制
    max: {
      type: Number,
      default: 99,
    },
    // max-tips
    maxTips: {
      type: String,
      default: '已达最大附件数量，请尝试打包后上传。',
    },
  },
  methods: {
    // 上传文件成功后调用
    uploadList(payload) {
      if (this.data.list.length >= this.max) {
        this.$notice.warn({
          content: this.maxTips,
        })
        return false
      }
      this.data.list.push(payload)
    },
    // 删除已经上传了的文件
    deleteFile(filepatch, id, index) {
      if (id === '') {
        this.data.list.splice(index, 1)
        return true
      }
      const params = {
        uptype: '1',
        filepatch: encodeURI(filepatch, 'UTF-8'),
        id: id,
      }

      this.r().delete('uploadFile', { params }).then(response => {
        this.data.list.splice(index, 1)
      })
    },
    typeFormatter(row, column, cellValue) {
      return this.formatter('FileType', this._.toNumber(cellValue))
    },
  },
}
</script>
