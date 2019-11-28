<template>
  <div class="ct-message">
    <span>{{msg.content}}</span>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: {
    msg: {
      type: Object,
      default: function d() {
        return {
          title: '',
          content: '',
        }
      },
    },
  },
}
</script>
