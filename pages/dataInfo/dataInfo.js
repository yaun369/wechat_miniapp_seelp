// pages/dataInfo/dataInfo.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();

function initChart(canvas, width, height) {
  wx.getStorage({
    key: 'arrData',
    success(res) {
      console.log("arrData", res.data);
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      var option = {
        color: ["#37A2DA", "#67E0E3"],
        // legend: {
        //   data: ['温度', '湿度'],
        //   top: 50,
        //   left: 'center',
        //   backgroundColor: 'red',
        //   z: 100
        // },
        grid: {
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: res.data.time,
          // show: false
        },
        yAxis: {
          x: 'center',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
          // show: false
        },
        series: [{
          name: '温度',
          type: 'line',
          smooth: true,
          data: res.data.temArr
        }, {
          name: '湿度',
          type: 'line',
          smooth: true,
          data: res.data.humArr
        }]
      };

      chart.setOption(option);
      return chart;
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const obj = JSON.parse(options.json);
    this.getYZYdata(obj.clickDate);
    let report1 = "";
    let report2 = "";
    if (obj.total1 < 70) {
      report2 = "睡眠时间较短，请提前入睡";
    } else {
      report2 = "继续保持良好入眠时间";
    }
    switch (obj.status) {
      case "正常状态":
        report1 = "继续保持睡前良好状态";
        break;
      case "工作压力":
        report1 = "学会释放工作压力";
        break;
      case "运动过":
        report1 = "睡前一小时不要进行有氧运动";
        break;
      case "睡前饮食":
        report1 = "睡前尽量不要摄入高热量餐饮";
        break;
      case "饮酒咖啡":
        report1 = "睡前杜绝饮酒和咖啡，避免浅睡状态";
        break;
      case "其他":
        report1 = "做一些助眠工作";
        break;
    }
    this.setData({
      obj: obj,
      report1: report1,
      report2: report2,
      ec: {
        onInit: initChart
      }
    })
  },
  getYZYdata(date) { //原子云获取数据
    wx.request({
      url: 'https://cloud.alientek.com/api/orgs/365/devicepacket/71889130897836053884',
      method: 'GET',
      data: {
        page: 1,
        limit: 10000,
        start: date + ' 00:00:00', //设置请求的具体时间时段
        end: date + ' 23:59:59'
      },
      header: {
        token: "1df6094d37601c8dea7192197da8b380"
      },
      success: res => {
        let array = [];
        let val = "";
        for (let n = 0; n < res.data.data.items.length; n++) { //循环处理数据
          let str = res.data.data.items[n].hex_packet;
          let arr = str.split(" ");
          for (let i = 0; i < arr.length; i++) {
            val += parseInt(arr[i], 16); //十六进制转换
          }
          if (str != '41 4C 49 45 4E 54 45 4B 2D 48 52 54 44 54') { //摘除心跳包
            let temperature = val.substring(2, 4);
            let humidity = val.substring(4, 6);
            res.data.data.items[n].temperature = temperature;
            res.data.data.items[n].humidity = humidity;
            res.data.data.items[n].time = res.data.data.items[n].time.substring(11, 13);
            array.push(res.data.data.items[n]);
          }
        }
        let result = [array[0]];
        for (let i = 1, len = array.length; i < len; i++) { //数组去重
          array[i].time !== array[i - 1].time && result.push(array[i]);
        }
        console.log(result);
        let temArr = [];
        let humArr = [];
        let time = [];
        for (let obj of result) { //取出温度，湿度和对应的时间
          time.push(obj.time);
          temArr.push(obj.temperature);
          humArr.push(obj.humidity);
        }
        console.log(time, humArr, temArr);
        wx.setStorage({
          key: 'arrData',
          data: {
            time: time,
            humArr: humArr,
            temArr: temArr
          }
        })
      }
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