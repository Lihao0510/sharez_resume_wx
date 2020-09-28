import Fly from "flyio/dist/npm/wx";
import {
  VUE_APP_API_URL
} from "@/config";


const fly = new Fly()
fly.config.baseURL = VUE_APP_API_URL

fly.interceptors.response.use(
  response => {
    // console.log(response)
    // 定时刷新access-token
    return response;
  },
  error => {
    if (error.toString() == 'Error: Network Error') {
      console.log('发送请求失败', error)
      return Promise.reject({
        msg: "网络错误",
        toLogin: true
      });
    }
    if (error.status == 401) {
      console.log('登录失效 401', error)
      return Promise.reject({
        msg: "未登录",
        toLogin: true
      });
    }
    return Promise.reject(error);
  }
);

const defaultOpt = {
  login: true
};

function baseRequest(options) {

  // 从缓存中获取 token 防止 token 失效后还会继续请求的情况
  // 合并传参过来的 headers
  // 如果接口需要登录，携带 token 去请求
  options.headers = {
    ...options.headers,
    Authorization: "Bearer " + 'token'
  }
  // 结构请求需要的参数
  const {
    url,
    params,
    data,
    login,
    ...option
  } = options
  
  console.log('即将请求的URL ==>', url, VUE_APP_API_URL)

  // 发起请求
  return fly.request(url, params || data, {
    ...option
  }).then(res => {
    const data = res.data || {};
    if (res.status !== 200 && res.code !== 200) {
      return Promise.reject({
        msg: "请求失败",
        res,
        data
      });
    }
    if ([410000, 410001, 410002].indexOf(data.status) !== -1) {
      return Promise.reject({
        msg: res.data.msg,
        res,
        data,
        toLogin: true
      });
    } else if (data.status === 200 || data.code === 200) { // 兼容返回标识码为code的情况
      return Promise.resolve(data, res);
    } else {
      return Promise.reject({
        msg: res.data.msg,
        res,
        data
      });
    }
  });
}

/**
 * http 请求基础类
 * 参考文档 https://www.kancloud.cn/yunye/axios/234845
 *
 */
const request = ["post", "put", "patch"].reduce((request, method) => {
  /**
   *
   * @param url string 接口地址
   * @param data object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, data = {}, options = {}) => {
    return baseRequest(
      Object.assign({
        url,
        data,
        method
      }, defaultOpt, options)
    );
  };
  return request;
}, {});

["get", "delete", "head"].forEach(method => {
  /**
   *
   * @param url string 接口地址
   * @param params object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, params = {}, options = {}) => {
    return baseRequest(
      Object.assign({
        url,
        params,
        method
      }, defaultOpt, options)
    );
  };
});

export default request;
