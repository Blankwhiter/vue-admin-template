<template>
  <div class="dashboard-container">
    <h3>基于vue-element-templete框架 添加常用功能</h3>
    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp" :color="activity.color">
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>

  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      activities: [{
        content: '加入定时器配置界面',
        timestamp: '2020-08-14',
        color: '#0bbd87'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    .el-carousel__item h3 {
      color: #55ffff;
      font-size: 24px;
      opacity: 0.75;
      line-height: 150px;
      margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
  }
</style>
