<template>
  <div class="flow-history" v-clickoutside="hideList">
    <ct-button @click="visible = true">流程日志<span v-if="data.statename">：{{ data.statename }}</span> </ct-button>
    <div class="ct-history-warp" v-show="visible">
      <div class="ct-history">
        <div class="ct-history-content">
          <div class="ct-history-list"
            v-for="(history, key) in data.historystructure"
            :key="`${key}${_.randomString(12, true)}`"
            :data-key="key"
            v-show="currentKey === key"
          >
            <div
              class="ct-flowinfo-block"
              v-for="(item, index) in history"
              :key="index"
              :data-index="index"
            >
              <div class="ct-flowinfo-line"></div>
              <div class="ct-flowinfo-status">
                <fa-font name="clock" class="text-yellow" v-if="!isOver && index === 0"/>
                <fa-font name="check-circle" class="text-green" v-else/>
              </div>
              <div class="ct-flowinfo-content-warp">
                <div class="ct-flowinfo-content">
                  <ct-row style="margin-bottom: 4px;">
                    <ct-col :span="9">{{ item.approver }}</ct-col>
                    <ct-col :span="15" class="text-right">{{ item.approvetime }}</ct-col>
                  </ct-row>
                  <ct-row style="font-size: 15px;">
                    <ct-col :span="12">{{ item.nodename }}</ct-col>
                    <ct-col :span="12" class="text-right">
                      <dl
                        :class="{
                          'text-yellow': !isOver && index === 0,
                          'text-green': !(!isOver && index === 0),
                        }"
                      >{{ item.approvcontent }}</dl>
                    </ct-col>
                  </ct-row>
                  <dl class="ct-flowinfo-content_message">{{ item.content }}</dl>
                </div>
              </div>
            </div>
            <!-- <span v-if="history && history.length === 0">暂无日志</span> -->
          </div>
        </div>
        <single-block :data="labelList" v-model="currentKey" v-if="isMulti"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'flowHistory',
  props: {
    data: {
      type: Object,
      default: function d() {
        return {
          historystructure: {},
          sateguid: '',
        }
      },
    },
  },
  computed: {
    isOver() {
      return this.data.sateguid === 'flowfinsh'
    },
    isMulti() {
      return Object.keys(this.data.historystructure).length > 1
    },
    labelList() {
      const list = this.data.view
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
      visible: false,
    }
  },
  mounted() {
    if (this.currentKey === '' && this.labelList.length) this.currentKey = this.labelList[0].value
  },
  methods: {
    hideList() {
      this.visible = false
    },
  },
}
</script>

<style lang="stylus">
$color-red = #f73965
$color-green = #1EC599
$color-yellow = #ffd341

.flow-history
  line-height 1
  vertical-align middle
  display inline-block
  ul
    max-height 22 * 18px
    overflow auto
    li
      display block
      max-width 520px
      text-overflow ellipsis
      white-space normal
      padding 2px 0

.ct-history-warp
  position: fixed
  bottom: 58px

.ct-history
  padding-top: 16px
  width: 420px
  background-color: #f5f5f5
  font-size: 16px
  border-radius: 16px
  box-shadow: 6px 4px 9px rgba(0,21,41,0.08)

.ct-history-content
  max-height: 420px
  overflow: auto

.ct-history-list
  overflow: hidden
  .ct-flowinfo-block
    position: relative
    flex: 1
    padding-right: 16px
    padding-bottom: 16px
    &:last-child > .ct-flowinfo-line
      background-color: #f5f5f5
      &::after
        background-color: #f5f5f5
    .ct-flowinfo-line
      width: 60px
      left: 30px
      top: 21px
      position: absolute
      height: 100%
      width: 1px
      background-color: rgb(225, 225, 225)
      z-index: 1
      &::after
        content: ''
        position: absolute
        height: 100%
        width: 1px
        background-color: rgb(225, 225, 225)
        padding-bottom: 16px
    .ct-flowinfo-status
      width: 60px
      text-align: center
      position: absolute
      top: 16px
      height: 100%
      vertical-align: middle
      z-index: 1
      & > svg
        position: absolute
        top: 30%
        left: 50%
        margin-top: -8px
        margin-left: -8px
        background: #fff
        border-radius: 50%
      .ct-flowinfo-status-start
        height: 12px
        width: 12px
        border-radius: 50%
        background-color: rgb(206, 206, 206)
        position: absolute
        top: 50%
        left: 50%
        margin-top: -14px
        margin-left: -6px
        border-radius: 50%
    .ct-flowinfo-content-warp
      flex: 1 1 auto
      padding-left: 60px
      .ct-flowinfo-content
        padding: 12px
        border-radius: 6px
        background-color: #fff
        position: relative
        &::before
          content: ''
          position: absolute
          width: 8px
          height: 8px
          background-color: #fff
          left: -4px
          top: 30%
          transform: rotateZ(45deg)
        &.start
          font-size: 14px
          color: rgb(154, 154, 154)
          background-color: transparent
          &::before
            width: 0
            height: 0
        .ct-flowinfo-content_message
          font-size: 14px
          color: rgb(154, 154, 154)
</style>