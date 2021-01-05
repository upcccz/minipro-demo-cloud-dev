// components/img-placeholder/img-placeholder.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: String,
      value: ''
    },
    imgHeight: {
      type: String,
      value: 0,
    },
    imgWidth: {
      type: String,
      value: 0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showReal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imgLoadComplete() {
      this.setData({
        showReal: true
      })
    }
  }
})
