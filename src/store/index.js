//路由配置入口
import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

const debug = process.env.NODE_ENV!=='production'

export default new Vuex.Store({
  state,mutations,getters,actions,strict:debug
})
