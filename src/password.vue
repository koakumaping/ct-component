<template>
  <ct-form :model="form" :rules="rules" ref="form">
    <ct-card label="基础信息(请牢记修改后的密码)">
      <ct-form-line label="显示输入的密码">
        <single-block :data="dictionaries.Bool" v-model="showPassword"></single-block>
      </ct-form-line>
      <ct-form-line label="当前登录密码" prop="passwordOld">
        <ct-input v-model="form.passwordOld" :type="passwordType" width="400"/>
      </ct-form-line>
      <ct-form-line label="新的登录密码" prop="password">
        <ct-input v-model="form.password" :type="passwordType" width="400"/>
      </ct-form-line>
      <ct-form-line label="确认登录密码" prop="passwordRepeat">
        <ct-input v-model="form.passwordRepeat" :type="passwordType" width="400"/>
      </ct-form-line>
      <ct-button type="primary" @click="submit">确定修改</ct-button>
    </ct-card>
  </ct-form>
</template>

<script>
import { responseMixins } from 'ct-mixin'
import { userMixins } from 'ct-mixin'

export default {
  name: 'passwordForm',
  mixins: [responseMixins, userMixins],
  data() {
    return {
      showPassword: 0,
      form: {
        passwordOld: '',
        password: '',
        passwordRepeat: '',
      },
      rules: {
        passwordOld: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '至少 3 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '至少 3 个字符', trigger: 'blur' },
        ],
        passwordRepeat: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '至少 3 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    passwordType() {
      return this.showPassword ? 'text' : 'password'
    },
  },
  methods: {
    async submit() {
      if (this.form.password !== this.form.passwordRepeat) {
        this.$notice.warn({
          content: '新的登录密码跟确认登录密码不一致',
        })
        return false
      }
      const pass = await this.formCheckError('form')
      if (!pass) return false
      this.loading = true
      const formdata = {
        oldpsd: this.form.passwordOld,
        psd: this.form.password,
      }

      this.r().post('userPassword', formdata).then(response => {
        this.$notice.success({
          content: '修改成功，请使用新密码重新登录！',
        })
        window.setTimeout(() => {
          window.sessionStorage.clear()
          window.localStorage.clear()
          if (this.user.agent) {
            this.$router.replace({ name: 'agentLogin' })
          } else {
            this.$router.replace({ name: 'login' })
          }
        }, 100)
      }).catch(error => {
        this.loading = false
      })
    },
  },
}
</script>
