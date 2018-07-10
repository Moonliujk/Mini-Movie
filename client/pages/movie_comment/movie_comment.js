// pages/movie_comment/movie_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieName: '壁花少年',
    commentList: [
      {
        name: 'Lesile',
        image: '../../image/user.jpg',
        comment: '真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！真的很好看，强烈推荐！',
      },
      {
        name: 'Lesile',
        image: '../../image/user.jpg',
        comment: '真的很好看，强烈推荐！',
      },
    ],
    isShowModal: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  /**
   * 显示弹出层
   */
  onTapShowComment(e) {
    let isShowModal = !this.data.isShowModal

    this.setData({
      isShowModal
    })
  },
  /**
   * 隐藏弹出层
   */
  onTapHiddenModal() {
    let isShowModal = false

    this.setData({
      isShowModal
    })
  }
})