<template>
  <!--播放列表组件-->
  <transition name="list-fade">
    <div class="playlist" v-show="isShow" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            <span class="modeName">{{modeName}}</span>
            <span class="text">播放列表（共 {{playlist.length}} 首歌）</span>
            <span class="clear" @click="clearPlayList" ><i class="iconfont icon-delete"></i></span>
          </h1>
        </div>

        <!--歌曲列表-->
        <div ref="listContent" class="list-content">
          <transition-group name="list" tag="ul">
            <li :key="item.id" ref="listItem" class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
              <!--图标-->
              <i class="iconfont icon-video" :class="getCurrentIcon(item)"></i>
              <!--歌曲名称-->
              <span class="text">{{item.name}} - <span style="color: rgba(255,255,255,0.5)">{{item.singer}}</span></span>
              <!--删除-->
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="iconfont icon-close"></i>
              </span>
            </li>
          </transition-group>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

  import {mapActions} from 'vuex'
  import {playMode} from "common/js/config"
  import {playerMixin} from "common/js/mixin"

  export default {
    mixins:[playerMixin],
    data() {
      return {
        isShow: false
      }
    },
    computed: {
      modeName(){
        return this.mode===playMode.sequence?'顺序播放':this.mode===playMode.random?'随机播放':'单曲播放'
      }
    },
    methods: {
      ...mapActions(['deleteSong','deleteSongList']),

      //显示列表
      show() {
        this.isShow = true
      },
      //隐藏列表
      hide() {
        this.isShow = false
      },
      //获取当时播放歌曲icon
      getCurrentIcon(item){
        if (item.id==this.currentSong.id){
          return 'current'
        }
        return ''
      },
      //播放当前点击的歌曲
      selectItem(item,index){
        //如果当前播放模式是随机播放，查找此歌曲在播放列表的索引
        if (this.mode===playMode.sequence){
          index=this.playlist.findIndex((song)=>{
            return song.id===item.id
          })
        }
        console.log(item,'item')
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      //从当前播放列表删除当前点击的歌曲
      deleteItem(item){
        this.deleteSong(item)
        if (!this.playlist.length){
          //播放列表没有歌曲时关闭播放器
          this.setFullScreen(false)
        }
      },
      //清空播放列表
      clearPlayList(){
        this.$messagebox.confirm('',{
          message: '清空播放列表？',
          title: '提示',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(action=>{
          this.deleteSongList()
          //关闭播放器
          this.setFullScreen(false)
        }).catch(err => {   //取消的回调
        });
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 224
    background-color: rgba(0, 0, 0, 0.3)
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: #333
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .iconfont
            font-size: 25px
            margin-right: 3px
            color: rgba(255,255,255,0.5)
          .modeName
            font-size: 16px
            color: #fff
            margin-right: 20px
          .text
            flex: 1
            font-size: 16px
            color: rgba(255, 255, 255, 0.5)
          .clear
            position: relative
            margin-right: -7px
            &:before
              content: ''
              position: absolute
              top: -10px
              left: -10px
              right: -10px
              bottom: -10px
            .icon-clear
              font-size: 14px
              color: rgba(255, 255, 255, 0.3)
      .list-content
        max-height: 240px
        overflow: scroll
        .item
          display: flex
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          border-top: none
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .icon-video
            flex: 0 0 20px
            color: rgba(255,255,255,0.3)
            font-size: 22px
            margin-right: 16px
          .current
            flex: 0 0 20px
            width: 20px
            color: #31c27c
          .text
            flex: 1
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
            font-size: 14px
            color: #fff
          .like
            position: relative
            &:before
              content: ''
              position: absolute
              top: -10px
              left: -10px
              right: -10px
              bottom: -10px
            margin-right: 15px
            font-size: 12px
            color: #ffcd32
            .icon-favorite
              color: #d93f30
          .delete
            position: relative
            &:before
              content: ''
              position: absolute
              top: -10px
              left: -10px
              right: -10px
              bottom: -10px
            font-size: 12px
            color: #fff
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid rgba(255, 255, 255, 0.5)
          border-radius: 100px
          color: rgba(255, 255, 255, 0.5)
          .icon-add
            margin-right: 5px
            font-size: 10px
          .text
            font-size: 12px
      .list-close
        text-align: center
        line-height: 50px
        background: #222
        font-size: 16px
        color: rgba(255, 255, 255, 0.5)
</style>
