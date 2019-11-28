<template>
  <ct-button @click="$refs.tableColsConfig.show()" icon="table">
    <tableColsConfig ref="tableColsConfig" :cols="cols" :tableName="tableName"/>
  </ct-button>
</template>

<script>
import tableColsConfig from './tableColsConfig'

export default {
  name: 'tableConfig',
  components: {
    tableColsConfig,
  },
  props: {
    cols: {
      type: Array,
      default: function d() {
        return []
      },
    },
    tableName: {
      type: String,
      default: '',
    },
  },
}
</script>
