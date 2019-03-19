// pages/indexStaet/indexStaet.js
function addZero(str) {
  if (String(str).length == 1) {
    return "0" + String(str);
  } else {
    return String(str);
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hours: addZero(new Date().getHours()),
    minutes: addZero(new Date().getMinutes()),
    setTimeObj: wx.getStorageSync("setTimeObj")
  },
  endTiming() {
    const now = new Date().getTime();
    let recordID = wx.getStorageSync("recordID") // 数据行 id
    let Sleep = new wx.BaaS.TableObject('63946')
    Sleep.get(recordID).then(res => {
      // success
      console.log(res.data.created_at)
      console.log(Math.round(now / 1000))
      let time = Math.round(now / 1000) - res.data.created_at
      if (time < 300) {
        Sleep.delete(recordID).then(res => {
          // success
          console.log("睡眠少于5分钟不生成睡眠日志")
          wx.switchTab({
            url: '../index/index'
          })
        }, err => {
          // err
        })
      } else {
        let sleep = Sleep.getWithoutData(recordID)
        sleep.set('end', String(now))
        sleep.set('time', time)
        sleep.update().then(res => {
          // success
          console.log("生成睡眠日志")
          wx.switchTab({
            url: '../index/index'
          })
        }, err => {
          // err
        })
      }
    }, err => {
      // err
    })
  },
  toSleep() {
    wx.switchTab({
      url: '../sleep/sleep'
    })
  },
  toSetTime() {
    wx.navigateTo({
      url: '../setTime/setTime'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    setInterval(function() {
      let date = new Date();
      that.setData({
        hours: addZero(date.getHours()),
        minutes: addZero(date.getMinutes()),
        setTimeObj: wx.getStorageSync("setTimeObj")
      })
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})