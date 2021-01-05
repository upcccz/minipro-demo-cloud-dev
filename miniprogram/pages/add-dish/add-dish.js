// miniprogram/pages/add-dish/add-dish.js
let fileIds = [];
let isConfirm = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    fileIds = [];
    this.setData({
      selectFile: this.selectFile.bind(this),
      uploadFile: this.uploadFile.bind(this)
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
    if (!isConfirm && fileIds.length) {
      wx.cloud.deleteFile({
        fileList: fileIds,
        success: res => {
          console.log('从云存储中删除成功', res.fileList);
          fileID = '';
        },
        fail: console.error
      })
    }
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

  },
  handleEmptyTips(str, replace) {
    wx.showToast({
      title: replace ? str : `${str}不能为空`,
      icon: 'none'
    })
  },

  submitForm() {
    console.log(this.data.formData);
    const { dishName, dishPrice, dishDesc } = this.data.formData;
    if (!dishName) {
      this.handleEmptyTips('菜名')
      return;
    }

    if (!dishPrice) {
      this.handleEmptyTips('价格')
      return;
    }

    if (!dishDesc) {
      this.handleEmptyTips('优惠')
      return;
    }

    if(fileIds.length !== 2) {
      console.log(fileIds)
      this.handleEmptyTips('需要上传2张菜品图片哦~', true);
      return;
    }

    // 上传到数据库
    this.updateDatabase();
  },
  updateDatabase() {
    const { dishName, dishPrice, dishDesc } = this.data.formData;
    const db = wx.cloud.database()
    db.collection('menu').add({
      data: {
        dishName,
        dishPrice,
        dishDesc,
        fileIds,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
        isConfirm = true;
        wx.redirectTo({
          url: '/pages/index/index',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  selectFile(files) {
    console.log('files', files)
  },
  uploadError(e) {
    console.log('upload error', e.detail) 
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },
  uploadFile(res) {
    console.log(res);
    return new Promise((resolve) => {
      const filePath = res.tempFilePaths[0]
      const cloudPath = 'my-image' + Date.now() + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          fileIds.push(res.fileID);
          console.log('[上传文件] 成功：', res)
          resolve({
            urls: [filePath]
          })
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
      })
    })
  },
  deleteFile({detail}) {
    const deleteImgId = fileIds[detail.index];
    fileIds.splice(detail.index, 1);
    if (deleteImgId) {
      wx.cloud.deleteFile({
        fileList: [deleteImgId],
        success: res => {
          console.log('从云存储中删除成功', res.fileList);
          fileID = '';
        },
        fail: console.error
      })
    }
  }
})