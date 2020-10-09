/* 
用户注册/资料补充相关工具类, 用户登录与失效后登录 
 */
import Request from '../network/http_request.js';
import $store from '../store/index.js';

// 补充微信用户信息, 获取用户的头像与昵称等, 作为注册功能
export async function completeWechatUserInfo(wechatUserInfo) {
  uni.showLoading({
    mask: true,
    title: '提交中...'
  })
  try {
    const deviceInfo = uni.getSystemInfoSync();
    const completeRes = await Request.post('user/complete', {
      nick_name: wechatUserInfo.nickName,
      gender: wechatUserInfo.gender,
      avatar_url: wechatUserInfo.avatarUrl,
      device_message: JSON.stringify(deviceInfo)
    });
    if (completeRes.code === 200) {
      const completedUserData = completeRes.data;
      uni.showToast({
        title: '注册成功!',
        icon: 'success'
      })
    } else {
      throw new Error(completeRes.message);
    }
  } catch (e) {
    console.log('完善信息发生错误 ==>', e.message, e);
    uni.hideLoading()
    uni.showToast({
      title: e.message,
      icon: 'none'
    })
  }
}

// 获取openId与token, 在app初始化时或token失效时使用
export async function fastLogin() {
  uni.showLoading({
    mask: true,
    title: '自动登录中...'
  })
  try {
    const [err, res] = await uni.login({
      provider: 'weixin'
    });
    if (err) {
      throw new Error('获取临时授权码失败!');
    }
    const openIdRes = await Request.post('wechat/login', {
      code: res.code
    });
    console.log('获取的OpenId ==>', openIdRes);
    if (openIdRes.code !== 200) {
      throw new Error(openIdRes.message);
    }
    const {
      user_id,
      token,
      open_id
    } = openIdRes.data;
    uni.setStorageSync('token', token);
    uni.setStorageSync('open_id', open_id);
    uni.setStorageSync('user_id', user_id);
    const userInfoRes = await Request.get('user/info');
    if (userInfoRes.code === 200) {
      $store.commit('updateUserInfo', userInfoRes.data);
    }
    uni.hideLoading()
  } catch (e) {
    uni.hideLoading()
    uni.showToast({
      title: e.message,
      icon: "none",
      duration: 2000
    });
  }
}
