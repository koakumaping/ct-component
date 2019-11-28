<template>
  <ctPoptip width="110" v-model="visible" :place="place" trigger="click">
    <ct-button type="primary" v-if="btn">{{text}}</ct-button>
    <span class="text-main pointer" v-else>{{text}}</span>

    <div class="ct-delete-tip" slot="content">
      <div style="font-size: 14px; padding-bottom: 6px;">
        <span>确定{{text}}？</span>
      </div>
      <ct-button-group>
        <ct-button size="small" type="primary" @click="handleConfirm">确定</ct-button>
        <ct-button size="small" type="text" @click="handleCancel">取消</ct-button>
      </ct-button-group>
    </div>
  </ctPoptip>
</template>

<script>
export default {
  name: 'deleteTip',
  props: {
    btn: Boolean,
    place: {
      type: String,
      default: 'top-right',
    },
    text: {
      type: String,
      default: '删除',
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    handleConfirm(event) {
      this.$emit('on-confirm', event)
      this.visible = false
    },
    handleCancel(event) {
      this.$emit('on-cancel', event)
      this.visible = false
    },
  },
}
</script>

