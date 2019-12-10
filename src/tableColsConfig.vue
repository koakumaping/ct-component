<template>
  <ct-dialog ref="tableColsConfig" title="自定义列表项" width="800" @on-close="saveColsToServer">
    <ct-table :data="cols" width="320" max-height="500">
      <ct-table-column label="显示" width="80">
        <template v-slot="scope">
          <ctCheckbox :readonly="!scope.row.canhide" v-model="scope.row.isshow"/>
        </template>
      </ct-table-column>
      <ct-table-column label="列名" prop="label"></ct-table-column>
      <ct-table-column label="排序" width="120">
        <template v-slot="scope">
          <div class="pointer" @click="up(scope.$index)" style="line-height: 14px;">
            <fa-font name="caret-up"></fa-font>
          </div>
          <div class="pointer" @click="down(scope.$index)" style="line-height: 14px;">
            <fa-font name="caret-down"></fa-font>
          </div>
        </template>
      </ct-table-column>
      <ct-table-column label="固定">
        <template v-slot="scope">
          <single-block :data="fixedList" v-model="scope.row.fixed"/>
        </template>
      </ct-table-column>
    </ct-table>
  </ct-dialog>
</template>

<script>
import store from 'store'

export default {
  name: 'tableColsConfig',
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
  data() {
    return {
      fixedList: [
        {
          key: 'cxerfjhksd89y',
          label: '默认',
          value: '',
        },
        {
          key: 'zjkrfj908fdsj',
          label: '左侧',
          value: 'left',
        },
        {
          key: 'cklv908903jkl',
          label: '右侧',
          value: 'right',
        },
      ],
    }
  },
  methods: {
    show() {
      this.$refs.tableColsConfig.show()
    },
    saveColsToServer(reset = false) {
      if (this.cols.length === 0) {
        this.$notice.error({
          title: '错误',
          content: '数据异常',
        })
        return false
      }

      const cols = this.cols.map((item) => {
        for (const key in item) {
          if (this._.isBoolean(item[key])) {
            item[key] = !reset ? this._.toNumber(item[key]) : 1
          }
        }
        return item
      })

      const formdata = {
        cols: cols,
        name: this.tableName,
      }

      this.r().post('saveTableCols', formdata).then(response => {
        this.saveCols()
        this.sortCols()
      })
      window.setTimeout(() => {
        const query = this._.clone(this.$route.query)
        query.t = +new Date()
        this.$router.replace({ name: this.$route.name, query })
      }, 80)
    },
    saveCols() {
      store.set(`${this.$route.name}Cols`, this.cols)
    },
    sortCols() {
      this.cols.sort((a, b) => this._.toNumber(a.sort) - this._.toNumber(b.sort))
      // 保证有一定的顺序, 主动排序一次
      this.cols.forEach((element, index) => {
        element.sort = index
        element.minWidth = 120
      })
    },
    up(index) {
      console.log(this.cols[index])
      if (index === 0) return false
      const item = this.cols[index]
      const itemUp = this.cols[index - 1]
      item.sort --
      itemUp.sort ++
      this.sortCols()
    },
    down(index) {
      console.log(this.cols[index])
      if (index === this.cols.length) return false
      const item = this.cols[index]
      const itemDown = this.cols[index + 1]
      item.sort ++
      itemDown.sort --
      this.sortCols()
    },
  },
}
</script>
