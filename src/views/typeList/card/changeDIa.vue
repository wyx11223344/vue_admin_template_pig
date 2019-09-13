<!--
    Created by WYX
    Time 2019/8/31
-->
<template lang="pug">
  el-drawer(:visible.sync="changeShow"
            direction="btt"
            :before-close="handleClose"
            size="70%")
    template(slot="title")
      b.title_b {{type === true ? `${form.typename}修改` : `新增${form.typename ? form.typename : '新的类型哦！'}`}}
    one-each-card.card_show(
      :sendObject="form"
      :type="2")
    el-form.center_form(:model="form" ref="typeForm" :rules="rules" label-width="100px")
      el-form-item(label="类型名称" prop="typename")
        el-input(v-model="form.typename")
      el-form-item(label="收支情况" prop="is_get")
        el-select.select_show(v-model="form.is_get")
          el-option(label="支出" :value="0")
          el-option(label="收入" :value="1")
        transition(name="el-fade-in")
          svg-icon.svg_show(icon-class="cry" v-show="form.is_get === 0")
        transition(name="el-fade-in")
          svg-icon.svg_show(icon-class="laugh" v-show="form.is_get === 1")
      el-form-item(label="图片logo" prop="icon_name")
        el-select(clearable v-model="form.icon_name" size="mini" class="select_change" placeholder="选择图片")
          el-option(v-for="(item,index) in selectList"
                    :key="index"
                    :value="item.pic_url"
                    :label="item.pic_url")
            .select-option {{item.pic_url}}
              el-image.select_img.rt(:src="`http://static.mrwanmisshen.com${item.type}${item.pic_url}`")
        a(style="color: #409EFF" @click="$router.push('/picture/table')") 竟然没有想要的图片？？？添加！
      el-form-item(label="背景颜色" prop="bgc")
        el-color-picker(v-model="form.bgc" @active-change="colorChange")
      el-form-item
        el-button(size="mini" type="primary" @click="submitForm('typeForm')") {{type === true ? `修改` : `新增`}}
        el-button(size="mini" @click="resetForm()") 重置
</template>

<script>
import { typePicList } from '@/api/picList'
import { typeListChange } from '@/api/typeList'
export default {
    name: 'ChangeDIa',
    components: {
        oneEachCard: () => {
            return import('./eachCard')
        }
    },
    model: {
        prop: 'changeShow',
        event: 'changeDia'
    },
    props: {
        changeShow: {
            type: Boolean
        },
        oneObject: {
            type: Object
        },
        type: {
            type: Boolean
        }
    },
    data() {
        return {
            form: null,
            rules: {
                typename: [
                    { required: true, message: '请输入类型名称', trigger: 'blur' }
                ],
                is_get: [
                    { required: true, message: '请选择收支情况', trigger: 'blur' }
                ],
                icon_name: [
                    { required: true, message: '请选择使用图片', trigger: 'blur' }
                ],
                bgc: [
                    { required: true, message: '请选择背景颜色', trigger: 'blur' }
                ]
            },
            selectList: []
        }
    },
    watch: {
        changeShow: {
            handler() {
                if (this.changeShow) {
                    this.deep_clone()
                    this.get_pic_list()
                }
            },
            immediate: true
        }
    },
    created() {
        this.deep_clone()
    },
    methods: {
        /**
         * 关闭回调
         */
        handleClose() {
            this.$emit('changeDia', false)
        },

        /**
         * 颜色选择
         * @param index
         */
        colorChange(index) {
            if (!this.form.bgc) {
                this.$set(this.form, 'bgc', index)
            } else {
                this.form.bgc = index
            }
        },

        /**
         * 可选图片列表获取
         */
        get_pic_list() {
            typePicList({
                choose: true
            }).then((response) => {
                this.selectList = response.data
            })
        },

        /**
         * 数据深拷贝
         */
        deep_clone() {
            this.form = JSON.parse(JSON.stringify(this.oneObject))
        },

        /**
         * 表单重置
         */
        resetForm() {
            this.deep_clone()
        },

        /**
         * 表单提交
         * @param formName
         */
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('您确定要修改类型信息么？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        typeListChange(this.form).then((response) => {
                            if (response.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                })
                                this.$emit('list_get')
                                this.handleClose()
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        })
                    })
                } else {
                    this.$message.error('信息填写有误，请查看页面提示')
                    return false
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.title_b{
  text-align: center;
}
  .center_form{
    width: 400px;
    position: absolute;
    margin: auto;
    left: 400px;
    right: 0;
  }
  .card_show{
    position: absolute;
    margin: auto !important;
    left: 0;
    right: 400px;
  }
  .select_show{
    width: calc(100% - 40px)
  }
  .svg_show{
    width: 30px;
    height: 30px;
    transform: translate(5px,7px);
    position: absolute;
    right: 0;
  }
  .select_change{
    width: 100%;
  }
  .select-option{
    width: 100%;
    height: 34px;
    .select_img{
      height: 34px;
      width: 34px;
    }
  }
</style>
