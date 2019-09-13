<!--
    Created by WYX
    Time 2019/8/26
-->
<template lang="pug">
  .app-container
    .head-control
      el-button(type="primary" size="mini" v-waves @click="add_show()") 新增类型
        i(class="el-icon-plus el-icon--right")
      el-button(type="danger" size="mini" v-waves v-show="type === 1" @click="view_create_get(0)") 回收站
        i(class="el-icon-delete el-icon--right")
      el-button(type="danger" size="mini" v-waves v-show="type === 0" @click="view_create_get(1)") 正在使用
        i(class="el-icon-delete el-icon--right")
      span.rt 收入框颜色：
        .show-type-div.rt
    transition(name="slide")
      .card-box(v-show="!typeChanging")
        one-each-card(
          v-for="(item,index) in typeList"
          :key="index"
          :sendObject="item"
          :type="type"
          @list_get="view_create_get(type)"
          @change="show_change")
        div(v-if="typeList.length === 0")
          img(src="../../../assets/image/jump_man.gif" height="600" width="800")
          p.big_font 暂时没有数据哦
    change-d-ia(v-model="changeShow" :oneObject="oneObject" :type="diaType" @list_get="view_create_get(type)")
</template>

<script>
import { typeListGet } from '@/api/typeList'
export default {
    name: 'TypeListCardIndex',
    components: {
        oneEachCard: () => {
            return import('./eachCard')
        },
        changeDIa: () => {
            return import('./changeDIa')
        }
    },
    data() {
        return {
            // 初始化不展示过渡
            isFirst: true,
            // 类型列表获取
            typeList: [],
            // 查询数据类型
            type: 1,
            typeChanging: false,
            // 展示修改抽屉
            changeShow: false,
            oneObject: {},
            diaType: false
        }
    },
    mounted() {
        this.view_create_get(this.type)
    },
    methods: {
        view_create_get(index) {
            typeListGet({
                type: index
            }).then((response) => {
                if (response.code === 200) {
                    if (!this.isFirst) {
                        this.typeChanging = true
                        setTimeout(() => {
                            this.typeList = response.data
                            this.typeChanging = false
                            this.type = index
                        }, 830)
                    } else {
                        this.typeList = response.data
                        this.isFirst = false
                    }
                } else {
                    this.$message.error(response.msg)
                }
            })
        },

        /**
         * 修改展开抽屉
         * @param index
         */
        show_change(index) {
            this.oneObject = index
            this.diaType = true
            this.changeShow = true
        },

        /**
         * 新增展开抽屉
         */
        add_show() {
            this.oneObject = {}
            this.diaType = false
            this.changeShow = true
        }

    }
}
</script>

<style scoped lang="less">
  .head-control{
    display: inline-block;
    height: 40px;
    width: 100%;
    span{
      color: @base-font-color;
      .show-type-div{
        width: 30px;
        height: 10px;
        background-color: #fceaee;
        margin: 5px 5px;
      }
    }
  }
  .card-box{
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .big_font{
    color: #d1d1d1;
    text-align: center;
    font-weight: bold;
    font-size: 34px;
    margin: 0;
  }
  .slide-enter-active{
    transition:all .83s;
  }
  .slide-leave-active{
    transition:all .83s;
  }
  .slide-enter{
    transform: translateX(10%);
    opacity: 0;
  }
  .slide-leave-to{
    transform: translateX(-10%);
    opacity: 0;
  }
  .svg_show{
    width: 100px;
    height: 100px;
    transform: translate(5px,7px);
  }
</style>
