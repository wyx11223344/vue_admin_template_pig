<template>
  <div class="app-container">
    <div class="choose_bulk">
      <span>验证状态：</span>
      <el-select clearable v-model="checkState" size="mini" class="select_change" placeholder="验证状态" @change="fetchData(1)">
        <el-option value="1" label="已验证" />
        <el-option value="0" label="未验证" />
      </el-select>
      <span>注册时间：</span>
      <el-date-picker
        v-model="in_time"
        class="select_change"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        value-format="timestamp"
        @change="fetchData(1)"
      />
      <span>登录时间：</span>
      <el-date-picker
        v-model="last_time"
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
    <el-table
      v-loading="listLoading"
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.show">{{ scope.row.password }}</span>
          <span v-show="!scope.row.show">********</span>
          <span class="rt show-pwd" @click="passShow(scope.$index)">
            <svg-icon :icon-class="scope.row.show ? 'eye' : 'eye-open'" />
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time*1000 | formatdate('yyyy-MM-dd hh:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登录时间">
        <template slot-scope="scope">
          <div v-if="scope.row.last_time">
            <i class="el-icon-time" />
            <span>{{ scope.row.last_time*1000 | formatdate('yyyy-MM-dd hh:mm:ss') }}</span>
          </div>
          <span v-else>/</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="激活状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 1" type="success">已激活</el-tag>
          <el-tag v-else-if="scope.row.state === 0 && scope.row.create_time + 1800 < now_data" type="danger">失效</el-tag>
          <el-tag v-else type="warning">未激活</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录ip">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
          <a v-if="scope.row.ip" class="rt" target="_blank" :href="'https://labs.ipip.net/location/ip?ip='+scope.row.ip"><svg-icon icon-class="map" /></a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="激活状态" width="170">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="change_user(scope.row)">修改</el-button>
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
    <change-user @get_list="fetchData(1)" :sendUser="sendUser" :is-show="showChange" @close="showChange = false"/>
  </div>
</template>

<script>
import { userList } from '@/api/userDate'

export default {
    name: 'UserTableIndex',
    components: {
        changeUser: () => {
            return import('./change')
        }
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            list: null,
            listLoading: true,
            now_data: Date.parse(new Date()) / 1000,
            // 查询条件
            checkState: null,
            in_time: [],
            last_time: [],
            // 分页
            table_page: {
                currentPage: 1,
                total: 1,
                pageSize: 10
            },
            // 修改弹窗
            showChange: false,
            sendUser: {}
        }
    },
    created() {
        this.fetchData(1)
    },
    methods: {
        /**
         * 表格获取
         */
        fetchData(page) {
            this.listLoading = true
            userList({
                page: page,
                pageSize: this.table_page.pageSize,
                state: this.checkState,
                in_stime: this.in_time[0] ? this.in_time[0] / 1000 : null,
                in_etime: this.in_time[1] ? this.in_time[1] / 1000 : null,
                last_stime: this.last_time[0] ? this.last_time[0] / 1000 : null,
                last_etime: this.last_time[1] ? this.last_time[1] / 1000 : null
            }).then(response => {
                this.list = response.data.list
                this.listLoading = false
                this.table_page.total = response.data.total
                this.table_page.pages = response.data.pages
            })
        },
        /**
         * 视图渲染
         */
        passShow(index) {
            this.$set(this.list[index], 'show', !this.list[index].show)
        },
        /**
         * 重置表格
         */
        reset() {
            this.checkState = null
            this.in_time = []
            this.last_time = []
            this.fetchData(1)
        },
        /**
         * 用户修改
         */
        change_user(index) {
            this.sendUser = index
            this.showChange = true
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
</style>
