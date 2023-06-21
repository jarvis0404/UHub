// page/usercenter/response/error/index.js
Page({
    data: {
        sceenShot: '',
        description: '',
    },
    upload_screenshot: function (e) {
        wx.showLoading({
            title: '上传图片中',
            mask: true
        })

        // console.log(e)
        wx.cloud.uploadFile({
            filePath: e.detail.current[0],
            cloudPath: `feedback/suggstions/${new Date().getTime()}.png`,
        }).then((res) => {
            // res 要带上括号！
            console.log(res.fileID)

            this.setData({
                sceenShot: res.fileID
            })
            wx.hideLoading();
        })
    },
    description(e) {
        console.log(e.detail.value)
        this.setData({
            description: e.detail.value
        })
    },
    upload(e) {
        var account = wx.getStorageSync('account')
        // console.log('this.data:', this.data)
        console.log(account.account)
        //console.log(this.data.sceenShot)
        //console.log(this.data.discription)

        var time = new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0, 8);

        var url = this.data.sceenShot
        var description = this.data.description
        console.log(url)
        console.log(description)

        if (!description) {
            wx.showToast({
                title: '还没描述问题~',
                icon: 'error'
            })
            return
        }

        if (!url) {
            wx.showModal({
                title: '确定不上传截图吗？',
                complete: (res) => {
                    if (res.cancel) {
                        return
                    }
                }
            })
        }

        wx.showModal({
            title: '确定了吗？',
            complete: (res) => {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'feedback',
                        data: {
                            option: 'suggestions',
                            account: account.account,
                            urls: url,
                            description: description,
                            time: time
                        },
                        success: (res) => {
                            console.log('add的结果：', res);
                            wx.navigateBack({
                                delta: 1,
                                success:(res) => {
                                    wx.showToast({
                                        title: '感谢你的反馈！',
                                    })
                                }
                            })
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })
                }
            }
        })

    },
})