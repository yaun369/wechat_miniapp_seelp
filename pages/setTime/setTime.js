// pages/setTime/setTime.js
const date = new Date();
const hours = [];
const minutes = [];
for (let i = 0; i <= 23; i++) {
  hours.push(i);
}
for (let i = 0; i <= 59; i++) {
  minutes.push(i);
}

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
    hours,
    hour: date.getHours(),
    minutes,
    minute: date.getMinutes(),
    value: [0, 0],
    array: [],
    index: 0,
    arrayTime: ["5分钟", "10分钟", "30分钟"],
    timeIdx: 0
  },
  bindChange(e) {
    const val = e.detail.value;
    this.data.value = val;
  },
  bindPickerChange(e) {
    const val = e.detail.value;
    this.data.index = val;
    this.setData({
      index: e.detail.value
    })
  },
  bindTimeChange(e) {
    const val = e.detail.value;
    this.data.timeIdx = val;
    this.setData({
      timeIdx: e.detail.value
    })
  },
  switchChange(e) {
    const val = e.detail.value;
    console.log(val);
    const dataObj = {
      date: addZero(this.data.value[0]) + ":" + addZero(this.data.value[1]),
      music: this.data.array[this.data.index],
      time: this.data.arrayTime[this.data.timeIdx]
    }
    if (val) {
      wx.setStorageSync("setTimeObj", dataObj);
    } else {
      wx.removeStorageSync("setTimeObj");
    }
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
    let Music = new wx.BaaS.TableObject('Music')
    Music.find().then(res => {
      console.log(res.data.objects)
      this.setData({
        array: res.data.objects
      })
    }, err => {
      console.log(err)
    })
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