<template>
    <!--歌手列表页面-->
    <div class="singerList">
      <singer-list :singers="singers" @viewDetail="viewSinger"></singer-list>
      <router-view></router-view>
    </div>
</template>

<script>
  import {SUCCESS} from "data/config";
  import singerList from 'common/singer/singerList'
  import {getSingerList} from "data/singer";
  import {mapMutations} from 'vuex'

  export default {

    components:{
      singerList
    },

      data(){
        return {
          //歌手数据
          singers:[],
          singerListTemp:{
            hot: {
              title: '热门',
              items: []
            }
          }
        }
      },

      created(){
        this.initHandlerSingerList()
      },

      methods:{

        //初始处理歌手数据
        initHandlerSingerList() {
          getSingerList().then((res) => {
            if (res.code === SUCCESS) {
              this.getSingerList(res.data.list)
            }
          })
        },


        //获取所有的歌手数据
        getSingerList(list){
            this.getHotSingerList(list)

            list.forEach((item,index)=>{
              //名字的字母
              const key = item.Findex
              //没有key就添加
              if (!this.singerListTemp[key]) {
                this.singerListTemp[key] = {
                  title: key,
                  items: []
                }
              }

              this.singerListTemp[key].items.push({
                id:item.Fsinger_mid,
                name:item.Fsinger_name,
                avatar:`http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg`
              })
            })

            //对歌手数据排序
            let ret = []
            let hot = []
            for (let key in this.singerListTemp) {
              let val = this.singerListTemp[key]
              if (val.title.match(/[a-zA-Z]/)) {
                ret.push(val)
              } else if (val.title === '热门') {
                hot.push(val)
              }
            }
            ret.sort((a, b) => {
              return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
          ret.unshift(hot[0])
          this.singers=ret
        },

        //获取热门歌手
        getHotSingerList(list){
          list.forEach((item, index) => {
            if (index < 10) {
              this.singerListTemp.hot.items.push({
                id: item.Fsinger_mid,
                name: item.Fsinger_name,
                avatar: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg`
              })
            }
          })
        },

        //跳转到歌手详情路由
        viewSinger(item){
          this.$router.push({
            path:`/singer/SingerDetail/${item.id}`
          })
          this.setSinger(item)
        },


        ...mapMutations({
          setSinger: 'SET_SINGER'
        })

      }
  }
</script>

<style>

</style>
