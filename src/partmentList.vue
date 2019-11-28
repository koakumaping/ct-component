<template>
  <div>
    <div class="text-center" v-show="loading">加载中</div>
    <tree
      no-children
      :data="list"
      :singleSelection="singleSelection"
      @change="listChange"
      @on-list-change="setList"
      style="height: 400px; overflow: auto;"
    />
    <ct-button-group style="margin-top: 8px;">
      <ct-button @click="save()" type="primary">确定</ct-button>
      <ct-button @click="clear()">清空</ct-button>
    </ct-button-group>
  </div>
</template>

<script>
import { hasOwn, clone } from 'ct-util'

let _list = []

const walkList = (list = []) => {
  for (let i = 0, l = list.length; i < l; ++i) {
    const item = list[i]
    if (item.checked) _list.push(item.id)
    if (hasOwn(item, 'children') && item.children.length > 0) {
      walkList(item.children)
    }
  }
}

const handleCheckedList = (list = [], idList = []) => {
  for (let i = 0, l = list.length; i < l; ++i) {
    const item = list[i]
    item.id = Number(item.id)
    item.checked = false
    if (idList.indexOf(item.id) > -1) item.checked = true
    if (hasOwn(item, 'children') && item.children.length > 0) {
      handleCheckedList(item.children, idList)
    }
  }
}

export default {
  name: 'partmentList',
  props: {
    idList: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: function d() {
        return {
          authority: 1,
          loaduser: 0,
          sys: 4,
        }
      },
    },
    singleSelection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      list: [],
      selectList: [],
      selectNoChildList: [],
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    selectIdList() {
      _list = []
      walkList(this.list)
      return _list
    },
  },
  methods: {
    getList() {
      this.loading = true
      const params = clone(this.config)

      this.r().get('partmentList', { params }).then(response => {
        handleCheckedList(response, this.idList)
        this.list = response
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    setList(payload) {
      console.log('setList', payload)
      this.selectList = payload
    },
    listChange(payload) {
      console.log('nodeCheck', payload)
      this.selectNoChildList = payload
    },
    save() {
      this.$emit('on-save', {
        selectList: clone(this.selectList),
        selectIdList: clone(this.selectIdList),
        selectNoChildList: clone(this.selectNoChildList),
        list: clone(this.list),
      })
    },
    clear() {
      handleCheckedList(this.list, [])
    },
  },
}
</script>
