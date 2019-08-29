<!--
    Created by WYX
    Time 2019/8/15
-->
<template lang="pug">
  el-dialog(@close="close" title="修改用户信息" append-to-body :visible.sync="dialogVisible" width="50%")
    el-form(ref="userForm" :rules="rules" :model="form" label-width="80px" :status-icon="true")
      el-form-item(label="用户名")
        el-input(v-model="form.username" :disabled="true")
      el-form-item(label="密码" prop="password")
        el-input(v-model="form.password")
      el-form-item(label="注册时间")
        el-input(v-model="form.create_time" :disabled="true")
      el-form-item(label="最近登录")
        el-input(v-model="form.last_time" :disabled="true")
      el-form-item(label="激活状态" prop="state")
        el-select(size="mini" v-model="form.state" placeholder="请选择验证状态")
          el-option(:value="1" label="已验证")
          el-option(:value="0" label="未验证")
      el-form-item
        el-button(size="mini" type="primary" @click="submitForm('userForm')") 修改
        el-button(size="mini") 重置
</template>

<script>
import { userChange } from '@/api/userDate'
export default {
    name: 'UserTableChange',
    props: {
        isShow: {
            type: Boolean
        },
        sendUser: {
            type: Object
        }
    },
    data() {
        return {
            dialogVisible: false,
            form: {},
            rules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'change' },
                    { min: 6, message: '请输入6位以上密码', trigger: 'change' }
                ],
                state: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ]
            }
        }
    },
    watch: {
        isShow: {
            handler() {
                if (this.isShow) {
                    this.dialogVisible = this.isShow
                    this.form = JSON.parse(JSON.stringify(this.sendUser))
                }
            },
            immediate: true
        }
    },
    methods: {
        /**
             * 关闭回调
             */
        close() {
            this.dialogVisible = false
            this.$emit('close')
        },
        /**
         * 修改提交
         * @param formName
         */
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    new Promise((resolve, reject) => {
                        if (this.form.password !== this.sendUser.password) {
                            this.$confirm('您确定要修改账号密码？ 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                resolve()
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消修改'
                                })
                                reject()
                            })
                        } else {
                            resolve()
                        }
                    }).then(() => {
                        if (this.form.state !== this.sendUser.state) {
                            this.form.create_time = parseInt(Date.parse(new Date()) / 1000)
                            this.form.last_time = 0
                        }
                        userChange(this.form).then(response => {
                            if (response.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                })
                                this.$emit('get_list')
                                this.dialogVisible = false
                            } else {
                                this.$message.error('修改失败！请再次重试！')
                            }
                        })
                    })
                } else {
                    this.$message.error('表单信息有错误，请根据提示填写表单信息')
                    return false
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
