Page({
  data: {
    account: '',
  },
  jumpPage(e) {
    console.log(e.currentTarget.dataset)
    console.log("invoke jump page")
    wx.navigateTo({
      url: `/page/usercenter/${e.currentTarget.dataset.des}/index`,
    })
  },
  register(e) {
      wx.navigateTo({
        url: '/page/usercenter/register/index'
    })
  },
  onshow() {
    wx.cloud.callFunction({
        name: 'get',
        data: {
            des_collection: 'users',
            key: this.data.account,
        },
        success: (res) => {
            console.log(res);

            wx.showToast({
            title: '读取云数据成功',
            })
        },
        fail: (err) => {
            console.log(err)
        }
     })
  }
})