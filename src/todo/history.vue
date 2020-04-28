<template>
  <listWarp>
    <ct-action-bar @on-search="doSearch">
      <ct-button @click="reload" icon="refresh" />

      <template slot="right">
        <ct-input v-model="searchForm.title" placeholder="标题" width="120px" />
        <ct-input v-model="searchForm.appler" placeholder="申请人" width="120px" />
        <ct-date-picker v-model="searchForm.finishtime" placeholder="审批时间" type="date" width="120px" clearable />
      </template>

      <template slot="extra">
        <ct-form-search-line title="类型">
           <ct-select v-model="searchForm.flowtype" clearable placeholder="类型">
            <ct-option
              v-for="item in dictionaries.flowtype"
              :key="item.key"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </ct-select>
        </ct-form-search-line>
        <ct-form-search-line title="办理情况">
          <ct-select v-model="searchForm.flowstatus" clearable placeholder="办理情况">
            <ct-option
              v-for="item in dictionaries.FlowStatus"
              :key="item.key"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </ct-select>
        </ct-form-search-line>
      </template>
    </ct-action-bar>

    <ct-table :data="list">
      <ct-table-column label="任务/单据编号">
        <template v-slot="scope">
          <a
            v-if="scope.row.href"
            :href="scope.row.href"
            class="text-read"
            :target="scope.row.target"
          >{{ scope.row.subject }}</a>
          <router-link
            v-else
            class="text-read"
            :to="{
              name: scope.row.routerName || '404',
              query: {
                id: scope.row.Id,
                flowid: scope.row.flowid,
              },
            }"
          >
            {{scope.row.subject}}
          </router-link>
        </template>
      </ct-table-column>
      <ct-table-column label="流程名称" prop="flowname"/>
      <ct-table-column label="订单说明" prop="Remark" v-if="searchForm.sys === 2">
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
      <ct-table-column label="流程状态" prop="flowstatusname"/>
      <ct-table-column label="流程当前信息" prop="statename"/>
      <ct-table-column label="申请人" prop="applyer" width="140"/>
      <ct-table-column label="操作" width="100">
        <template v-slot="scope">
          <span class="text-main pointer" v-if="scope.row.iscancel === 1" @click="toggleDeleteDialog(scope.row.Id)">取回</span>
        </template>
      </ct-table-column>
    </ct-table>

    <ct-pagination :total="total"/>
  </listWarp>
</template>

<script>
import store from 'store'
import { listMixins } from 'ct-mixin'

export default {
  name: 'historyBox',
  mixins: [listMixins],
  data() {
    return {
      searchForm: {
        sys: 0,
        flowtype: '',
        flowstatus: '',
        title: '',
        appler: '',
        finishtime: '',
        pageindex: 1,
        workstatus: '',
        workdostatus: '',
      },
    }
  },
  mounted() {
    this.searchForm.sys = store.get('system')
    this.getList()
  },
  methods: {
    toggleDeleteDialog(index) {
      const formdata = {
        id: index,
      }

      this.r().post('todoBox', formdata).then(() => {
        this.reload()
      })
    },
  },
}
</script>

