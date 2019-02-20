<template>
    <!--歌手详情页-->
  <transition name="slide">
    <list :title="title" :bgImage="bgImage" :songs="songs"></list>
  </transition>

</template>

<script>
    import {mapGetters} from 'vuex'
    import {SUCCESS} from "../../data/config";
    import list from 'components/list/list'
    import {createSong} from "common/js/song"
    import {getSingerDetail} from "data/singer";

    export default {

      data() {
        return {
          //当前歌手的歌曲列表
          songs: []
        }
      },

      computed:{
        ...mapGetters(['singer']),

        title(){
          return this.singer.name
        },

        bgImage() {
          return this.singer.avatar
        },
      },
      components:{
        list
      },

      created(){
        this.getDetail(this.singer.id)
      },

      methods:{
        //获取歌手数据
        getDetail(singerId){
          if (!singerId){
            this.$router.push('/singer')
            return
          }

          getSingerDetail(singerId).then((res) => {
            if (res.code === SUCCESS) {
              this.songs = this.initSongs(res.data.list)
            }
          })
        },

        //处理歌手数据
        initSongs(list) {
          let ret = []
          list.forEach((item) => {
            let {musicData} = item
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData))
            }
          })
          return ret
        },


      }
    }
</script>

<style scoped lang="stylus">

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
