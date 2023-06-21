// page/usercenter/response/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    jumpPage(e) {
        console.log(e.currentTarget.dataset)
        console.log("invoke jump page")
        wx.navigateTo({
          url: `/page/usercenter/response/${e.currentTarget.dataset.des}/index`,
        })
      },
})