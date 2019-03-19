// pages/index/index.js
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
    items: [{
        value: '正常状态',
        icon: "../../images/icon/zczt.png"
      },
      {
        value: '工作压力',
        icon: "../../images/icon/gzyl.png"
      },
      {
        value: '运动过',
        icon: "../../images/icon/ydg.png"
      },
      {
        value: '睡前饮食',
        icon: "../../images/icon/sqys.png"
      },
      {
        value: '饮酒咖啡',
        icon: "../../images/icon/yjkf.png"
      },
      {
        value: '其他',
        icon: "../../images/icon/qt.png"
      }
    ],
    hours: addZero(new Date().getHours()),
    minutes: addZero(new Date().getMinutes()),
    isStart: false,
    status: ""
  },
  radioChange(e) {
    this.data.status = e.detail.value;
  },
  startTiming() {
    // this.data.isStart = !this.data.isStart;
    // this.setData({
    //   isStart: this.data.isStart
    // })
    if (this.data.status != "") {
      wx.reLaunch({
        url: '../indexStaet/indexStaet'
      })
      this.addSleepData();
    } else {
      wx.showToast({
        title: '请选择睡前状态',
        icon: 'none'
      })
    }
  },
  addSleepData() {
    wx.BaaS.login().then(ret => {
      let Sleep = new wx.BaaS.TableObject('63946')
      let sleep = Sleep.create()
      let sleepData = {
        user: ret.openid,
        status: this.data.status,
        start: String(new Date().getTime())
      }
      sleep.set(sleepData).save().then(res => {
        console.log(res)
        wx.setStorageSync("recordID", res.data.id)
      }, err => {
        console.log(err)
      })
    }, err => {
      console.log(err)
    })
  },
  // endTiming() {
  //   this.data.isStart = !this.data.isStart;
  //   this.setData({
  //     isStart: this.data.isStart
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    setInterval(function() {
      let date = new Date();
      that.setData({
        hours: addZero(date.getHours()),
        minutes: addZero(date.getMinutes()),
        setTimeObj: wx.getStorageSync("setTimeObj")
      })
    }, 1000);
    wx.request({
      url: 'https://api.live.bilibili.com/ip_service/v1/ip_service/get_ip_addr',
      success: res => {
        console.log(res.data.data);
        let info = res.data.data;
        that.setData({
          city: info.city
        })
        wx.request({
          url: 'https://api.caiyunapp.com/v2/E2zpERDdWpFB3GEq/' + info.longitude + ',' + info.latitude + '/realtime.json',
          success: ret => {
            console.log(ret.data.result)
            let weather = ret.data.result;
            let skycon = "未知";
            switch (weather.skycon) {
              case 'CLEAR_DAY':
                skycon = '晴天';
                break;
              case 'CLEAR_NIGHT':
                skycon = '晴夜';
                break;
              case 'PARTLY_CLOUDY_DAY':
                skycon = '多云';
                break;
              case 'PARTLY_CLOUDY_NIGHT':
                skycon = '多云';
                break;
              case 'CLOUDY':
                skycon = '阴';
                break;
              case 'RAIN':
                skycon = '雨';
                break;
              case 'SNOW':
                skycon = '雪';
                break;
              case 'WIND':
                skycon = '风';
                break;
              case 'HAZE':
                skycon = '雾霾';
                break;
            }
            that.setData({
              temperature: weather.temperature,
              skycon: skycon,
              icon: "../../images/icon/" + weather.skycon + ".png"
            })
          }
        })
      }
    });
  },
  toSetTime() {
    wx.navigateTo({
      url: '../setTime/setTime',
    })
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