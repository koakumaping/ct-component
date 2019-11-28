<template>
  <ct-card label="流程处理" style="height: 100%;margin: 0;">
    <div class="flow-tips text-center">
      <div class="flow-tips-html">
        <img src="./tips.png" alt="tips" v-if="flow.tree.length === 0">
        <p v-html="flow.response.err" v-if="flow.response.err"/>
        <p v-html="flow.response.info" v-if="flow.response.info"/>
        <p v-html="flow.response.treedata.tip" v-if="flow.response.treedata && flow.response.treedata.tip" />
        <span v-if="flow.tree.length > 0">
          <div class="clear text-center" style="padding-top: 80px;">
            <div v-for="parent in flow.tree" :key="parent.id" class="flow-parent">
              <p class="flow-parent-title" v-if="parent.children">{{ parent.name }}</p>
              <div v-else class="flow-child-title">
                <span @click="handleClick(parent)">
                  <ct-switch v-model="parent.checked" />
                </span>
                <p>{{ parent.name }}</p>
              </div>
              <div class="flow-child" :class="{ 'has-children': parent.children && parent.children.length > 0 }">
                <div class="flow-child-title"
                  v-for="child in parent.children"
                  :key="child.id"
                >
                  <span @click="handleClick(child, parent.id)">
                    <ct-switch v-model="child.checked"/>
                  </span>
                  <p>{{ child.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </span>
        <div class="flow-tips-btns">
          <ct-button size="large" type="primary" @click="doFlow()" width="200px" :loading="loading">确定</ct-button>
          <white-space size="lg"/>
          <ct-button size="large" @click="cancelFlow()" width="200px" :loading="loading" v-if="flow.response.errcode === '0'">取消</ct-button>
        </div>
      </div>
    </div>
  </ct-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'FlowTips',
  computed: {
    ...mapGetters([
      'flow',
      'flowVisible',
    ]),
  },
  data() {
    return {
      loading: false,
      clickId: '',
      parentId: '',
    }
  },
  methods: {
    ...mapActions(['hideFlow']),
    setCurrentFlowTree(payload) {
      this.flowTreeList = payload
    },
    doFlow() {
      this.loading = true
      if (this.flow.response.errcode === '1') {
        this.cancelFlow()
        return false
      }
      let formdata = {}
      const hasTree = this.flow.tree.length !== 0
      if (hasTree) {
        const personList = []
        const notifyList = []
        // 节点选择
        const nodeList = []

        const walkFlowList = (list = this.flow.tree) => {
          for (let i = 0, l = list.length; i < l; ++i) {
            const child = list[i]
            if (this._.isEmptyObject(child)) return false
            console.log(child)
            if (child.attr.datatype && child.attr.datatype === '5' && child.checked) {
              child.attr.name = child.attr.username
              personList.push(child.attr)
            } else if (child.attr.datatype && child.attr.datatype === '6' && child.checked) {
              child.attr.name = child.attr.username
              notifyList.push(child.attr)
            } else if (child.attr.datatype && child.attr.datatype === '1' && child.checked) {
              child.attr.stateid = child.attr.id
              nodeList.push(child.attr)
            }

            if (this._.hasOwn(child, 'children') && child.children.length > 0) {
              walkFlowList(child.children)
            }
          }
        }

        walkFlowList()

        const length = personList.length + notifyList.length + nodeList.length

        if (length === 0) {
          console.log(personList, notifyList, nodeList)
          this.$notice.error({
            content: '请选择!',
          })
          this.loading = false
          return false
        }

        // 只能有一个被选中
        if (this.flow.singleSelection === 1 && length > 1) {
          this.$notice.error({
            content: '只能选择一个',
          })
          this.loading = false
          return false
        }

        // 每个节点都需要有选中的数据
        if (this.flow.singleSelection === 2) {
          let count = 0
          const all = [...personList, ...notifyList, ...nodeList]
          const checkedIdList = all.map(line => line.id)
          const tree = this.flow.tree
          tree.forEach(parent => {
            if (!this._.hasOwn(parent, 'children')) return false
            const list = parent.children
            for (let i = 0, l = list.length; i < l; ++i) {
              const child = list[i]
              console.log(child)
              if (checkedIdList.indexOf(child.id) > -1) {
                count += 1
                break
              }
            }
          })

          if (count < tree.length) {
            this.$notice.error({
              content: '没有选择完整',
            })
            this.loading = false
            return false
          }
        }

        formdata = {
          acttype: this.flow.tree[0].attr.datatype === '1' ? 2 : 1,
          needselectoperater: this.flow.tree[0].attr.needselectoperater,
          needselectnotify: this.flow.tree[0].attr.needselectnotify,
          flag: 1,
          operater: {
            single: this.flow.tree[0].attr.operatersingle,
            data: personList,
          },
          notify: {
            single: this.flow.tree[0].attr.notifysingle,
            data: notifyList,
          },
          data: nodeList,
        }

        console.log(formdata)
      }

      const toSend = {
        unique: this.flow.response.unique,
      }

      let sendName = 'doFlow'
      if (hasTree) {
        sendName = 'doFlowTreeNew'
        toSend.paraStr = window.escape(JSON.stringify(formdata))
      }

      this.r().post(sendName, toSend).then(response => {
        // this.$notice.success({
        //   content: '流程处理成功',
        // })
        this.cancelFlow()
      }).catch(error => {
        this.$notice.error({
          content: '流程处理失败',
        })
        this.cancelFlow()
      })
    },
    cancelFlow() {
      if (this.$route.meta.basic) {
        this.hideFlow()
        return false
      }
      this.$nextTick(() => {
        this.hideFlow()
        this.$router.go(-1)
      })
    },
    walkList(list = this.flow.tree, singleSelection = this.flow.singleSelection, parentId = '') {
      for (let i = 0, l = list.length; i < l; ++i) {
        const item = list[i]
        if (
          this._.toNumber(parentId) === this.parentId
          && this._.toNumber(item.id) !== this.clickId
          && singleSelection
        ) {
          item.checked = false
        }

        if (this._.hasOwn(item, 'children') && item.children.length > 0) {
          this.walkList(item.children, this._.toNumber(item.attr.operatersingle), item.id)
        }
      }
    },
    handleClick(payload, parentId = '') {
      this.parentId = this._.toNumber(parentId)
      this.clickId = this._.toNumber(payload.id)
      if (this.clickId) this.walkList(this.flow.tree, this.flow.singleSelection)
    },
  },
}
</script>

<style lang="stylus">
.flow-tips
  position: relative
  margin: 0
  padding: 0
  width: 100%
  height: 100%
  z-index: 5
  background: #fff
  .flow-tips-html
    width: 100%
    margin: auto
    font-size: 16px
    line-height: 1.5
    padding: 80px 16px 16px 16px
    img
      width: 200px
      margin-bottom: 40px
    p
      color: #333
  .flow-tips-btns
    font-size: 0
    padding: 48px 24px
    .ct-button
      display: block
      margin: 0 auto
      height: 40px
      font-size: 16px
  .ct-switch
    display: inline-block
    margin-right: 10px
    vertical-align: middle

.flow-parent
  vertical-align: top
  border-radius: 6px
  padding: 8px
  width: 400px
  margin: 0 auto
  margin-bottom: 24px
  .flow-parent-title
    border-bottom: 1px solid #dddddd
    text-align: left
    padding-bottom: 8px
    font-size: 18px

.flow-child-title
  height: 32px
  line-height: 32px
  font-size: 0
  & > p
    font-size: 18px
    display: inline-block
    vertical-align: middle
.flow-child
  &.has-children
    padding-top: 8px
  .flow-child-title
    display: inline-block
    margin: 8px auto
    width: 50%
    text-align: center
    margin-bottom: 8px
    &.selected
      border-radius: 8px
      border: 1px solid blue
    // &:first-child
    //   margin-top: 8px
    // &:last-child
    //   margin-bottom: 0
</style>
