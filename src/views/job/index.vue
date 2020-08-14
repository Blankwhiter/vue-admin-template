<template>
  <div class="app-container">

    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.beanName" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="fetchData()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()">批量删除</el-button>
        <el-button type="warning" @click="handle('','pause')">批量暂停</el-button>
        <el-button type="primary" @click="handle('','resume')">批量恢复</el-button>
        <el-button type="success" @click="handle('','run')">批量立即执行</el-button>
        <el-button @click="logHandle()">日志列表</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.beanName }}
        </template>
      </el-table-column>
      <el-table-column label="方法名" align="center">
        <template slot-scope="scope">
          {{ scope.row.methodName }}
        </template>
      </el-table-column>
      <el-table-column label="参数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cron表达式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cronExpression }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusColorFilter">{{ scope.row.status |statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template slot-scope="scope">
          <el-button size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteHandle( scope.row.jobId)">删除</el-button>
          <el-button size="mini" type="warning" @click="handle(scope.row.jobId,'pause')">暂停</el-button>
          <el-button size="mini" type="primary" @click="handle(scope.row.jobId,'resume')">恢复</el-button>
          <el-button size="mini" type="success" @click="handle(scope.row.jobId,'run')">立即执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 13px;float:right;">
      <el-pagination
        :current-page="query.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="fetchData" />
    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible" ref="log" />

  </div>
</template>

<script>
import AddOrUpdate from './add-or-update'
import Log from './log'
import {
  getList,
  runNow,
  deleteBatch,
  resumeNow,
  pauseNow
} from '@/api/job'

export default {
  filters: {
    statusColorFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        0: '运行中',
        1: '关闭'
      }
      return statusMap[status]
    }
  },
  components: {
    AddOrUpdate,
    Log
  },
  data() {
    return {
      list: null,
      listLoading: true,

      query: {
        page: 2,
        pageSize: 10,
        beanName: undefined
      },
      totalSize: 0,
      dataListSelections: [],
      addOrUpdateVisible: false,
      logVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.query.pageSize = val
      this.query.page = 1 // 每次改变每页多少条都会重置当前页码为1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList(this.query).then(response => {
        this.list = response.data.list
        this.totalSize = response.data.total
        console.log(this.list)
        this.listLoading = false
      })
    },
    handle(id, type) {
      var idsArr = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      var ids = {}
      ids.ids = idsArr.join(',')

      if (type === 'pause') {
        pauseNow(ids).then(res => {
          this.$message({
            message: '暂停成功!',
            type: 'success'
          })
          this.fetchData()
        }).catch(error => {
          this.$message({
            message: '暂停失败!',
            type: 'error'
          })
        })
      }
      if (type === 'resume') {
        resumeNow(ids).then(res => {
          this.$message({
            message: '恢复成功!',
            type: 'success'
          })
          this.fetchData()
        }).catch(error => {
          this.$message({
            message: '恢复失败!',
            type: 'error'
          })
        })
      }
      if (type === 'run') {
        runNow(ids).then(res => {
          this.$message({
            message: '立即执行成功!',
            type: 'success'
          })
          this.fetchData()
        }).catch(error => {
          this.$message({
            message: '立即执行失败!',
            type: 'error'
          })
        })
      }
    },
    selectionChange(val) {
      this.dataListSelections = val
    },
    addOrUpdateHandle(item) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(item)
      })
    },

    logHandle() {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    },
    deleteHandle(id) {
      var idsArr = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      var ids = {}
      ids.ids = idsArr.join(',')
      this.$confirm(`确定对[id=${idsArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBatch(ids).then(res => {
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
        })
        this.fetchData()
      }).catch(() => {})
    }
  }
}
</script>
