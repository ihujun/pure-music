<template>
  <div id="app">
    <div class="page">
      <div id="head" ref="head" :class="headFixed == true ? 'isFixed' :''">
        <m-header></m-header>

        <m-navbar></m-navbar>
      </div>


      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>

    <div class="player">
      <playing></playing>
    </div>
  </div>
</template>

<script>
  import MHeader from 'components/header/header'
  import MNavbar from 'components/navbar/navbar'
  import playing from 'components/playing/playing'
export default {
  name: 'App',
  components:{
    MHeader,MNavbar,playing
  },

  data(){
    return {
      headFixed: false
    }
  },
}
</script>

<style lang="stylus">

  #app
    overflow: hidden
    margin-top: 0
    margin-left: 0
    width: 100%
    height: 100%

  .isFixed
    position:fixed
    top:0

  body,html
    margin-top: 0
    margin-left: 0
    width: 100%
    height: 100%
    background: #f4f4f4
  .mint-header.is-fixed
    z-index: 99
  .mint-navbar.is-fixed
    z-index: 2
    top: 10px

  .page
    overflow: scroll;
    position: fixed;
    top: 0;
    bottom: 60px;
    margin-top: 0;
    margin-left: 0;
    width: 100%;
</style>
