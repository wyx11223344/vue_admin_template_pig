<!--
    Created by WYX
    Time 2019/8/26
-->
<template lang="pug">
  el-card.box-card(:style="{backgroundColor: sendObject.is_get === 1 ? '#fceaee' : '' }")
    div(slot="header" class="clearfix")
      span {{sendObject.typename}}
      el-button(v-if="type === 1" style="float: right; padding: 3px 0 ; color: rgb(254,67,101)" type="text" @click="type_change(0)") 删除
      el-button(v-if="type === 1" style="float: right; padding: 3px 5px" type="text" @click="$emit('change',sendObject)") 修改
      el-button(v-if="type === 0" style="float: right; padding: 3px 0 ; color: rgb(254,67,101)" type="text" @click="type_change(-1)") 彻底删除
      el-button(v-if="type === 0" style="float: right; padding: 3px 5px" type="text" @click="type_change(1)") 恢复
    .main-show
      .left-show(:style="{backgroundColor:sendObject.bgc}")
        el-image(:src="'http://static.mrwanmisshen.com/typeList/'+ sendObject.icon_name")
          div(slot="error" class="image-slot")
            svg-icon.img-error(icon-class="pic")
      .right-show
        p 类型名称：{{sendObject.typename}}
        p 收支类别：{{sendObject.is_get === 0 ? '支出' : '收入'}}
        p
          span(style="float: left") 启用状态：
            span(:style="{color: sendObject.type === 0 ? '#ff4949' : '#42b983'}") {{sendObject.type === 0 ? '未使用' : '使用中'}}
          span.comyjstate(:class="'yjstate'+ sendObject.type")
</template>

<script>
import { typeListChange } from '@/api/typeList'
export default {
    name: 'TypeListCardEachCard',
    props: {
        sendObject: {
            type: Object
        },
        type: {
            type: Number,
            default: 1
        }
    },
    methods: {
        type_change(index) {
            let message = ''
            switch (index) {
                case 0:
                    message = '删除'
                    break
                case 1:
                    message = '恢复'
                    break
                case -1:
                    message = '彻底删除'
                    break
            }
            this.$confirm('此操作将' + message + '该类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                typeListChange({
                    id: this.sendObject.id,
                    type: index
                }).then((response) => {
                    if (response.code === 200) {
                        this.$message({
                            type: 'success',
                            message: response.msg
                        })
                        this.$emit('list_get')
                    } else {
                        this.$message.error(response.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消' + message
                })
            })
        }
    }
}
</script>

<style scoped lang="less">
  .box-card{
    width: 340px;
    margin: 20px;
    .main-show{
      height: 100px;
      width: 100%;
      display: flex;
      .left-show{
        width: 100px;
        height: 100px;
        border-radius: 5px;
        position: relative;
        div{
            position: absolute;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
        }
      }
      .right-show{
        width: 240px;
        height: 100px;
        p{
          margin: 11px;
        }
      }
    }
  }
  .comyjstate {
    display: block;
    float: left;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin: 0 auto;
    transform: translate(10px,4px);
  }
  .yjstate0 {
    background: #ff4949;
  }
  .yjstate1 {
    background: #42b983;
  }
  .img-error{
    width: 70px;
    height: 70px;
  }
</style>
