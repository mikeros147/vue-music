import jsonp from 'common/js/jsonp';
import {commonParams, options} from './config';
import axios from 'axios';

const debug = process.env.NODE_ENV !== 'production';

// 获取推荐界面轮播图的推荐内容
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  // uin: Q号
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
};

// 获取推荐界面的歌单
export function getDiscList() {
  const url = '/api/getDiscList';

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}

// 获取歌曲列表
export function getSongList(disstid) {
  const url = debug ? '/api/getCdInfo' : 'http://ustbhuangyi.com/music/api/getCdInfo';

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}
