//app.js
App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    let clientID = 'cdef0c2c610df89c9634'
    wx.BaaS.init(clientID)
    // 展示本地存储能力
    wx.setStorageSync("setTimeObj", {date:"未设置"});
  },
  globalData: {
    userInfo: null
  }
})