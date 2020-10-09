<script>
  import Request from './network/http_request';
  import {
    fastLogin
  } from './utils/user_util';
  import './utils/update_util'

  export default {
    onLaunch: function(options) {
      // 应用初始化时, 通过临时授权码进行登录操作, 刷新Token并获取用户Id
      fastLogin();
      const deviceInfo = uni.getSystemInfoSync();
      console.log('当前设备信息 ==>', deviceInfo, options);
    },
    onShow: function() {
      console.log('Sharez App Show ==>');
    },
    onHide: function() {
      console.log('Sharez App Hide ==>');
    },
    methods: {
      
    }
  }
</script>

<style>
  /*每个页面公共css */
</style>
