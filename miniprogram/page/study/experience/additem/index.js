// page/study/experience/additem/index.js
Page({
  data: {
    content: '',
    update_time: '',
    avatar: '',
    nickname: '',
    urls: [],
    title: ''
  },
  handin: function() {
    var experience_data = wx.getStorageSync('experience_data')
    var time = new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0,8);
    var account = wx.getStorageSync('account')
    console.log('lqh: account info:', account)
    experience_data.push({
        // likes: 0,
        // liked: false,
        // comments: 0,
        nickname: account.nickname,
        content: this.data.content,
        update_time: time,
        avatar: account.avatar,
        urls: this.data.urls,
        // title: this.data.title
    });
    // console.log('experience_data:', experience_data)
    
    // updata ok!!
    wx.cloud.callFunction({
        name: 'userOptions',
        data: {
          option: 'update',
          update_page: 'experience',
          updated_page_data: experience_data
        },
        success: res => {
        console.log('更新数据的结果：',res)
          wx.showToast({
            title: '数据添加成功',
          })
        },
        fail: err => {
          console.log(err)
        }
    })

    wx.navigateBack({
        delta: 1
    });
  },
  addtitle(e) {
    console.log(e.detail.value)
    this.setData({
        title: e.detail.value
    })
  },
  addnickname(e) {
    console.log(e.detail.value)
    this.setData({
        nickname: e.detail.value
    })
  },
  change_content: function(e) {
    console.log(e.detail.value)
    this.setData({
        content: e.detail.value
    })
  },
  upload_image: function(e) {
    console.log('upload image...');
    console.log('上传的图片数量：', e.detail.all.length)

    // write a loop to upload images
    for (var i = 0; i<e.detail.all.length; ++i)
    {
        wx.cloud.uploadFile({
            filePath: e.detail.all[i],
            cloudPath: `images/experience/${new Date().getTime()}.png`,
          }).then(res => {
              // console.log(res.fileID)
              var urls = this.data.urls;
              urls.push(res.fileID);
              // console.log('okay')
              this.setData({
                  urls: urls
              })
          })
    }
  },
})