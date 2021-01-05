// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData: [],
    bannerImg: [
      {
        url: '/images/banner.png',
      },
      {
        url: '/images/banner2.png',
      },
      {
        url: '/images/banner3.png',
      },
      {
        url: '/images/banner4.png',
      }
    ],
    loadingMore: false,
    loadingComplete: false,
    navArr: ['美食', '甜品', '冷饮', '水果', '星选好店'],
    sIndex: 0,
  },

  // handleNav(e) {
  //   const { index } = e.currentTarget.dataset;
  //   const db = wx.cloud.database();
  //   db.collection('menu').skip((index * 4)).limit(4).get().then(res => {
  //     // res.data 包含该记录的数据
  //     console.log(res.data)
  //     this.setData({
  //       imgData: res.data,
  //       sIndex: 0,
  //     })
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // wx.getSystemInfo({
    //   success(res) {
    //     console.log(res);
    //   }
    // })
    const db = wx.cloud.database();
    db.collection('menu').limit(4).get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data)
      this.setData({
        imgData: res.data
      })
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
    this.setData({
      loadingMore: true,
    })
    this.loadData();
  },
  loadData() {
    const { sIndex, imgData } = this.data;
    let cIndex = sIndex;
    cIndex++;

    if (sIndex >= 2) {
      this.setData({
        loadingComplete: true,
        loadingMore: false,
      })
      return;
    }

    const db = wx.cloud.database();
    db.collection('menu').skip(cIndex * 4).limit(4).get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data)
      this.setData({
        imgData: imgData.concat(res.data),
        sIndex: cIndex,
        loadingMore: false,
        loadingComplete: cIndex >= 2,
      })
    }).catch(() => {
      this.setData({
        loadingMore: false
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toAdd() {
    wx.navigateTo({
      url: '/pages/add-dish/add-dish',
    })
  },
  toDetails(e) {
    console.log(e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish-info/dish-info?id=${id}`,
    })
  }
})