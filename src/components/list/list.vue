<template>
  <!--列表展示页面-->
  <div class="list" ref="list">
    <!--头部-->
      <mt-header :title="title">
        <router-link slot="left" to="">
          <mt-button icon="back" @click="$router.go(-1)"></mt-button>
        </router-link>
      </mt-header>


      <!--列表图片-->
      <div class="bg-image" ref="bgImage" :style="bgImg">
        <div class="play-wrapper">
        </div>
      </div>

    <div class="list-content" ref="listcontent">
        <!--列表中间nav-->
        <!--<mt-navbar v-model="active">-->
          <!--<mt-tab-item id="1">歌曲</mt-tab-item>-->
          <!--<mt-tab-item id="2">详情</mt-tab-item>-->
        <!--</mt-navbar>-->

        <!--列表内容-->
        <mt-tab-container v-model="active" :swipeable="true">
          <mt-tab-container-item id="1">
            <ul>
              <!--播放全部-->
              <li @click="Random" v-show="songs.length>0">
                <a class="mint-cell">
                  <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                      <a>
                        <img src="../../base/img/play.png" alt="">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">随机播放全部</font>
                        </font>
                      </a>
                    </div>
                  </div>
                </a>
              </li>
              <!--歌曲列表-->
              <li v-for="(song,index) in songs" :key="index" @click="playingSong(song,index)">
                <a class="mint-cell">
                  <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                      <div class="song-num">
                        <span v-if="index<3" style="color: rgb(255, 69, 0)">{{index+1}}</span>
                        <span v-else>{{index}}</span>
                      </div>
                      <div class="song">
                        <span class="mint-cell-text">{{song.name}}</span>
                        <span class="mint-cell-label">{{song.singer}}</span>
                      </div>
                    </div>
                    <i class="mint-cell-allow-right"></i>

                  </div>
                </a>
              </li>
            </ul>
          </mt-tab-container-item>

        </mt-tab-container>
      </div>
    <div class="song-list-loading" v-show="!songs.length>0">
      <mt-spinner type="fading-circle"></mt-spinner><span style="color: #666">&nbsp;&nbsp;加载中...</span>
    </div>

  </div>
</template>

<script>
  import {mapActions} from 'vuex'
    export default {
      props: {
        bgImage: {
          type: String,
          default: ''
        },
        songs: {
          type: Array,
          default: function () {
            return []
          }
        },
        title: {
          type: String,
          default: ''
        }
      },

      data(){
        return {
          active:'1'
        }
      },

      methods:{
        ...mapActions([
          'playSong','playRandom'
        ]),

        //播放点击的歌曲
        playingSong(song,index){
          this.playSong({
            list: this.songs,
            index
          })
        },

        //随机播放
        Random(){
          this.playRandom({
            list: this.songs
          })
        },

      },

      computed: {
        bgImg() {
          return `background-image:url(${this.bgImage})`
        }
      },
    }
</script>

<style lang="stylus" scoped>

  .mint-header
    background-color: #ccc0
    color: #000
    position: fixed
    top: 5px
    z-index: 11
    width: 100%
    font-size: 18px
    color: #fff

  .mint-tab-container
    background-color: #fff
    position: unset

  .list
    position: fixed
    top:0
    left:0
    right:0
    bottom:60px
    z-index: 99
    background #f6f6f6
    overflow: auto

  .list-content:before
    display: block
    content: ""
    margin-top: 70%

  .list-content
    position: absolute
    left: 0
    right: 0
    top: 0
    overflow: auto

  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    margin-top: 0px

  ul
    list-style: none
    padding: 0
    margin: 0
    li
      height: 60px

  .mint-cell-value
    font-size: 18px
    font-weight: 700
  .song-num
    float: left
    color: #888
    span
      position: absolute
      top: 16px
      left: 20px
  .song
    float: left
    padding-left: 45px

  .mint-cell
    img
      width: 23px
      margin-bottom: 3px
      margin-right: 4px


  .song-list-loading
    align-items: center
    display: flex
    justify-content: center
    position: absolute
    z-index: 11
    left: 0
    right: 0
    bottom: 0
    top: 10%

  .mint-cell-value
    margin-right: 15px
</style>
