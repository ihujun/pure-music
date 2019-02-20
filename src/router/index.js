import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//路由懒加载
const Rank = ((resolve)=>{
  import('components/rank/rank').then((rank)=>{
    resolve(rank)
  })
})
const Recommend = ((resolve)=>{
  import('components/recommend/recommend').then((recommend)=>{
    resolve(recommend)
  })
})
const Search = ((resolve)=>{
  import('components/search/search').then((search)=>{
    resolve(search)
  })
})
const Singer = ((resolve)=>{
  import('components/singer/singer').then((singer)=>{
    resolve(singer)
  })
})
const SingerDetail = ((resolve)=>{
  import('components/singer/singer-detail').then((singerDetail)=>{
    resolve(singerDetail)
  })
})
const Disc = ((resolve)=>{
  import('components/disc/disc').then((disc)=>{
    resolve(disc)
  })
})
const TopList = ((resolve)=>{
  import('components/rank/top-list').then((topList)=>{
    resolve(topList)
  })
})



export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/rank',
      component:Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path:'/recommend',
      component:Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path:'/search',
      component:Search,
      children:[
        {
          path:'SingerDetail/:id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/singer',
      component:Singer,
      children:[
        {
          path:'SingerDetail/:id',
          component:SingerDetail
        }
      ]
    }
  ]
})
