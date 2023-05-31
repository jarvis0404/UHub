Page({
  data: {
        datalist: [
          {
          likes: 0,
          liked: false,
          comments: 0,
          nickname: 'Ackerman',
          content: '什么都无法舍弃的人 什么都改变不了',
          update_time: 'right now',
          avatar: 'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c',
          urls: [
            'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c',
            'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c',
            'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c',
            'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c',
            'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c',
            'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c',
            'https://picx.zhimg.com/v2-4e92b8b1fd38e0b81bb984829293fe6a_xl.jpg?source=32738c0c'
          ]
          }
        ]
  },
  onLoad: function() {
      // 加载页面后读取缓存
      var datalist = wx.getStorageSync('share_data')
      if (datalist) {
        this.setData({
          datalist: datalist
        })
      }
  },
  save: function() {
    // 将修改的数据更新至缓存
    wx.setStorageSync('share_data', this.data.datalist);
  },
  addLike: function(e) {
    // console.log(e.currentTarget.dataset.index)
    // console.log(typeof e.currentTarget.dataset.index)
    
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
      // console.log(dataList[e.currentTarget.dataset.index].likes)
      this.setData({
        datalist: datalist
      });
    }
    this.save();
  }
})