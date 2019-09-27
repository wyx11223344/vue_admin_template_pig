/**
 * @author WYX
 * @date 2019/9/10
 * @Description: 图片类型修改
*/
<template lang="pug">
  el-dialog(:before-close="close"
            :title="addNew ? '新增图片' : '修改图片信息'"
            append-to-body
            :visible.sync="isShow"
            width="50%"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="正在上传图片请稍等"
            element-loading-background="rgba(255,255,255,0.8)")
    el-form(ref="picForm" :rules="rules" :model="form" label-width="80px" :status-icon="true")
      el-form-item(label="图片:")
        el-image.show-place(v-if="imageUrl" :src="newImage ? newImage : imageUrl" class="avatar" @click="showDia()")
          div.show-place.image-slot(slot="error" @click="showDia()")
            i.el-icon-picture-outline
        p.change-text {{addNew ? '↑点上面上传图片' : '↑点上面修改图片'}}
        image-cropper(v-if="imagecropperShow"
                      key="file"
                      :width="200"
                      :height="200"
                      lang-type="en"
                      :params="form"
                      @close1="close1"
                      @fileSend="imgChange(arguments)")
      el-form-item(label="图片类型:")
        .big-show-font(v-if="form.type" v-show="!addNew") {{form.type | picTypeFilter}}
        el-select(v-model="typeSelect" v-show="addNew")
          el-option(label="类型图片" value="/typeList/")
          el-option(label="用户图片" value="user")
          el-option(label="测试图片" value="/new/")
      el-form-item(label="用户邮箱:" v-show="typeSelect === 'user'")
        el-input(v-model="userName" placeholder="请输入用户邮箱地址")
      el-form-item(label="图片名称:")
        el-input(v-model="picName" placeholder="请输入上传图片名称")
      el-form-item
        el-button(size="mini" type="primary" @click="submitForm('picForm')") {{addNew ? '新增' : '修改'}}
        el-button(size="mini" @click="resetForm()") 重置
</template>

<script>
import { picChange } from '@/api/picList'
export default {
    name: 'PictureChange',
    components: {
        ImageCropper: () => {
            return import('@/components/ImageCropper/index')
        }
    },
    model: {
        prop: 'isShow',
        event: 'changeDia'
    },
    props: {
        isShow: {
            type: Boolean
        },
        sendPic: {
            type: Object
        },
        addNew: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialogVisible: false,
            // 接收form表单
            form: {},
            rules: {},
            // 图片名称
            picName: '',
            // 上传加载
            fullscreenLoading: false,
            imagecropperShow: false,
            // 回调图片
            newImage: '',
            newFile: null,
            FileName: '',
            // 类型绑定值
            typeSelect: '',
            userName: ''
        }
    },
    computed: {
        /**
         * 获取图片地址
         */
        imageUrl() {
            return `http://static.mrwanmisshen.com${this.form.type}${this.form.pic_url}`
        },
        /**
         * 获取图片名称
         */
        getName() {
            return (index) => {
                const arr = index.split('.')
                return arr[0]
            }
        }
    },
    watch: {
        isShow: {
            handler() {
                if (this.isShow) {
                    this.reset()
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
            this.$emit('changeDia', false)
        },
        /**
             * 修改提交
             * @param formName
             */
        submitForm(formName) {
            const reg = /^\s*$/g
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.newFile) {
                        this.$message.error('请上传需要修改的图片')
                        return
                    }
                    if (reg.test(this.picName)) {
                        this.$message.error('请输入上传图片名称')
                        return false
                    }
                    if (this.addNew) {
                        if (reg.test(this.typeSelect)) {
                            this.$message.error('请选择图片类型')
                            return false
                        }
                        if (this.typeSelect === 'user') {
                            if (reg.test(this.userName)) {
                                this.$message.error('请输入用户名称')
                                return false
                            }
                            this.form.type = `/${this.userName}/`
                        } else {
                            this.form.type = this.typeSelect
                        }
                    }
                    this.form.new_url = this.picName
                    const fmData = new FormData()
                    fmData.append('file', this.newFile, this.FileName)
                    Object.keys(this.form).forEach((k) => {
                        fmData.append(k, this.form[k])
                    })
                    // this.form.file = this.newFile
                    this.fullscreenLoading = true
                    picChange(fmData).then((response) => {
                        this.fullscreenLoading = false
                        if (response.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: this.addNew ? '新增成功' : '修改成功'
                            })
                            this.newImage = null
                            this.newFile = null
                            this.FileName = null
                            this.$emit('list_get')
                            this.$emit('changeDia', false)
                        } else {
                            this.$message.error(this.addNew ? '新增失败，请再次尝试' : '修改失败，请再次尝试')
                        }
                    }).catch(() => {
                        this.fullscreenLoading = false
                    })
                } else {
                    this.$message.error('表单信息有错误，请根据提示填写表单信息')
                    return false
                }
            })
        },

        /**
             * 表单重置
             */
        resetForm() {
            this.reset()
        },

        /**
         * 关闭回调
         */
        close1() {
            this.imagecropperShow = false
        },

        /**
         * 图片处理回调
         * @param bolb
         */
        imgChange(bolb) {
            console.log(bolb)
            this.newImage = bolb[0].toString()
            this.newFile = bolb[1]
            this.FileName = bolb[2]
        },

        /**
         * 上传弹窗显示
         */
        showDia() {
            this.imagecropperShow = true
        },

        /**
         * 组件重置
         */
        reset() {
            this.form = JSON.parse(JSON.stringify(this.sendPic))
            if (!this.addNew) {
                this.picName = this.getName(this.form.pic_url)
            } else {
                this.picName = ''
            }
            this.newImage = ''
            this.typeSelect = ''
            this.userName = ''
        }
    }
}
</script>

<style scoped lang="less">
  .show-place{
    width: 150px;
  }
  .big-show-font{
    font-size: 16px;
    font-weight: bold;
  }
  .change-text{
    width: 150px;
    text-align: center;
    margin: 0;
    color: #409EFF;
  }
</style>

