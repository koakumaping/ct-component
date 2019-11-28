<template>
  <ct-table :data="data.data" ref="tableList" @selection-change="selectionChange" @sort-change="sortChange" :default-sort="this.data.defaultSort">
    <ct-table-column type="selection" :selectable="selectable"/>
    <ct-table-column
      v-for="fruit in data.cols"
      :key="fruit.key"
      :sortable="canSort"
      :label="fruit.label"
      :prop="fruit.prop"
      :minWidth="fruit.width ? fruit.width : fruit.minWidth"
      v-if="fruit.isshow"
      className="hidden"
    >
      <template v-slot="scope">
        {{ dynamic(fruit, scope) }}
      </template>
    </ct-table-column>
    <slot />
  </ct-table>
</template>

<script>
export default {
  name: 'dynamicTable',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          data: [],
          cols: [],
          formatter: () => {},
          defaultSort: {
            prop: '',
            order: '',
          },
        }
      },
    },
  },
  computed: {
    canSort() {
      return this.$route.name === 'managementAssetList'
    },
  },
  methods: {
    selectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    sortChange(payload) {
      this.$emit('sort-change', payload)
    },
    dynamic(fruit, scope) {
      if (fruit.dict) {
        return this.data.formatter(fruit.dict, scope.row[fruit.prop])
      } else if (fruit.formatter && this._.hasOwn(this._, fruit.formatter.name)) {
        return this._[fruit.formatter.name](scope.row[fruit.prop], ...fruit.formatter.args)
      } else if (fruit.formatter) {
        return this[fruit.formatter.name](scope.row[fruit.prop], ...fruit.formatter.args)
      }
      return this.$e(scope.row[fruit.prop])
    },
    selectable(row, index) {
      if (this._.hasOwn(row, '_check')) return row._check
      return true
    },
  },
}
</script>

<style>

</style>
