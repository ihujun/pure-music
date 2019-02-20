import jsonp from '../common/js/jsonp'

//搜索数据
export function getSearch (query, page) {
  const URL = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
  const PARAMS = {
    format: 'jsonp',
    w: query,
    n: 20,
    p: page,
  }
  const CALLBACKNAME = 'jsonpCallback'
  return jsonp({url: URL, params: PARAMS, callback: CALLBACKNAME})
}


//获取热门关键词数据
export function getHotKey () {
  const URL = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const PARAMS = {
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: 1518414659356
  }
  const CALLBACKNAME = 'jsonpCallback'
  return jsonp({ url: URL, params: PARAMS, callback: CALLBACKNAME })
}

