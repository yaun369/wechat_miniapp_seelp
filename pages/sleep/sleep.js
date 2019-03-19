// pages/sleep/sleep.js
var myaudio = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    banners: [],
    index: 0,
    music: [],
    musicItem: {},
    isplay: false //是否播放
  },
  tapBanner(e) {
    wx.navigateTo({
      url: '../banner/banner?id=' + e.currentTarget.dataset.id,
    })
  },
  //播放
  play: function() {
    myaudio.autoplay = true;
    myaudio.loop = true;
    myaudio.src = this.data.music[this.data.index].file.path;
    // console.log(myaudio.src);
    myaudio.play();
    this.setData({
      isplay: true
    });
  },
  // 停止
  stop: function() {
    myaudio.pause();
    this.setData({
      isplay: false
    });
  },
  tapNext() {
    this.data.index = (this.data.index + 1) % this.data.music.length
    this.setData({
      musicItem: this.data.music[this.data.index]
    })
    this.play()
  },
  tapPrevious() {
    this.data.index = (this.data.index + 1) % this.data.music.length
    this.setData({
      musicItem: this.data.music[this.data.index]
    })
    this.play()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  addZero(str) {
    if (String(str).length == 1) {
      return "0" + String(str);
    } else {
      return String(str);
    }
  },
  getSome() {
    let Music = new wx.BaaS.TableObject('Music');
    Music.find().then(res => {
      // success
      // console.log(res)
      this.data.music = res.data.objects
      this.setData({
        musicItem: this.data.music[this.data.index]
      })
    }, err => {
      // err
    })
    let Banner = new wx.BaaS.TableObject('Banner');
    Banner.find().then(res => {
      // success
      // console.log(res)
      this.data.banners = res.data.objects
      this.setData({
        banners: res.data.objects
      })
    }, err => {
      // err
    })
  },
  onLoad: function(options) {
    this.getSome();
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
    let date = new Date();
    wx.request({
      url: 'https://cloud.alientek.com/api/orgs/365/devicepacket/71889130897836053884',
      method: 'GET',
      data: {
        page: 1,
        limit: 100,
        start: date.getFullYear() + '-' + this.addZero(date.getMonth() + 1) + '-' + this.addZero(date.getDate()) + ' 00:00:00',
        end: date.getFullYear() + '-' + this.addZero(date.getMonth() + 1) + '-' + this.addZero(date.getDate()) + ' 23:59:59'
      },
      header: {
        token: "1df6094d37601c8dea7192197da8b380"
      },
      success: res => {
        let val = "";
        for (let n = 0; n < res.data.data.items.length; n++) {
          let str = res.data.data.items[n].hex_packet;
          let arr = str.split(" ");
          for (let i = 0; i < arr.length; i++) {
            val += parseInt(arr[i], 16);
          }
          if (val != '6576736978846975457282846884') {
            // console.log(val);
            break;
          }
        }
        this.setData({
          temperature: val.substring(2, 4),
          humidity: val.substring(4, 6),
          illumination: val.substring(6)
        })
      }
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