<template>
    <!--播放器组件-->
  <div class="playing">
    <!--展开的播放器-->
    <transition name="full">
      <div class="full-playing" v-show="fullScreen">
        <!--头部-->
        <div class="top">
          <mt-header :title="title">
            <router-link slot="left" to="">
              <mt-button icon="back" @click="back"></mt-button>
            </router-link>
          </mt-header>
          <div class="singer-name" v-html="currentSong.singer"></div>
        </div>

        <!--全屏模糊背景图-->
        <div><img :src="musicImage" alt="" class="bg-blur"></div>

        <!--中间cd图-->
        <div class="cd-content">
          <div class="cd-transition" ref="cdWarpper">
            <div class="img-warpper">
              <div :class="isPlay"><img :src="musicImage" alt="" class="song-img"></div>
            </div>
          </div>
        </div>

        <!--进度条-->
        <div class="progress">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper"><progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar></div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
        </div>


        <!--最下面控制播放小图标-->
        <div class="controler-icon">
          <!--播放模式-->
          <i class="iconfont" :class="iconMode" @click="changeMode"></i>
          <!--上一首-->
          <i class="iconfont icon-roundleftfill" @click="pre"></i>
          <!--播放和暂停-->
          <i class="iconfont" @click="togglePlaying" :class="playIcon"></i>
          <!--下一首-->
          <i class="iconfont icon-roundrightfill" @click="next"></i>
          <!--播放列表-->
          <i class="iconfont icon-swticonyinle2" @click="showPlayList"></i>
      </div>
      </div>
    </transition>


    <!--收起的底部播放器-->
    <transition name="mini">
      <div class="mini-playing"  @click="fullPlay">
        <div class='mini-process' :style='{"width":percent*100+"%"}' v-show='currentTime'></div>
        <!--歌曲图片-->
        <div class="song-img-mini"><img :src="musicImage" alt="" :class="isPlay"></div>
        <!--歌曲信息文字-->
        <div class="song-text-mini">
          <p class="song-name-mini" v-html="title"></p>
          <p class="song-singername-mini" v-html="currentSong.singer"></p>
        </div>
        <!--图标-->
        <div class="play-icon-mini">
          <i class="iconfont" @click.stop="togglePlaying" :class="playIcon"></i>
          <!--<i class="iconfont icon-roundrightfill" @click.stop="next"></i>-->
          <i class="iconfont icon-swticonyinle2" @click.stop="showPlayList"></i>
        </div>
      </div>
    </transition>

    <!--播放列表-->
    <play-list ref="playlist"></play-list>

    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  import {playMode} from 'common/js/config'
  import progressBar from 'common/playing/progress-bar'
  import {shuffle} from 'common/js/util.js'
  import {getVkey} from "data/vkey"
  import playList from 'components/playlist/playlist'
  import {playerMixin} from "common/js/mixin"

  export default {
    mixins:[playerMixin],

    components:{
      progressBar,
      playList
    },
      data(){
        return {
          songReady: false,
          currentTime: 0,
          radius: 32,
          currentLyric: null,
          currentLineNum: 0,
          currentShow: 'cd',
        }
      },

      computed:{
        ...mapGetters(['fullScreen','playing','currentIndex']),

        playIcon() {
          return this.playing ? 'icon-stop' : 'icon-playfill'
        },

        isPlay(){
          return this.playing ? 'play' : 'pause'
        },
        percent() {
          return this.currentTime / this.currentSong.duration
        },
        //获取播放模式图标
        iconMode(){
          return this.mode==playMode.sequence?'icon-liebiaoxunhuan': this.mode==playMode.loop?'icon-danquxunhuan':'icon-suijibofang'
        },
        title(){
          return this.currentSong.name?this.currentSong.name:'当前暂无播放歌曲'
        },
        musicImage(){
          return this.currentSong.image?this.currentSong.image:'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=3d59db104ba7d933aba5ec21cc22ba76/8718367adab44aed1c995fe0ba1c8701a08bfbdb.jpg'
        }
      },



      methods:{
        ...mapMutations({
          setPlayMode: 'SET_PLAY_MODE',
          setPlayList: 'SET_PLAYLIST'
        }),

        back(){
          //收起全屏
          this.setFullScreen(false)
        },

        //展开播放器
        fullPlay(){
          this.setFullScreen(true)
        },

        //播放状态切换
        togglePlaying() {
          this.setPlayingState(!this.playing)
        },

        //下一首
        next(){
          let index = this.currentIndex+1
          if (index==this.playlist.length){
            index=0
          }
          this.setCurrentIndex(index)

          if (!this.playing){
            this.togglePlaying()
          }
        },
        //上一首
        pre(){
          let index = this.currentIndex-1
          if (index===-1){
            index=this.playlist.length-1
          }
          this.setCurrentIndex(index)
          if (!this.playing){
            this.togglePlaying()
          }
        },

        ready() {
          this.songReady = true
        },
        error() {
          this.songReady = true
        },
        updateTime(e) {
          this.currentTime = e.target.currentTime
        },
        end() {
          if (this.mode === playMode.loop) {
            this.loop()
          } else {
            this.next()
          }
        },
        loop() {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          this.setPlayingState(true)
        },

        // 格式化时间
        format(interval) {
          interval = interval | 0
          const minute = interval / 60 | 0
          const second = this._pad(interval % 60)
          return `${minute}:${second}`
        },
        _pad(num, n = 2) {
          let len = num.toString().length
          while (len < n) {
            num = '0' + num
            len++
          }
          return num
        },

        //拖动进度条
        onProgressBarChange(percent) {
          const currentTime = this.currentSong.duration * percent
          this.$refs.audio.currentTime = currentTime
          if (!this.playing) {
            this.togglePlaying()
          }
        },



        //显示播放列表
        showPlayList(){
          this.$refs.playlist.show()
        }
      },


      watch: {
        currentSong(newSong, oldSong) {
          this.$nextTick(()=>{
            if (!newSong.id) {
              return
            }
            if (newSong.id === oldSong.id) {
              return
            }
            if (!this.playing){
              return
            }

            //获取要播放的歌曲地址
            getVkey(newSong).then(res => {
              const vkey = res.data.items[0].vkey
              const playSource = `http://dl.stream.qqmusic.qq.com/C400${
                newSong.mid
                }.m4a?vkey=${vkey}&guid=9970343703&uin=0&fromtag=66`
              newSong.url = playSource
              this.setPlayingState(true)
            })

            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.$refs.audio.play().then((a)=>{
              }).catch(error=>{
                alert('当前歌曲加载失败，正在播放下一首')
                this.next()
              })
            }, 1000)

          })
        },

        playing(newPlaying) {
          const audio = this.$refs.audio
          this.$nextTick(() => {
            newPlaying ? audio.play() : audio.pause()
          })
        }
      },
    }
</script>

<style scoped lang="stylus">

  .mint-header
    background-color: #ccc0
    color: #fff
    position: fixed
    top: 0
    z-index: 11
    width: 100%
    font-size: 18px
    height: 55px

  .singer-name
    text-align: center
    margin-top: 50px
    color: #fff
    font-size: 14px
    font-weight: 200

  .bg-blur
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    filter: blur(15px) brightness(50%)
    z-index: -1

  .img-warpper
    text-align: center
    margin-top: 10%
    .play
      animation: rotate 10s linear infinite
    .pause
      animation-play-state: paused

  .song-img
    width: 75%
    border-radius: 50%
    border: 8px solid hsla(0,0%,78%,.1)
    height: 270px

  .controler-icon
    display: flex
    position: absolute
    bottom: 30px
    width: 100%
    box-sizing: border-box
    padding: 0 10px
    i
      flex: 1
      color: #fff
      font-size: 35px
      text-align: center


  .song-img-mini
    margin-left: 5%
    img
      width: 45px
      height: 45px
      border-radius: 50%
      float: left
  .song-text-mini
    color: #000
    margin-left: 5%
    height: 93px
    .song-name-mini
      margin-top: 22px
    .song-singername-mini
      margin-top: -12px
      font-size: 14px
      color: #484848
    p
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      width: 150px

  .play-icon-mini
    color: #31c27c
    i
      font-size: 30px
    .icon-playfill
      position: absolute
      right: 15%
      bottom: 12px
    .icon-stop
      position: absolute
      right: 15%
      bottom: 12px
    .icon-swticonyinle2
      position: absolute
      right: 2%
      bottom: 12px

  .progress-wrapper
    display: flex
    align-items: center
    width: 80%
    position: absolute
    bottom: 20%
    left: 10%
    .time
      color: #fff
      font-size: 12px
      flex: 0 0 30px
      line-height: 30px
      width: 30px
      &.time-l
        text-align: left
      &.time-r
        text-align: right
    .progress-bar-wrapper
      flex: 1


  .full-playing
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 223
    width: 100%
    background: #222
    //动画
    &.full-enter-active, &.full-leave-active
      transition: all 0.4s
      .top, .controler-icon
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.full-enter, &.full-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .controler-icon
        transform: translate3d(0, 100px, 0)

  .mini-playing
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 44
    width: 100%
    height: 60px
    background: #fafafa
    z-index: 222
    border-top: solid 1px #ccc
    .mini-process
      position: absolute
      height: 1px
      background: #31c27c
      top: 0
    //动画
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .play
      animation: rotate 10s linear infinite
    .pause
      animation-play-state: paused



  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

</style>
