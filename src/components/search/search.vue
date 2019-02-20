<template>
    <div class="page-search">
      <div class="search">
        <!--搜索框-->
        <div class="search-input">
          <div class="search-input">
            <mt-search
              @keyup.enter.native="search(query,1,true)"
              v-model="query"
              cancel-text="取消"
              placeholder="搜索歌曲、歌手">

              <div class="wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="result.length">
                <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="hasMore" :auto-fill="true"
                             ref="loadmore">
                  <!--搜索结果-->
                  <a class="mint-cell" v-for="(item,index) in this.result" @click="selectItem(item)">
                    <div class="mint-cell-wrapper">
                      <!--歌曲-->
                      <div class="mint-cell-title" v-if="!item.type">
                        <img slot="icon" src="https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/search_sprite.png?max_age=19830212&d=20151105145423" width="24" height="24">
                        <span class="mint-cell-text">{{item.name}}</span>
                        <span class="mint-cell-label">{{item.singer}}</span>
                      </div>
                      <!--歌手-->
                      <!--目前在用的搜索api只能搜索到歌曲-->
                      <div class="mint-cell-title result-singer" v-if="item.type">
                        <img slot="icon" :src='singerImg(item.singermid)' style="border-radius: 999px">
                        <span class="mint-cell-text">{{item.singername}}</span>
                        <span class="mint-cell-label">单曲{{item.songnum}}  专辑{{item.albumnum}}</span>
                      </div>

                    </div>
                  </a>

                </mt-loadmore>
              </div>
            </mt-search>

            <!--热门搜索词-->
            <div v-show="query==''" class="hotkey-wrapper">
              <div>
                  <div class="hotkey">
                    <h3 class="title">热门搜索</h3>
                    <div class="hotkey-tags">
                      <span class="tag-key" v-for="item in hotkeys" @click="setQuery(item.k)">{{item.k}}</span>
                    </div>
                  </div>
                </div>
              </div>

            <!--搜索历史-->
            <div  v-show="historyQuery.length && query==''" class="history-wrapper">
              <div class="history-clear" @click="clearHistory"><span>清除搜索记录</span></div>
              <div ref="historyList" class="search-history">
                <li v-for="item in historyQuery" @click="setQuery(item)">
                  <a class="history-item">
                    <span class="icon-clock"></span>
                    <span class="history-key">{{item}}</span>
                    <span class="iconfont icon-close" @click.stop="deleteHistory(item)"></span>
                  </a>
                </li>
              </div>
            </div>

            <!--无搜索结果-->
            <div class="no-result" v-show="!query=='' && !result.length">
              <img src="https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/search_null.png?max_age=19830212&d=20151105145423" width="106px" height="105px">
              <p>无匹配</p>
              <p>很抱歉，没有找到与“{{query}}”相关的结果。</p>
            </div>
          </div>

          </div>
      </div>
      <router-view></router-view>
    </div>
</template>

<script>
  import {SUCCESS} from "data/config"
  import {createSong} from "common/js/song"
  import {saveSearch,loadSearch,clearSearch,deleteSearch} from "common/js/cache"
  import Singer from 'common/js/singer'
  import {mapMutations,mapActions} from 'vuex'
  import {getHotKey,getSearch} from "data/search";

  export default {

    data(){
      return {
        hotkeys:[],//热门搜索词
        query:'',//当前搜索内容
        page:1,//当前搜索的页数
        result: [],//搜索结果
        hasMore:false,
        wrapperHeight:0,
        historyQuery:loadSearch(),//历史搜索记录
      }
    },
    components:{
    },

    created(){
      this.getHotKey()

    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },

    methods:{
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions(['insertSong']),


      //获取热门词
      getHotKey(){
        getHotKey().then((res) => {
          if (res.code === SUCCESS) {
            this.hotkeys=res.data.hotkey.slice(0, 10)
          }
        })
      },

      // 搜索
      search(query,page){
        getSearch(query,page).then((res) => {
          this.result=this.initResult(res.data)
          this.checkMore(res.data)
        })


        //保存搜索历史
        saveSearch(query)
      },

      //初始化搜索结果
      initResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: 'singer'}})
        }
        if (data.song) {
          let arr = this.initSongs(data.song.list)
          ret = ret.concat(arr)
        }
        return ret
      },

      initSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
              ret.push(createSong(musicData))
          }
        })
        return ret
      },


      checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * 20) > song.totalnum) {
          this.hasMore = true
        }
      },

      //执行搜索
      setQuery(query) {
        query=query.trim()
        this.query = query
        this.search(query,1,true)
        this.historyQuery=loadSearch()
      },

      //清空历史搜索
      clearHistory(){
        this.$messagebox.confirm('',{
          message: '清空搜索历史？',
          title: '提示',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(action=>{
          this.historyQuery=clearSearch()
        }).catch(err => {   //取消的回调
        });
      },

      //删除一条历史搜索
      deleteHistory(query){
        this.historyQuery=deleteSearch(query)
      },



      //上拉加载
      loadBottom(){
        if (this.hasMore) {
          return
        }
        this.page++
        getSearch(this.query,this.page).then((res) => {
          this.result=this.result.concat(this.initResult(res.data))
          this.checkMore(res.data)
        })
        this.$refs.loadmore.onBottomLoaded()
      },


      //搜索结果歌手头像
      singerImg(singermid){
        return `https://y.gtimg.cn/music/photo_new/T001R68x68M000${singermid}.jpg?max_age=2592000`
      },


      //点击搜索结果跳转到歌手或播放歌曲
      selectItem(item){
        //歌手
        if (item.type){
          const singer = new Singer({
            id: item.singermid,
            name: item.singername,
          })
          this.$router.push({
            path: `/search/SingerDetail/${item.singermid}`
          })
          this.setSinger(singer)
        }else{
          //播放歌曲
          this.insertSong(item)
        }
      }
    },

  }
</script>

<style lang="stylus">

  .page-search
    background: #fff
    width: 100%
    position: absolute
    top: 88px
    bottom: 0px
    .mint-actionsheet
      bottom: 60px
    .search
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0px;
    .search-input
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0px;
      .hotkey-wrapper
        position: relative;
        top: 50px;
      .history-wrapper
        position: relative;
        top: 40px;
    .mint-search
      height: unset;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0px;
      .mint-search-list
        padding-top: unset;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0px;
        .mint-search-list-warp
          width: 100%;
          position: absolute;
          top: 55px;
          bottom: 0px;
          .wrapper
            .mint-loadmore
              overflow: unset;
              width: 100%;
              position: absolute;
              top: 0;
              bottom: 0px;
              .mint-loadmore-content
                width: 100%;
                position: absolute;
                top: 0;
                bottom: 0px;
        .mint-cell-title
          span
            padding-left: 16px
            padding-bottom: 7px
          img
            position: relative
            top: 10px
        .mint-cell-label
          margin-left: 26px
      .mint-cell
        margin-bottom: 6px
        border-bottom: solid 1px #e5e5e5
        .mint-cell-value
          font-size: 22px
          margin-right: 10px
          margin-bottom: 16px
        .result-singer
          img
            width: 38px
            height: 38px
          .mint-cell-label
            padding-left: 23px
          .mint-cell-text
            padding-left: 7px
      .mint-searchbar
        background: #f4f4f4
        .mint-searchbar-cancel
          color: #555
        .mint-searchbar-core
          padding-left: 10px
        .mintui-search
          font-size: 18px

    .hotkey
      background: #fff
      padding: 15px 15px 10px 15px
      .title
        color: rgba(0,0,0,.6)
        font-size: 14px

    .tag-key
      display: inline-block
      font-size: 14px
      padding: 0 10px
      height: 30px
      line-height: 30px
      color: #000
      border: 1px solid rgba(0,0,0,.6)
      border-radius: 99px
      word-break: keep-all
      margin-bottom: 10px
      margin-right: 14px


   .no-result
     position: relative
     padding: 170px 0 0
     text-align: center
     color: #808080
     p
       font-size: 18px
       font-weight: normal

   .search-history
     height: 300px;
     overflow: scroll;
     li
      border-top: 1px solid #ededed
      padding: 0 15px
      list-style: none
      .history-item
        position: relative;
        display: block;
        height: 44px;
        line-height: 44px;
        .icon-clock
          position: absolute;
          left: 0;
          top: 12px;
          width: 20px;
          height: 20px;
          background-image: url('https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/clock_ic.png?max_age=19830212&d=20151105145423');
          background-repeat: no-repeat;
          background-size: cover;
          text-indent: -999px;
        .history-key
          position: absolute;
          left: 40px;
          right: 50px;
          display: block;
          height: 44px;
          line-height: 44px;
          color: #000;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        .icon-close
          position: absolute;
          right: 0;
          width: 30px

   .history-clear
     position: relative
     left: 75%
     display: inline-block
     line-height: 44px
     color: #47c88a

   .wrapper
     overflow: scroll




</style>
