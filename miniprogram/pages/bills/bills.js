// miniprogram/pages/bills/bills.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billInfo: {},
    buyNum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    const db = wx.cloud.database();
    db.collection('order_info').where({
      order_id: id,
    })
    .get().then(res => {
      console.log(res.data[0]);
      this.setData({
        billInfo: res.data[0] || {},
        buyNum: res.data[0].buyNum
      })
    }).catch(console.error)
  },

  toPay() {
    console.log(app.globalData.billInfo)
    const { peopleNum, buyNum, totalMoney, averageJs, order_id } = app.globalData.billInfo;
  
    wx.cloud.callFunction({
      name: 'updateOrderInfo',
      data: {
        peopleNum,
        buyNum,
        totalMoney,
        averageJs,
        order_id
      },
      success: function(res) {
        console.log(res)
        if (res.errMsg === 'cloud.callFunction:ok') {
          wx.redirectTo({
            url: '/pages/success-tip/success-tip',
          })
        }
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})