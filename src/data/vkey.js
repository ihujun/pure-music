import jsonp from '../common/js/vkeyJsonp'

// 获取歌曲vkey
export function getVkey (song) {
  const URL = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const PARAMS = {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    dataType: 'JSONP',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: song.mid,
    filename: `C400${song.mid}.m4a`,
    guid: 9970343703,
    callback: 'MusicJsonCallback'
  }
  const CALLBACKNAME = 'MusicJsonCallback'
  return jsonp({
    url: URL,
    params: PARAMS,
    callback: CALLBACKNAME
  })
}
