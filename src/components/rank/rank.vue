<template>
  <div class="rank" ref="rank">
    <div class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <span class="top-title">{{item.topTitle}}</span>
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.singername}} - <span class="songname">{{song.songname}}</span></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!--<keep-alive>-->
      <router-view></router-view>
    <!--</keep-alive>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import {SUCCESS} from "../../data/config"
  import {getRank} from "data/rank";
  import {mapMutations} from 'vuex'

  export default {

    data(){
      return {
        topList:[]
      }
    },

    created(){
      this.getHotList()
    },

    methods:{
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      }),


      //获取数据
      getHotList(){
        getRank().then((res) => {
          if (res.code === SUCCESS) {
            this.topList = res.data.topList
          }
        })
      },

      // 跳转到排行列表
      selectItem(item){
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .rank
    .toplist
      height: 100%
      overflow: auto
      ul
        margin: 0
        padding: 0
      .item
        display: flex
        margin: 0 10px
        padding-top: 15px
        height: 95px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: #fff
          font-size: 12px
          list-style: none
          .top-title
            font-size: 16px
            color: #000
          .song
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
            line-height: 26px
            .songname
              font-size: 14px
              color: rgba(0,0,0,.5)
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
