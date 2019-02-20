import jsonp from '../common/js/jsonp'

//获取歌手列表
export function getSingerList () {
  const URL = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const PARAMS = {
    channel: 'singer',
    key: 'all_all_all',
    g_tk: 1858198544,
    format: 'jsonp',
    outCharset: 'utf-8',
    platform: 'yqq',
    page: 'list',
    hostUin: 0,
    inCharset: 'utf8',
    notice: 0,
    needNewCode: 0,
    pagesize: 100,
    pagenum: 1
  }
  const CALLBACKNAME = 'jsonpCallback'
  return jsonp({
    url: URL,
    params: PARAMS,
    callback: CALLBACKNAME
  })
}


//获取歌手的歌曲列表
export function getSingerDetail (id) {
  const URL = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const PARAMS = {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: id,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  }
  const CALLBACKNAME = 'jsonpCallback'
  return jsonp({url: URL, params: PARAMS, callback: CALLBACKNAME})
}
