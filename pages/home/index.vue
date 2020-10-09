<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <text>{{userInfoComp.nick_name}}</text>
    <view class="text-area">
    </view>
    <button @click="getUserInfo">获取用户信息</button>
    <button @click="previewStore">查看当前Store</button>
    <button :withCredentials="false" open-type="getUserInfo" @getuserinfo="onWechatUserInfoAuth">获取用户信息授权</button>
  </view>
</template>

<script>
  import Request from '../../network/http_request.js';
  import { completeWechatUserInfo } from '../../utils/user_util.js';
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState({
        userInfoComp: 'userInfo'
      })
    },
    data() {
      return {
        
      }
    },
    onLoad() {

    },
    methods: {
      async getUserInfo() {
        try {
          const userInfoRes = await Request.get('user/info');
          console.log('获取用户信息结果 ==>', userInfoRes);
        } catch (e) {
          console.log('获取用户信息错误 ==>', e);
        }
      },
      onPhoneNumberAuth(e) {
        console.log('获取电话号码成功 ==>', e);
      },
      onWechatUserInfoAuth(e) {
        const { userInfo } = e.detail;
        console.log('获取用户信息成功 ==>', userInfo);
        if (!userInfo) {
          uni.showToast({
            icon: 'none',
            title: '没有得到您的授权, 请重试-_-!'
          })
          return;
        }
        // 补充用户微信信息
        completeWechatUserInfo(userInfo);
      },
      previewStore() {
        console.log('当前store ==>', this.$store.state.userInfo.nick_name);
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../styles/common';

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    .flexible(row, center, center);
    background-color: @Theme_Color;
    width: 100rpx;
    height: 100rpx;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>
