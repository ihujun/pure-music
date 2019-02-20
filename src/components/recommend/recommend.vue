<template>
  <!--推荐页面-->
  <div class="recommend">
    <div class="recommend-content">
      <!--轮播图-->
      <div class="slider-swiper" v-if="slider.length">
        <slider>
          <div class="slider-swiper">
            <mt-swipe :auto="2000">
              <mt-swipe-item v-for="(slide,index) in slider" :key="index">
                <a :href="slide.linkUrl" ><img :src="slide.picUrl"></a>
              </mt-swipe-item>
            </mt-swipe>
          </div>
        </slider>
      </div>


      <!--歌单-->
      <div class="recommend-song-list">
        <song-list>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="(songList,index) in hotSongList" class="item" @click="viewSongList(songList)" :key="">
                <div class="icon">
                  <img v-lazy="songList.picUrl" alt="" width="60" height="60">
                </div>
                <div class="text">
                  <span class="name" v-text="songList.songListDesc"></span>
                  <span class="desc" v-text="songList.songListAuthor"></span>
                </div>
              </li>
            </ul>
          </div>

          <div class="song-list-loading" v-show="!hotSongList.length">
            <mt-spinner type="fading-circle"></mt-spinner><span style="color: #666">&nbsp;&nbsp;加载中...</span>
          </div>
        </song-list>
      </div>
    </div>

    <!--歌单列表-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'common/recommend/slider'
  import SongList from 'common/recommend/songList'
  import {SUCCESS} from "data/config"
  import {getRecommend,getRecommendNewSong} from "data/recommmend"
  import {getRankList} from "data/rank"
  import {mapMutations} from 'vuex'
  export default {
    components:{
      Slider,
      SongList
    },

    data(){
      return {
        //存放推荐轮播图数据
        slider:[],
        //存放推荐歌单数据
        hotSongList:[]
      }
    },

    created() {
      //获取轮播图数据
      this.getSlider()

      // 获取推荐页面歌单
      setTimeout(()=>{
        this.getHotSongList()
      },1000)

      this.getTopList()

    },


    methods:{
      ...mapMutations({
        setDisc: 'SET_DISC'
      }),

      getTopList(){
        getRankList(4).then((res) => {
          if (res.code === SUCCESS) {
            console.log(res.songlist)
          }
        })
      },



      //获取轮播图数据
      getSlider(){
        getRecommend().then(res => {
          this.slider=res.data.slider
        })
      },

      //获取推荐页面歌单
      getHotSongList(){
        getRecommend().then(res => {
          this.hotSongList=res.data.songList
        })
      },

      //显示歌单列表
      viewSongList(songList){
        //跳转路由
        this.$router.push({
          path: `/recommend/${songList.id}`
        })
        this.setDisc(songList)
      },
      //直接跳转到qq音乐歌单
      viewSongListqq(songList){
        window.open(`https://y.qq.com/n/yqq/playsquare/${songList.id}.html`)
      },
    }
  }

</script>

<style scoped lang="stylus">

  .loading-container
    position: absolute
    width: 96%
    top: 54%
    transform: translateY(-50%)

  .slider-swiper
    height:150px
    a
      display: block
      width: 100%
      overflow: hidden
      text-decoration: none
    img
      display: block
      width: 100%

  .mint-swipe-indicators
    .is-active
      background: #fff


  .recommend-list
    .list-title
      //height: 50px
      line-height: 30px
      text-align: center
      font-size: 16px
      color: #31c27c
    .item
      display: flex
      box-sizing: border-box
      align-items: center
      //padding: 0 20px 20px 20px
      padding-left: 20px
      overflow: hidden
      margin-bottom: 3%
      background: #fff
      .icon
        flex: 0 0 60px
        width: 60px
        padding-right: 20px
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 30px
        //overflow: hidden
        font-size: 0.8em
        .name
          font-weight: bold
          font-size: 14px
          color: #000
          position: relative
          bottom: 5px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          width: 80%
        .desc
          //color: #5f5f5f
          color: #999
          position: relative
          top: 5px
    ul
      margin-left: -48px

  .song-list-loading
    align-items: center
    display: flex
    justify-content: center
    position: absolute
    z-index: 11
    left: 0
    right: 0
    bottom: 0
    top: 25%
</style>
