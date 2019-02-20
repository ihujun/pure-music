<template>
  <!--顶部导航-->
  <div class="page-navbar">
    <div class="tab">
      <router-link to="/recommend" tag="div" class="tab-item"><span>推荐</span></router-link>
      <router-link to="/singer" tag="div" class="tab-item"><span>歌手</span></router-link>
      <router-link to="/rank" tag="div" class="tab-item"><span>排行</span></router-link>
      <router-link to="/search" tag="div" class="tab-item"><span>搜索</span></router-link>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'navbar',
    data() {
      return {
        selected: '1'
      }
    },

    methods:{
    }
  };
</script>
<style lang="stylus">
  .tab
    display: flex
    .tab-item
      flex: 1
      text-align: center
      color: rgba(0,0,0,.6)
      font-size: 16px
      padding: 10px
      span
        padding-bottom: 6px

  .page-navbar
    background: #fff

    .router-link-active
      color:$color-theme
      border-bottom: 2px solid #31c27c
      color: #31c27c

</style>
