const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        account: '',
        avatar: '',
        info: {
            nickname: '',
            motto: ''
        },
        customValue:'',
    },
    onShow: function () {
        var account = wx.getStorageSync('account')
        if (account) {
            this.setData({
                account: account.account,
                avatar: account.avatar,
                nickname: account.nickname,
                motto: account.motto,
                sex: account.sex,
                birthday: account.birthday,
                phone: account.phone,
                hometown: account.hometown,
            })
        }
        
    },
    onLoad:function(){
        var isshow = wx.getStorageSync('isshow')
        if(isshow==1){
            this.setData({
              customValue:1,
            })
          }else{
            this.setData({
                customValue:0
          })
        }
    },
    avatar_change: function () {
        let that = this
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success: res => {
                console.log('上传成功')
                console.log(res.tempFiles[0].tempFilePath)
                console.log(res.tempFiles[0].size)
                that.setData({
                    avatar: res.tempFiles[0].tempFilePath,
                })
                console.log(res)
                wx.showLoading({
                    title: '上传图片中',
                    mask: true
                })
                wx.cloud.uploadFile({
                    filePath: that.data.avatar,
                    cloudPath: `images/user/avatar/${new Date().getTime()}.png`,
                    success: (res) => {
                        console.log('success 中的fileID', res.fileID)
                        that.setData({
                            avatar: res.fileID
                        })
                        wx.hideLoading();
                        wx.cloud.callFunction({
                            name: 'update',
                            data: {
                                account: that.data.account,
                                avatar: that.data.avatar,
                                nickname: that.data.nickname,
                                motto: that.data.motto,
                            },
                            success: (res) => {
                                console.log(that.data)
                                wx.setStorage({
                                    key:'account',
                                    data:that.data
                                })
                                wx.showToast({
                                    title: '修改成功',
                                    icon: 'success'
                                })
                            },
                            fail: (err) => {
                                console.log(err)
                                wx.showToast({
                                    title: '修改失败',
                                    icon: 'error'
                                })
                            }
                        })
                    }
                })

            }
        })
    },
    jumpPage(e) {
        console.log(e.currentTarget.dataset)
        console.log("invoke jump page")
        wx.navigateTo({
          url: `/page/usercenter/userinfo/infoSetting/${e.currentTarget.dataset.des}/index`,
        })
      },
      onChange(e) {
          console.log(e.detail.checked)
        this.setData({
          customValue: e.detail.checked,
        })
        wx.setStorageSync('isshow',e.detail.checked)
      }
})