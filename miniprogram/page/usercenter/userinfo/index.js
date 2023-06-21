// page/usercenter/userinfo/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        account:'',
        isshow:0
    },
    onShow:function() {
        var account = wx.getStorageSync('account')
        var isshow = wx.getStorageSync('isshow')
        if(account){
          this.setData({
            account:account,
          })
        }
        if(isshow==1){
            this.setData({
              isshow:1,
            })
          }else{
            this.setData({
                isshow:0
          })
        }
    },
    jumpPage(e) {
        console.log(e.currentTarget.dataset)
        console.log("invoke jump page")
        wx.navigateTo({
          url: `/page/usercenter/userinfo/${e.currentTarget.dataset.des}/index`,
        })
      },

})