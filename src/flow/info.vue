<template>
  <span>
    <ct-card label="流程相关"
      v-if="flowinfo.viewvisible"
    >
      <ct-row v-if="isMulti">
        <ct-col
          v-for="view in flowinfo.view"
          :key="view.label"
          :label="view.label"
        >
          <ct-form labelWidth="6em" labelPosition="left">
            <ct-form-line :label="view.label">
              <ct-checkbox v-model="view.ischeck"></ct-checkbox>
            </ct-form-line>
            <ct-form-line :label="view.name">
              <ct-checkbox type="radio"
                v-for="item in view.btnList"
                :key="item.label"
                :content="item.value"
                v-model="view.value"
                style="margin-right: 8px;"
              >{{ item.label }}</ct-checkbox>
            </ct-form-line>
            <ct-form-line :key="view.name">
              <ct-input v-model="view.content" type="textarea" :readonly="view.readonly" :placeholder="view.warning"/>
            </ct-form-line>
          </ct-form>
        </ct-col>
      </ct-row>
      <span v-else>
        <ct-form
          v-for="view in flowinfo.view"
          :key="view.name"
          :label="view.label"
          labelPosition="left"
        >
          <ct-form-line :label="view.name">
            <ct-checkbox type="radio"
              v-for="item in view.btnList"
              :key="item.label"
              :content="item.value"
              v-model="view.value"
              style="margin-right: 8px;"
            >{{ item.label }}</ct-checkbox>
          </ct-form-line>
          <ct-form-line :key="view.name">
            <ct-input v-model="view.content" type="textarea" :readonly="view.readonly" :placeholder="view.warning"/>
          </ct-form-line>
        </ct-form>
      </span>
    </ct-card>
  </span>
</template>

<script>
export default {
  name: 'flowInfo',
  props: {
    flowinfo: {
      type: Object,
      default: function d() {
        return {
          historystructure: {},
          view: {},
          sateguid: '',
        }
      },
    },
  },
  computed: {
    isMulti() {
      return Object.keys(this.flowinfo.historystructure).length > 1
    },
    labelList() {
      const list = this.flowinfo.view
      const labelList = []
      for (const key in list) {
        const item = list[key]
        labelList.push({
          label: item.label,
          value: item.key,
        })
      }
      return labelList
    },
  },
  data() {
    return {
      currentKey: '',
    }
  },
  mounted() {
    if (this.currentKey === '' && this.labelList.length) this.currentKey = this.labelList[0].value
  },
}
</script>
