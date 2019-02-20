/*
推荐页面数据
 */
import jsonp from '../common/js/jsonp'

//获取推荐数据
export function getRecommend () {
  const URL = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const PARAMS = {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    notice: 0,
    outCharset: 'utf-8'
  }
  const CALLBACKNAME = 'jsonpCallback'
  return jsonp({
    url: URL,
    params: PARAMS,
    callback: CALLBACKNAME
  })
}





//获取推荐页歌曲的歌曲列表
export function getRecommendDisc (discId) {
  //使用了代理解决了跨域问题
  const URL = '/api/getDisc/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const PARAMS = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: discId,
    g_tk: 1610954601,
    loginUin: 1450611414,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }
  const CALLBACKNAME = 'jsonpCallback'
  return jsonp({
    url: URL,
    params: PARAMS,
    callback: CALLBACKNAME
  })
}

