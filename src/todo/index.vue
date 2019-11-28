<template>
  <listWarp>
    <ct-action-bar @on-search="doSearch">
      <ct-button @click="reload" icon="refresh"></ct-button>

      <template slot="right">
        <span v-if="$route.name == 'financeTodoList'">
          <ctCheckbox style="margin-right: 8px" label="只看借款" v-model="searchForm.includeborrow"></ctCheckbox>
          <ctCheckbox style="margin-right: 8px" label="只看申请" v-model="searchForm.includecost"></ctCheckbox>
          <ctCheckbox style="margin-right: 8px" label="只看报销" v-model="searchForm.includeexpense"></ctCheckbox>
        </span>
        <ct-input v-if="$route.name == 'financeTodoList'"
          v-model="searchForm.username" placeholder="姓名" width="120px">
        </ct-input>
        <ct-input v-if="$route.name == 'financeTodoList' || $route.name == 'managementTodoList'"
          v-model="searchForm.jobnumber" placeholder="工号" width="120px">
        </ct-input>
        <ct-input v-model="searchForm.subject" placeholder="任务名称" width="300px"></ct-input>
      </template>
    </ct-action-bar>

    <list/>
  </listWarp>
</template>

<script>
import store from 'store'
import { listMixins } from 'ct-mixin'
import list from './list'

export default {
  name: 'todoBox',
  mixins: [listMixins],
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
    }
  },
  components: {
    list,
  },
  mounted() {
    this.searchForm.sys = store.get('system')
  },
}
</script>

<style lang="stylus">
.text-read
  color: #323d59
</style>
