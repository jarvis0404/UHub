
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
    },
    onShareAppMessage :function() {
        const promise = new Promise(resolve => {
          setTimeout(() => {
            resolve({
              title: '邮hub'
            })
          }, 2000)
        })
        return {
          title: '邮hub',
          path: 'page/home/index',
          promise 
        }
      },
      back(e){
          wx.switchTab({
            url: '/page/home/index',
          })
      }
})