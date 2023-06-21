// page/usercenter/response/error/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentKey: '',
        sceenShot: '',
        description: '',
        items: [{
            id: 1,
            name: '无法打开小程序',
            checked: true
        }, {
            id: 2,
            name: '界面闪退'
        }, {
            id: 3,
            name: '界面死机'
        }, {
            id: 4,
            name: '界面卡顿',
        }, {
            id: 5,
            name: '界面错位'
        }, {
            id: 6,
            name: '其它问题'
        },
        ],
    },
    onChange(e) {
        console.log(e.detail.key)
        this.setData({
            currentKey: e.detail.key
        })
    },
    upload_screenshot: function (e) {
        wx.showLoading({
            title: '上传图片中',
            mask: true
        })

        // console.log(e)
        wx.cloud.uploadFile({
            filePath: e.detail.current[0],
            cloudPath: `feedback/errors/${new Date().getTime()}.png`,
        }).then((res) => {
            // res 要带上括号！
            console.log(res.fileID)

            this.setData({
                sceenShot: res.fileID
            })
            wx.hideLoading();
        })
    },
    discription(e) {
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

        if (!this.data.currentKey) {
            wx.showToast({
                title: '请选择类型~',
                icon: 'error'
            })
            return
        }

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
                            option: 'errors',
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