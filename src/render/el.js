import { dictMixins } from 'ct-mixin'

export default {
  name: 'renderEl',
  mixins: [dictMixins],
  props: {
    data: {
      required: true,
      type: Object,
    },
    value: [Number, String, Boolean, Object, Array],
  },
  data() {
    return {
      textList: [
        'span',
        'div',
      ],
    }
  },
  render(createElement) {
    const data = this.data
    const self = this
    const children = []

    if (data.el === 'ct-select' && data.dict) {
      for (const index in this.dictionaries[data.dict]) {
        const d = this.dictionaries[data.dict][index]
        const item = createElement('ct-option', {
          attrs: {
            key: d.key,
            label: d.label,
            value: d.value,
            disabled: d.disabled,
          },
        })
        children.push(item)
      }
    }

    const attrs = {
      value: self.value,
    }

    if (data.attrs) Object.assign(attrs, JSON.parse(data.attrs))

    return createElement(
      data.el || data.customEl,
      self.textList.indexOf(data.el) > -1 ?
        data.value :
        {
          attrs,
          style: data.style,
          on: {
            input(event) {
              self.$emit('input', event)
            },
            change(event) {
              self.$emit('change', event)
            },
            click(event) {
              if (data.fn) self.$emit('click', data)
            },
          },
        },
      children.map(item => item),
    )
  },
}