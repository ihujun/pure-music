
import {playMode} from "common/js/config";

export default{
  //歌手数据
  singer:{},
  //是否播放
  playing: false,
  //全屏显示播放器
  fullScreen: false,
  //播放列表
  playlist: [],
  //播放顺序列表
  sequenceList: [],
  //播放模式
  mode: playMode.sequence,
  //当前播放
  currentIndex: -1,
  //歌单
  disc: {},
  //排行榜歌曲列表
  topList: {},
}
