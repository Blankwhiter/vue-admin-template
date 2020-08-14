<template>
  <el-dialog :title="!dataForm.jobId ? '新增' : '修改'" :close-on-click-modal="true" :visible.sync="visible">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="bean名称" prop="beanName"><el-input v-model="dataForm.beanName" placeholder="spring bean名称, 如: testTask" /></el-form-item>
      <el-form-item label="方法名称" prop="methodName"><el-input v-model="dataForm.methodName" placeholder="方法名称, 如: testRun" /></el-form-item>
      <el-form-item label="参数" prop="params"><el-input v-model="dataForm.params" placeholder="参数" /></el-form-item>

      <el-form-item style="margin-top: -10px; margin-bottom:0px;">
        <cron v-if="showCronBox" v-model="dataForm.cronExpression" />
        <el-tooltip
          class="item"
          effect="dark"
          content=" (1）*：表示匹配该域的任意值。假如在Minutes域使用*, 即表示每分钟都会触发事件。
               　  （2）?：只能用在DayofMonth和DayofWeek两个域。
                　 （3）-：表示范围。例如在Minutes域使用5-20，表示从5分到20分钟每分钟触发一次
                 　（4）/：表示起始时间开始触发，然后每隔固定时间触发一次。例如在Minutes域使用5/20,则意味着5分钟触发一次，而25，45等分别触发一次.
                 　（5）,：表示列出枚举值。例如：在Minutes域使用5,20，则意味着在5和20分每分钟触发一次。
                 　（6）L：表示最后，只能出现在DayofWeek和DayofMonth域。如果在DayofWeek域使用5L,意味着在最后的一个星期四触发。
               　　（7）W:表示有效工作日(周一到周五),只能出现在DayofMonth域，系统将在离指定日期的最近的有效工作日触发事件。
               　　（8）LW:这两个字符可以连用，表示在某个月最后一个工作日，即最后一个星期五。
               　　（9）#:用于确定每个月第几个星期几，只能出现在DayofMonth域。例如在4#2，表示某月的第二个星期三。"
          placement="top"
        >
          <span style="color: #E6A23C; font-size: 12px;">corn从左到右（用空格隔开）：秒 分 小时 月份中的日期 月份 星期中的日期 年份</span>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="Cron">
        <el-input v-model="dataForm.cronExpression" auto-complete="off" placeholder="如: 0 0 12 * * ? *">
          <el-button v-if="!showCronBox" slot="append" icon="el-icon-arrow-up" title="打开图形配置" @click="showCronBox = true" />
          <el-button v-else slot="append" icon="el-icon-arrow-down" title="关闭图形配置" @click="showCronBox = false" />
          <el-button slot="prepend" @click="previewShow"> {{previewVisible==false?'预览':'收起'}}</el-button>
        </el-input>
      </el-form-item>

      <el-form-item style="margin-top: -10px; margin-bottom:10px;">
        <!--  预览 -->
        <preview v-if="previewVisible" ref="preview" />
      </el-form-item>

      <el-form-item label="备注" prop="remark"><el-input v-model="dataForm.remark" placeholder="备注" /></el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveOrUpdate } from '@/api/job'
import cron from '../../components/cron.vue'
import preview from './preview.vue'
export default {
  components: {
    cron,
    preview
  },
  data() {
    return {
      visible: false,
      showCronBox: false,
      previewVisible: false,
      dataForm: {
        jobId: '',
        beanName: '',
        methodName: '',
        params: '',
        cronExpression: '',
        remark: '',
        status: 0
      },
      dataRule: {
        beanName: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        methodName: [
          {
            required: true,
            message: '方法名不能为空',
            trigger: 'blur'
          }
        ],
        cronExpression: [
          {
            required: true,
            message: 'cron表达式不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.$nextTick(() => {
        this.showCronBox = false
        this.previewVisible = false
        if (data) {
          this.dataForm = data
        } else {
          this.dataForm = {
            jobId: '',
            beanName: '',
            methodName: '',
            params: '',
            cronExpression: '',
            remark: '',
            status: 0
          }
        }

        console.log('dataForm ', this.dataForm)
      })
    },
    previewShow() {
      if(this.previewVisible){
           this.previewVisible =   false
           return
      }
      if (!this.dataForm.cronExpression) {
        this.$message({
          message: '时间表达式为空',
          type: 'error',
          duration: 1000
        })
        return
      }
      this.previewVisible =   true
      this.$nextTick(() => {
        this.$refs.preview.init(this.dataForm)
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          saveOrUpdate({
            jobId: this.dataForm.jobId || undefined,
            beanName: this.dataForm.beanName,
            methodName: this.dataForm.methodName,
            params: this.dataForm.params,
            cronExpression: this.dataForm.cronExpression,
            remark: this.dataForm.remark,
            status: !this.dataForm.jobId ? undefined : this.dataForm.status
          }).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('fetchData')
              }
            })
          })
        }
      })
    }
  }
}
</script>
