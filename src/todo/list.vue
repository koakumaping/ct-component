<template>
  <span>
    <ct-table :data="list" :row-class-name="tableRowClassName" :height="height">
      <ct-table-column label="任务/单据编号" width="240">
        <template v-slot="scope">
          <a
            v-if="scope.row.href"
            :href="scope.row.href"
            :class="[ scope.row.IsOpen ? 'text-read' : 'text-main' ]"
            :target="scope.row.target"
          >{{ scope.row.subject }}</a>
          <router-link
            v-else
            :class="[ scope.row.IsOpen ? 'text-read' : 'text-main' ]"
            :to="{
              name: scope.row.routerName || '404',
              query: {
                id: scope.row.id,
                boxid: scope.row.BoxId,
                flowid: scope.row.FlowId,
                workflowid: scope.row.WorkFlowId,
              },
            }"
          >
            {{ scope.row.subject }}
          </router-link>
        </template>
      </ct-table-column>
      <ct-table-column label="任务类型" prop="TaskType" width="120" v-if="system !== 2"/>
      <ct-table-column label="任务环节" prop="StateName" v-if="system !== 2"/>
      <ct-table-column label="订单说明" prop="Remark" v-if="system !== 5" width="350">
        <template v-slot="scope">
          <ct-poptip place="bottom-left" trigger="hover" width="200" v-if="scope.row.Remark">
            {{ scope.row.Remark | limit(20) }}
            <template slot="content">
              <div style="width: 200px">{{ scope.row.Remark }}</div>
            </template>
          </ct-poptip>
          <span v-else>--</span>
        </template>
      </ct-table-column>
      <ct-table-column label="借款金额" prop="borrowmoney" v-if="system === 2"/>
      <ct-table-column label="报销金额" prop="expensemoney" v-if="system === 2"/>
      <ct-table-column label="接受/创建时间" prop="CreateTime" v-if="$route.name !== 'home'"/>
      <ct-table-column label="发送/创建人" prop="CreaterName" width="140" v-if="$route.name !== 'home'"/>
      <ct-table-column label="操作" width="100" v-if="$route.name !== 'home'">
        <template v-slot="scope">
          <deleteTip
            v-if="scope.row.StateType === 1"
            @on-confirm="handleDelete(scope.row.id, scope.row.AppId, scope.row.SysId)"
          ></deleteTip>
          <span v-else>--</span>
        </template>
      </ct-table-column>
    </ct-table>

    <ct-button width="100%" type="dashed" v-if="$route.name === 'home'" routerName="homeTodo">查看更多</ct-button>
    <ct-pagination
      :total="total"
      v-if="$route.name !== 'home'"
    ></ct-pagination>
  </span>
</template>

<script>
import store from 'store'
import { listMixins } from 'ct-mixin'

export default {
  name: 'todoBox',
  mixins: [listMixins],
  props: {
    page: [String, Number],
    height: [String, Number],
  },
  data() {
    return {
      searchForm: {
        sys: '',
        subject: '',
        username: '',
        includeborrow: 0,
        includecost: 0,
        includeexpense: 0,
      },
      href: '#',
    }
  },
  computed: {
    system() {
      return store.get('system')
    },
  },
  mounted() {
    this.searchForm.sys = store.get('system')
    if (this.page) this.searchForm.pagesize = this.page
    this.getList()
  },
  methods: {
    tableRowClassName(row, index) {
      if (row.IsOpen) {
        return 'has-read'
      }
      return 'un-read'
    },
    handleDelete(id, AppId, SysId) {
      const params = {
        appid: AppId,
        id: id,
        sys: SysId,
      }
      this.r().delete('todoBox', { params }).then(respones => {
        this.getList()
      })
    },
  },
}
</script>

<style lang="stylus">
.text-read
  color: #323d59
</style>
