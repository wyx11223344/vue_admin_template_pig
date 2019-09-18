/**
 * @author WYX
 * @date 2019/9/10
 * @Description: 图片类型修改
*/
<template lang="pug">
  el-dialog(:before-close="close"
            title="修改图片信息"
            append-to-body
            :visible.sync="isShow"
            width="50%"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="正在上传图片请稍等"
            element-loading-background="rgba(255,255,255,0.8)")
    el-form(ref="picForm" :rules="rules" :model="form" label-width="80px" :status-icon="true")
      el-form-item(label="图片:")
        //el-upload(action="http://localhost:8068/webChange/pic_change"
        //          ref="upload"
        //          :multiple="false"
        //          :show-file-list="false"
        //          :data="form"
        //          :on-change="fileChange"
        //          :auto-upload="false"
        //          :on-success="uplode_success"
        //          :before-upload="beforeAvatarUpload")
        el-image.show-place(v-if="imageUrl" :src="newImage ? newImage : imageUrl" class="avatar" @click="imagecropperShow = true")
          div(slot="error" class="image-slot" @click="imagecropperShow = true")
            i(class="el-icon-picture-outline")
        p.change-text ↑点上面修改图片
        image-cropper(v-if="imagecropperShow"
                      key="file"
                      :width="300"
                      :height="300"
                      lang-type="en"
                      :params="form"
                      @close1="close1"
                      @fileSend="imgChange(arguments)")
      el-form-item(label="图片类型:" v-if="form.type")
        .big-show-font {{form.type | picTypeFilter}}
      el-form-item(label="图片名称:" v-if="form.pic_url")
        el-input(v-model="picName")
      el-form-item
        el-button(size="mini" type="primary" @click="submitForm('picForm')") 修改
        el-button(size="mini" @click="resetForm()") 重置
</template>

<script>
import { picChange } from '@/api/picList'
export default {
    name: 'PictureChange',
    filters: {
        picTypeFilter(index) {
            const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
            index = index.replace(/\//g, '')
            if (reg.test(index)) {
                return `用户${index}`
            }
            switch (index) {
                case 'typeList':
                    return '类型图片'
                case 'new':
                    return '测试图片'
                default:
                    return index
            }
        }
    },
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
        }
    },
    data() {
        return {
            dialogVisible: false,
            form: {},
            rules: {
                state: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ]
            },
            picName: '',
            // 上传加载
            fullscreenLoading: false,
            imagecropperShow: false,
            newImage: '',
            newFile: null,
            FileName: ''
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
                    this.form = JSON.parse(JSON.stringify(this.sendPic))
                    this.picName = this.getName(this.form.pic_url)
                    this.newImage = ''
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.newFile) {
                        this.$message.error('请上传需要修改的图片')
                        return
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
                                message: '修改成功'
                            })
                            this.newImage = null
                            this.newFile = null
                            this.FileName = null
                            this.$emit('list_get')
                            this.$emit('changeDia', false)
                        } else {
                            this.$message.error('修改失败，请再次尝试')
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
            this.form = JSON.parse(JSON.stringify(this.sendPic))
        },

        // /**
        //  * 上传前处理
        //  * @param file
        //  * @returns {boolean}
        //  */
        // beforeAvatarUpload(file) {
        //     const isJPG = file.type === 'image/jpeg'
        //     const isPNG = file.type === 'image/png'
        //     const isGIF = file.type === 'image/gif'
        //     const isLt2M = file.size / 1024 / 1024 < 2
        //     if (!isJPG && !isPNG && !isGIF) {
        //         this.$message.error('上传图片只能是 JPG 和 PNG 格式!')
        //         return false
        //     }
        //     if (!isLt2M) {
        //         this.$message.error('上传图片大小不能超过 2MB!')
        //         return false
        //     }
        //     this.fullscreenLoading = true
        //     return true
        // },

        // uplode_success(response) {
        //     if (response.code === 200) {
        //         this.$message({
        //             type: 'success',
        //             message: '修改成功'
        //         })
        //         this.$emit('list_get')
        //         this.$emit('changeDia', false)
        //     } else {
        //         this.$message.error('修改失败，请再次尝试')
        //     }
        //     this.fullscreenLoading = false
        // },

        close1() {
            this.imagecropperShow = false
        },

        imgChange(bolb) {
            console.log(bolb)
            this.newImage = bolb[0].toString()
            this.newFile = bolb[1]
            this.FileName = bolb[2]
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

