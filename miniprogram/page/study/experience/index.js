


Page({
  data: {
        datalist: [],
        envId: '',
        page: 'experience'
  },
  onShow() {
      // 加载页面后读取缓存
      wx.cloud.callFunction({
        name: 'userOptions',
        data: {
            option: 'get',
            page: 'experience'
        },
        success: (res) => {
            console.log('调用get获得的页面数据：', res.result.data[0].pagedata);
            var datalist = res.result.data[0].pagedata
            wx.setStorageSync('experience_data', res.result.data[0].pagedata);
            console.log('right now page datalist from cloud:', datalist)
            if (datalist) {
              this.setData({
                datalist: datalist
              })
            }
            wx.showToast({
            title: '读取云数据成功',
            })
            console.log(res.result.data)
        },
        fail: (err) => {
            console.log(err)
        }
     })
  },
  onLoad: function() {
      // 加载页面后读取缓存
      wx.cloud.callFunction({
        name: 'userOptions',
        data: {
            option: 'get',
            page: 'experience'
        },
        success: (res) => {
            console.log('调用get获得的页面数据：', res.result.data[0].pagedata);
            var datalist = res.result.data[0].pagedata
            wx.setStorageSync('experience_data', res.result.data[0].pagedata);
            console.log('right now page datalist from cloud:', datalist)
            if (datalist) {
              this.setData({
                datalist: datalist
              })
            }
            wx.showToast({
            title: '读取云数据成功',
            })
            console.log(res.result.data)
        },
        fail: (err) => {
            console.log(err)
        }
     })
  },
  save: function() {
    // 将修改的数据更新至缓存
    wx.setStorageSync('experience_data', this.data.datalist);
  },
  addLike: function(e) {
    var datalist = this.data.datalist;
    
    if (datalist)
    {
      // if already liked, delelte the like
      if (datalist[e.currentTarget.dataset.index].liked == true)
      {
        datalist[e.currentTarget.dataset.index].likes--;
        datalist[e.currentTarget.dataset.index].liked = false;
      }
      else {
        datalist[e.currentTarget.dataset.index].likes++;
        datalist[e.currentTarget.dataset.index].liked = true;
      }
      this.setData({
        datalist: datalist
      });
    }
    
    // updata ok!!
    wx.cloud.callFunction({
        name: 'userOptions',
        data: {
          option: 'update',
          update_page: 'experience',
          updated_page_data: datalist
        },
        success: res => {
        console.log('更新数据的结果：',res)
          wx.showToast({
            title: '点赞成功！',
          })
        },
        fail: err => {
          console.log(err)
        }
    })
    // this.save();
  },
  to_additem: function(e) {
    var account = wx.getStorageSync('account')
    if (!account)
    {
        wx.showToast({
          title: '请先登录！',
          icon: "error"
        })
    }
    else {
        wx.navigateTo({
            url: '/page/study/experience/additem/index',
          })
    }

  },
  onPullDownRefresh() {
    // 刷新页面后重新读取云端数据
    wx.cloud.callFunction({
        name: 'userOptions',
        data: {
            option: 'get',
            page: 'experience'
        },
        success: (res) => {
            console.log('调用get获得的页面数据：', res.result.data[0].pagedata);
            var datalist = res.result.data[0].pagedata
            wx.setStorageSync('experience_data', res.result.data[0].pagedata);
            console.log('right now page datalist from cloud:', datalist)
            if (datalist) {
                this.setData({
                datalist: datalist
                })
            }
            wx.showToast({
            title: '刷新数据成功',
            })
            console.log(res.result.data)
        },
        fail: (err) => {
            console.log(err)
        }
        })
  }
})