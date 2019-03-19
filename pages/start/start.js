//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    avatarUrl: "../../images/rice.png"
  },
  goToIndex: function(e) {
    var that = this;
    wx.BaaS.handleUserInfo(e).then(res => {
      // res 包含用户完整信息，详见下方描述
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
    })
    var my_info = wx.getStorageSync('userInfo');
    if (!my_info) { //第一次需要授权
      wx.setStorage({
        key: "my_info",
        data: e.detail.userInfo,
        success: function() {
          wx.switchTab({
            url: '/pages/index/index',
          });
        }
      })
    } else { //直接点击进入index
      wx.switchTab({
        url: '/pages/index/index',
      });
    }
  },
  onShareAppMessage: function() {
    return {
      title: '让吃饭变得更酷',
      path: '/pages/start/start'
    }
  }
});