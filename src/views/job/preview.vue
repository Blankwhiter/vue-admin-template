<template>
  <!-- <el-dialog :title="预览" :close-on-click-modal="true" :visible.sync="visible"> -->
  <div class="cron">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" @keyup.enter.native="previewFormSubmit()">
      <el-form-item label="启动时间" prop="dateStr">
        <el-date-picker
          v-model="time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          :picker-options="pickerBeginDateBefore"
          @change="change"
        />
      </el-form-item>
      <el-form-item label="执行时刻"><el-input v-model="textarea" type="textarea" :rows="6" placeholder="定时器执行时刻" /></el-form-item>
    </el-form>
  </div>

  <!-- </el-dialog> -->
</template>

<script>
import { preview } from '@/api/job'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        jobId: '',
        dateStr: '',
        cron: ''
      },
      dataRule: {},
      time: '',
      textarea: '',
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      }
    }
  },
  watch: {
    dataForm: {
      handler(val, oldVal) {
        console.log('b.c: ' + val.cronExpression)
        if (val.cronExpression) {
          this.$set(this.dataForm, 'cronExpression', val.cronExpression)
          this.previewFormSubmit()
        }
      },
      deep: true
    }

  },
  methods: {
    init(data) {
      this.visible = true
      this.time = ''
      this.textarea = ''
      this.$nextTick(() => {
        if (data) {
          this.dataForm = data
          this.time = new Date()
          this.dataForm.dateStr = this.time
          this.previewFormSubmit()
        } else {
          this.dataForm = {
            jobId: '',
            dateStr: '',
            cron: ''
          }
        }
      })
    },
    change(item) {
      console.log(item)
      this.$set(this.dataForm, 'dateStr', item)
      this.previewFormSubmit()
    },
    // 表单提交
    previewFormSubmit() {
      preview({
        id: this.dataForm.jobId || undefined,
        dateStr: this.dateFtt('yyyy-MM-dd hh:mm:ss', this.dataForm.dateStr),
        cron: this.dataForm.cronExpression
      }).then(res => {
        console.log(res)
        this.textarea = ''
        res.data.forEach(item => {
          this.textarea += item + '\n'
        })
      })
    },
    /** ************************************时间格式化处理************************************/
    dateFtt(fmt, date) {
      if (!fmt && !date) {
        return ''
      }
      if (!(date instanceof Date)) {
        return date
      }
      // author: meizz
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
      }
      return fmt
    }
  }
}
</script>
<style>
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
