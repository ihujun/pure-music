<template>
  <!--歌单的歌曲列表-->
  <transition name="slide">
    <List :title="title" :bgImage="bgImage" :songs="songs"></List>
  </transition>
</template>

<script>
  import List from 'components/list/list'
  import {mapGetters} from 'vuex'
  import {SUCCESS} from "../../data/config"
  import {createSong} from "common/js/song"
  import {getRecommendDisc} from "data/recommmend";

  export default {

    data(){
      return {
        songs:[]
      }
    },

    computed:{
      ...mapGetters(['disc']),

      title(){
        return this.disc.songListDesc
      },
      bgImage(){
        return this.disc.picUrl
      }
    },

    components:{
      List
    },

    mounted(){
      this.getDisc()
    },

    methods:{


      //获取歌单的歌曲列表
      getDisc(){
        if (!this.disc.id) {
          this.$router.push('/recommend')
          return
        }

        getRecommendDisc(this.disc.id).then(res=>{
          if (res.code==SUCCESS){
            this.songs = this.initSongs(res.cdlist[0].songlist)
          }
        })
      },

      initSongs(list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albummid) {
              ret.push(createSong(item))
          }
        })
        return ret
      },

    }
  }
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
