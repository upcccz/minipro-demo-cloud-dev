// miniprogram/pages/dish-info/dish-info.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    dishInfo: {},
    buyNum: 1,
    orderData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    let dishInfo = {};
    const db = wx.cloud.database();
    db.collection('menu').where({
      _id: id,
    })
    .get().then(res => {
      dishInfo = res.data[0];
      this.setData({
        id,
        dishInfo
      })
      this.initPage();
    }).catch(console.error)
  },
  initPage() {
    const { dishInfo } = this.data;
    console.log(dishInfo);
    const { dishName, _id } = dishInfo;
    wx.setNavigationBarTitle({
      title: dishName,
    })

    const db = wx.cloud.database();
    db.collection('order_info').where({
      order_id: _id,
    })
    .get().then(res => {
      console.log(res.data[0]);
      this.setData({
        orderData: res.data[0] || {}
      })
    }).catch(console.error)
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
    return {
      title: '来恰饭吧',
      path: `/pages/add-dish/add-dish?id${this.data.id}`,
    };
  },
  handleNO() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  handleBuyNum(e) {
    const action = e.currentTarget.dataset.action;
    let buyNum = this.data.buyNum;
    if (action === 'cut') {
      buyNum--
    }

    if (action === 'add') {
      buyNum++
    }

    buyNum = Math.max(1, buyNum);
    this.setData({
      buyNum
    })
  },
  handleDo() {
    const { _id } = this.data.dishInfo;
    const db = wx.cloud.database();
    db.collection('order_info').where({
      order_id: _id
    }).get().then(res => {
      if (!res.data.length) {
        this.addRecord();
      } else {
        this.updateRecord();
      }
    })
  },
  addRecord() {
    const { dishName, _id, dishPrice } = this.data.dishInfo;
    const { buyNum } = this.data;
    const totalMoney = Number(dishPrice) * Number(buyNum);
    app.globalData.billInfo = {
      order_id: _id,
      dishName,
      buyNum,
      totalMoney,
      peopleNum: 1,
      averagePrice: dishPrice,
      averageJs: 5
    }
    const db = wx.cloud.database();
    db.collection('order_info').add({
      data: app.globalData.billInfo
    }).then(res => {
      
      if(res.errMsg === 'collection.add:ok') {
        wx.redirectTo({
          url: `/pages/bills/bills?id=${_id}&buyNum=${buyNum}`,
        })
      }
    })
  },
  updateRecord() {
    const { orderData } = this.data;
    const { dishPrice } = this.data.dishInfo;

    let { averagePrice, peopleNum, order_id, buyNum } = orderData;
    // 选择购买数量
    const currBuyNum  = this.data.buyNum;
    // 总数量
    let finallyBuyNum = Number(buyNum) + currBuyNum;
    // 当前购买该菜品的总金额
    let finallyMoney = Number(dishPrice) * Number(finallyBuyNum);
    // 参与人数
    let finallyPeople = peopleNum + 1;
    // 超过10份
    let moreTotal = finallyMoney * 0.8;
    let moreJs = (Number(dishPrice) - (moreTotal / finallyBuyNum)).toFixed(2);
    // 未超过10份
    let addTotal = finallyMoney - (5 * finallyBuyNum);
    let addJs = (Number(dishPrice) - ( addTotal / finallyBuyNum)).toFixed(2);
    // 人均节省
    let averageJs = finallyPeople > 10 ? moreJs : addJs;
    // 人均金额
    averagePrice = finallyPeople > 10 ? moreTotal / finallyBuyNum : addTotal / finallyBuyNum;

    app.globalData.billInfo = {
      peopleNum: finallyPeople,
      buyNum: finallyBuyNum,
      totalMoney: finallyMoney,
      averageJs,
      averagePrice,
      order_id
    }

    wx.redirectTo({
      url: `/pages/bills/bills?id=${this.data.id}&buyNum=${currBuyNum}`,
    })
  }
})