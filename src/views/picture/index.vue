<template>
  <div class="app-container">
    <div class="choose_bulk">
      <span>图片类型：</span>
      <el-select v-model="picType" clearable size="mini" class="select_change" placeholder="选择图片类型" @change="fetchData(1)">
        <el-option v-for="item in selectList" :key="item" :value="item" :label="item | picTypeFilter" />
      </el-select>
      <span>创建时间：</span>
      <el-date-picker
        v-model="createTime"
        class="select_change"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        value-format="timestamp"
        @change="fetchData(1)"
      />
      <el-button type="success" size="mini" @click="reset()">重置</el-button>
    </div>
    <div class="head-control">
      <el-button v-waves type="primary" size="mini" @click="add_pic()">添加图片
        <i class="el-icon-picture el-icon--right" />
      </el-button>
      <el-button v-waves class="rt" type="danger" size="mini" @click="show_del()">
        <i class="el-icon-delete-solid" />
      </el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ (scope.$index+1) + (table_page.currentPage - 1)*table_page.pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="150">
        <template slot-scope="scope">
          <el-image class="show-pic-in" :src="`http://static.mrwanmisshen.com${scope.row.type}${scope.row.pic_url}`">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片类型">
        <template slot-scope="scope">
          {{ scope.row.type | picTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="pic_url" label="图片名称" />
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <div v-if="scope.row.create_time">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time*1000 | formatdate('yyyy-MM-dd hh:mm:ss') }}</span>
          </div>
          <span v-else>/</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type !== '/typeList/'">用户图片</el-tag>
          <el-tag v-else-if="scope.row.type === '/typeList/' && noUseList.indexOf(scope.row.id) === -1" type="success">已使用</el-tag>
          <el-tag v-else type="danger">未使用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="change_pic(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="wdui_center_pag">
      <el-pagination
        class="mt14"
        background
        :current-page.sync="table_page.currentPage"
        :page-size.sync="table_page.pageSize"
        :page-sizes="[1, 10, 20, 30, 40]"
        layout="sizes ,prev, pager, next, jumper"
        :total="table_page.total"
        @current-change="fetchData"
        @size-change="fetchData(1)"
      />
    </div>
    <picture-change v-model="isShowChange" :send-pic="sendPic" @list_get="fetchData(table_page.currentPage)"/>
  </div>
</template>

<script>
import { typePicType, typePicList } from '@/api/picList'

export default {
    name: 'PictureIndex',
    components: {
        pictureChange: () => {
            return import('./change')
        }
    },
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
    data() {
        return {
            list: null,
            // 未使用数组
            noUseList: [],
            // 查询条件
            selectList: [],
            picType: null,
            createTime: [],
            // 分页
            table_page: {
                currentPage: 1,
                total: 1,
                pageSize: 10
            },
            // 修改弹窗
            isShowChange: false,
            sendPic: {}
        }
    },
    mounted() {
        this.fetchData(1)
        this.selectGet()
        this.checkGet()
    },
    methods: {

        /**
             * 判断是否使用请求数组
             */
        checkGet() {
            typePicList({
                choose: true
            }).then((response) => {
                const arr = []
                response.data.forEach((value) => {
                    arr.push(value.id)
                })
                this.noUseList = arr
            })
        },
        /**
             * 选择类型获取
             */
        selectGet() {
            typePicType().then((response) => {
                this.selectList = response.data
            })
        },

        /**
             * 表格获取
             */
        fetchData(page) {
            typePicList({
                page: page,
                pageSize: this.table_page.pageSize,
                type: this.picType ? this.picType : null,
                create_itime: this.createTime[0] ? this.createTime[0] / 1000 : null,
                create_etime: this.createTime[1] ? this.createTime[0] / 1000 : null
            }).then(response => {
                this.table_page.total = response.data.total
                this.table_page.currentPage = response.data.pageNum
                this.list = response.data.list
            })
        },
        /**
             * 重置表格
             */
        reset() {
            this.picType = null
            this.createTime = []
            this.fetchData(1)
        },

        change_pic(index) {
            this.sendPic = index
            this.isShowChange = true
        }
    }
}
</script>
<style lang="less" scoped>
  .show-pwd {
    cursor: pointer;
    user-select: none;
  }
  .select_change{
    margin: 0 15px 15px 0;
    max-width: 320px;
  }
  .wdui_center_pag{
    width: 100%;
    height: 60px;
    text-align: center;
  }
  .show-pic-in{
    height: auto;
    width: auto;
    max-width: 60%;
    max-height: 60%;
  }
  .head-control {
    display: inline-block;
    height: 40px;
    width: 100%;
  }
</style>
