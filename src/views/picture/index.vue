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
      <el-button v-waves class="lf" type="primary" size="mini" @click="add_pic()">添加图片
        <i class="el-icon-picture el-icon--right" />
      </el-button>
      <div v-shakes:[shakes]="sendObject" class="ml20 top_tip lf">回收站的图片删除7天后自动删除，请注意时间</div>
      <el-button v-waves class="rt" type="danger" size="mini" @click="del_change()">
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
      <el-table-column v-if="!isDel" align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="change_pic(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="del_pic(scope.row,true)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="isDel" align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" plain @click="del_pic(scope.row,false)">恢复</el-button>
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
    <picture-change v-model="isShowChange" :add-new="isAdd" :send-pic="sendPic" @list_get="fetchData(table_page.currentPage)" />
  </div>
</template>

<script>
import { typePicType, typePicList, typePicDel } from '@/api/picList'

export default {
    name: 'PictureIndex',
    components: {
        pictureChange: () => {
            return import('./change')
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
            sendPic: {},
            // 判断是否新增
            isAdd: false,
            // 判断是否查看回收站
            isDel: false,
            // 提示动画
            shakes: 1,
            sendObject: {
                class: 'rubberBand'
            }
        }
    },
    mounted() {
        this.fetchData(1)
        this.selectGet()
        this.checkGet()
        this.shakesRun()
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
                create_etime: this.createTime[1] ? this.createTime[0] / 1000 : null,
                isDel: this.isDel
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
            this.isDel = false
            this.fetchData(1)
        },

        /**
         * 修改弹窗打开
         * @param index
         */
        change_pic(index) {
            this.sendPic = index
            this.isAdd = false
            this.isShowChange = true
        },

        /**
         * 新增弹窗打开
         */
        add_pic() {
            this.sendPic = {}
            this.isAdd = true
            this.isShowChange = true
        },

        /**
         * 列表类型切换
         */
        del_change() {
            this.isDel = !this.isDel
            this.fetchData(1)
        },

        /**
         * shakes动画循环触发
         */
        shakesRun() {
            setTimeout(() => {
                this.shakes += 1
                this.shakesRun()
            }, 5000)
        },

        del_pic(index, del) {
            this.$confirm('您即将修改该图片, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const param = {
                    id: index.id,
                    del: del
                }
                typePicDel(param).then((response) => {
                    if (response.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        this.fetchData(this.table_page.currentPage)
                    } else {
                        this.$message.error('修改失败请检查网络后重试')
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });
            });
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
    position: relative;
    height: 40px;
    width: 100%;
  }
  .top_tip{
    position: absolute;
    margin: auto;
    color: #ff7476;
    left: 0;
    right: 0;
    top: 0;
    width: 330px;
    height: 29px;
    line-height: 29px;
  }
</style>
