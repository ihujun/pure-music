<template>
    <!--歌手列表-->
  <div class="songList">
    <mt-index-list>
      <mt-index-section v-for="(singer,index) in singers" :index="singer.title" ref="listGroup" :key="index">
        <div @click="singerDetail(item)" class="mint-cell" v-for="item in singer.items">
          <img class="avatar" v-lazy="item.avatar">
          <span class="name" v-text="item.name"></span>
        </div>
      </mt-index-section>
    </mt-index-list>


  </div>
</template>

<script>
    export default {
      props:['singers'],

      methods:{
        singerDetail(item){
          this.$emit('viewDetail',item)
        }
      },


    }
</script>

<style scoped lang="stylus">
  .mint-indexlist
    top: 3px
  .mint-indexsection-index
    background-color: #efecec

  .mint-cell
    padding-left: 8%
    padding-top: 6%
  .avatar
    width: 50px
    height: 50px
    border-radius: 50%
  .name
    margin-left: 20px
    color: black
    font-size: 14px
</style>
