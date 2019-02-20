import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playerMixin = {
  computed:{
    ...mapGetters(['fullScreen','playlist','currentSong','playing','currentIndex','mode','sequenceList']),

    //获取播放模式图标
    iconMode(){
      return this.mode==playMode.sequence?'icon-liebiaoxunhuan': this.mode==playMode.loop?'icon-danquxunhuan':'icon-suijibofang'
    }
  },

  methods:{
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAY_LIST'
    }),


    // 改变播放模式
    changeMode(){
      let mode = (this.mode+1)%3
      this.setPlayMode(mode)
      let list = null
      if (mode==playMode.random){
        //随机播放
        list=shuffle(this.sequenceList)
      }else{
        // 列表循环
        list=this.sequenceList
      }

      // 改变当时播放列表内容
      this.setPlayList(list)

      this.resetCurrentIndex(list)
    },

    // 重新设置当前播放歌曲的索引
    resetCurrentIndex(list){
      let index = list.findIndex((item)=>{
        return item.id==this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
  }
}
