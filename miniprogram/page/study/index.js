// page/study/index.js
Page({
  jumpPage() {
    console.log("invoke jump page")
    wx.navigateTo({
      url: '/page/study/todo/index',
    })
  }
})