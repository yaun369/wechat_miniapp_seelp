// pages/data/data.js
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
    header: false,
    nowDate: [{ //日历的初始化数据
      month: 'current',
      day: new Date().getDate(),
      color: '#ffd700',
      background: 'white'
    }],
    total1: 0,
    total2: 0,
    total3: 0,
    temArr: [],
    humArr: [],
    clickDate: "",
    status: ""
  },
  dayClick(event) { //日历点击选择日期
    this.setData({
      nowDate: [{
        month: 'current',
        day: event.detail.day,
        color: 'white',
        background: '#82d5f8'
      }, {
        month: 'current',
        day: new Date().getDate(),
        color: '#ffd700',
        background: 'white'
      }]
    })
    this.data.clickDate = String(event.detail.year) + '-' + addZero(event.detail.month) + '-' + addZero(event.detail.day);
    this.getYZYdata(event.detail.year, event.detail.month, event.detail.day);
    this.getZXYdata(event.detail.year, event.detail.month, event.detail.day);
  },
  getYZYdata(year, month, day) { //原子云获取数据
    wx.request({
      url: 'https://cloud.alientek.com/api/orgs/365/devicepacket/71889130897836053884',
      method: 'GET',
      data: {
        page: 1,
        limit: 100,
        start: String(year) + '-' + addZero(month) + '-' + addZero(day) + ' 01:00:00', //设置请求的具体时间时段
        end: String(year) + '-' + addZero(month) + '-' + addZero(day) + ' 23:00:00'
      },
      header: {
        token: "1df6094d37601c8dea7192197da8b380"
      },
      success: res => {
        let val = "";
        let total = 0;
        this.data.temArr = [];
        this.data.humArr = [];
        this.data.total2 = 0;
        let tdArr = [];
        if (res.data.data.items.length === 0) {
          wx.showLoading({
            title: '暂无数据',
          });
          this.setData({
            isShow: false
          })
        } else {
          wx.hideLoading();
          for (let n = 0; n < res.data.data.items.length; n++) { //循环处理数据
            let str = res.data.data.items[n].hex_packet;
            let arr = str.split(" ");
            for (let i = 0; i < arr.length; i++) {
              val += parseInt(arr[i], 16); //十六进制转换
            }
            if (val != '6576736978846975457282846884') { //摘除心跳包
              // console.log(val);
              let temperature = val.substring(2, 4);
              let humidity = val.substring(4, 6);
              this.data.temArr.push(temperature);
              this.data.humArr.push(humidity);
              if (val.substr(-2, 2) === '01') {
                tdArr.push(val.substr(-2, 2));
              }
              if (temperature >= 19 && temperature <= 24 && humidity >= 40 && humidity <= 70) { //判断温湿度的分数
                total = 10;
              } else {
                total = 0
              }
            }
          }
          console.log(tdArr);
          if (tdArr.length > 5) {
            this.data.total3 = 0;
          } else {
            this.data.total3 = parseInt(20 * (1 - (tdArr.length / 20)));
          }
          this.data.total2 = total;
          this.setData({
            isShow: true,
            temperature: val.substring(2, 4),
            humidity: val.substring(4, 6),
            illumination: val.substring(6),
            total2: total,
            total3: this.data.total3
          })
        }
      }
    })
  },
  getZXYdata(year, month, day) { //获取知晓云数据
    wx.BaaS.login().then(res => {
      let query = new wx.BaaS.Query()
      query.compare('user', '=', res.openid) //查询对于openid的用户
      let Sleep = new wx.BaaS.TableObject('SleepTime')
      Sleep.setQuery(query).orderBy('-time').find().then(res => { //查询sleeptime表
        let arr = res.data.objects;
        for (let i = 0; i < arr.length; i++) {
          this.data.total1 = 0;
          let date = new Date(arr[i].created_at * 1000);
          let ds1 = addZero(date.getFullYear()) + addZero(date.getMonth() + 1) + addZero(date.getDate());
          let ds2 = addZero(year) + addZero(month) + addZero(day);
          if (ds1 === ds2) {
            console.log(arr[i]);
            wx.hideLoading();
            let sleepTime = String(new Date(arr[i].created_at * 1000));
            let wakeTime = String(new Date(arr[i].updated_at * 1000));
            let hour = parseInt(arr[i].time / 3600);
            let minute = parseInt(arr[i].time % 3600 / 60);
            let total = 0;
            if (arr[i].time > (8 * 3600)) { //睡眠时长分数判定
              total = 70;
            } else {
              total = parseInt(arr[i].time / (8 * 3600) * 70);
            }
            this.data.status = arr[i].status;
            this.data.total1 = total;
            this.setData({
              isShow: true,
              status: arr[i].status,
              hour: hour,
              minute: minute,
              sleepTime: sleepTime.substring(16, 21),
              wakeTime: wakeTime.substring(16, 21),
              total1: total
            })
            break;
          } else {
            wx.showLoading({
              title: '暂无数据',
            });
            this.setData({
              isShow: false
            })
          }
        }
      }, err => {
        console.log(err)
      })
    }, err => {
      console.log(err)
    })
  },
  toDataInfo() {
    const obj = {
      total1: this.data.total1,
      total2: this.data.total2,
      total3: this.data.total3,
      clickDate: this.data.clickDate,
      status: this.data.status
    };
    wx.navigateTo({
      url: '../dataInfo/dataInfo?json=' + JSON.stringify(obj),
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
  onShow: function() { //在sonShow和点击日历时都需要调用下面俩个function
    const date = new Date();
    this.data.clickDate = String(date.getFullYear()) + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
    this.getYZYdata(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.getZXYdata(date.getFullYear(), date.getMonth() + 1, date.getDate());
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