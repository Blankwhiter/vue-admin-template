<template>
  <div class="content">
    <el-row>
      <el-button type="primary"
                 @click="changeUrl">变换地址</el-button>
    </el-row>
    <el-row class="demo">
      <video-player class="video-player vjs-customer-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @waiting="onPlayerWaiting($event)"
                    @playing="onPlayerPlaying($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @canplay="onPlayerCanplay($event)"
                    @canplaythrough="onPlayerCanplaythrough($event)"
                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied"></video-player>
    </el-row>

  </div>
</template>

<script>
export default {
  name: "Video",
  data () {
    return {
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: true,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: "auto",
        language: "zh-CN",
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: "16:9",
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
        sources: [
          {
            type: "video/mp4",
            src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
            // "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
          },
        ],
        //使用本地文件
        //  sources: [{type:'video/mp4'||'video/ogg'||'video/webm'||'rtmp/flv',src: require("../../assets/test.mp4")}],
        //你的封面地址
        poster: "/static/logo.png",
        width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频无法播放，请稍后重试",
        contrlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDispaly: false,//是否显示剩余时间
          fullsreenTriggle: true, //全屏按钮
        },
      },
    };
  },
  methods: {
    //播放
    onPlayerPlay (player) {
      console.log("player play!", player);
    },
    //暂停
    onPlayerPause (player) {
      console.log("player pause!", player);
    },
    //播放等待中
    onPlayerWaiting (player) {
      console.log("player onPlayerWaiting!", player);
    },
    //视频播完回调
    onPlayerEnded (player) {
      console.log("player onPlayerEnded!", player);
    },
    //已开始播放回调
    onPlayerPlaying (player) {
      console.log("player onPlayerPlaying!", player);
    },
    //当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata (player) {
      console.log("player onPlayerLoadeddata!", player);
    },
    //当前播放位置发生变化时触发
    onPlayerTimeupdate (player) {
      // console.log("player onPlayerTimeupdate!", player);
    },
    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay (player) {
      console.log("player onPlayerCanplay!", player);
    },
    //选取播放进度条
    onPlayerCanplaythrough (player) {
      console.log("player onPlayerCanplaythrough!", player);
    },
    //视频播放状态改变
    playerStateChanged (player) {
      console.log("player playerStateChanged!", player);
    },
    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数
    playerReadied () {
      console.log("player ready")
    },
    changeUrl () {
      if (this.playerOptions.sources[0].src == "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm") {
        this.playerOptions.sources[0].src = "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
      } else {
        this.playerOptions.sources[0].src = "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
      }

    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.demo {
  display: inline-block;
  width: 500px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
</style>
