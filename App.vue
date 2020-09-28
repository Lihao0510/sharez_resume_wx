<script>
  import Request from './network/http_request.js';

  export default {
    onLaunch: function() {
      this.fastLogin();
    },
    onShow: function() {
      console.log('Sharez App Show ==>');
    },
    onHide: function() {
      console.log('Sharez App Hide ==>');
    },
    methods: {
      // 快速登录, 使用临时授权码获取用户openId与基础信息(注册过的用户有)
      async fastLogin() {
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
        } catch (e) {
          uni.showToast({
            title: e.message,
            icon: "none",
            duration: 2000
          });
        }
      }
    }
  }
</script>

<style>
  /*每个页面公共css */
</style>
