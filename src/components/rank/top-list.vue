<template>
    <!--排行榜列表-->
  <transition name="slide">
    <list :title="title" :bgImage="bgImage" :songs="songs"></list>
  </transition>
</template>

<script>
  import list from 'components/list/list'
  import {mapGetters} from 'vuex'
  import {SUCCESS} from "../../data/config"
  import {createSong} from "common/js/song"
  import {getRankList} from "data/rank";

  export default {

      data(){
        return {
          songs:[]
        }
      },
      components:{
        list
      },

      computed:{
        ...mapGetters(['topList']),

        title(){
          return this.topList.topTitle
        },
        bgImage(){
          if (this.songs.length){
            return this.songs[0].image
          }
          return
        }
      },

      created(){
        this.getTopListSongs(this.topList.id)
      },


      methods:{

        //获取排行榜的歌曲列表
        getTopListSongs(topid){

          if (!this.topList.id) {
            this.$router.push('/rank')
            return
          }
          getRankList(this.topList.id).then((res) => {
            if (res.code === SUCCESS) {
              this.songs = this.initSongs(res.songlist)
            }
          })
        },

        //初始化歌曲数据
        initSongs(list) {
          let ret = []
          list.forEach((item) => {
            let musicData = item.data
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData))
            }
          })
          return ret
        },

      }
    }
</script>

<style lang="stylus">

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
