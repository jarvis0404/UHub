Page({
  data: {
    account: '',
    isshow:'true',
    currentKey: 1,
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
  onShow:function() {
    var account = wx.getStorageSync('account')
    if(account){
      this.setData({
        account:account,
        isshow:false
      })
    }

  },
})