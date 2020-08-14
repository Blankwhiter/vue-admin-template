<template>
  <el-dialog title="日志列表" :close-on-click-modal="true" :visible.sync="visible" width="75%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="任务ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border height="460" style="width: 100%;">
      <el-table-column prop="logId" header-align="center" align="center" width="80" label="日志ID" />
      <el-table-column prop="jobId" header-align="center" align="center" width="80" label="任务ID" />
      <el-table-column prop="beanName" header-align="center" align="center" label="bean名称" />
      <el-table-column prop="methodName" header-align="center" align="center" label="方法名称" />
      <el-table-column prop="params" header-align="center" align="center" label="参数" />
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">成功</el-tag>
          <el-tag v-else size="small" type="danger" style="cursor: pointer;" @click.native="showErrorInfo(scope.row.logId)">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="times" header-align="center" align="center" label="耗时(单位: 毫秒)" />
      <el-table-column prop="createTime" header-align="center" align="center" width="180" label="执行时间" />
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </el-dialog>
</template>

<script>
import {
  getLogList
} from '@/api/job'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: undefined
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  methods: {
    init() {
      this.visible = true
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getLogList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'jobId': this.dataForm.id
      }).then(({
        data
      }) => {
        console.log('data ', data)
        this.dataList = data.list
        this.totalPage = data.total

        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 失败信息
    showErrorInfo(id) {
      this.$http({
        url: this.$http.adornUrl(`/sys/scheduleLog/info/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.$alert(data.log.error)
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
