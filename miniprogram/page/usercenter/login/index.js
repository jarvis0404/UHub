Page({
    data: {
        account: '',
        password: ''
    },
    login(e) {
        console.log(this.data.account)
        // wx.cloud.callFunction({
        //     name: 'get',
        //     data: {
        //         account: this.data.account,
        //         des_collection: 'users'
        //     },
        //     success: (res) => {
        //         wx.showToast({
        //          title: '读取云数据成功',
        //         })
        //         console.log(res)
        //     },
        //     fail: (err) => {
        //         console.log(err)
        //     }
        //  })
        wx.cloud.callFunction({
            name: 'get',
            data: {
                account: this.data.account,
                des_collection: 'users'
            },
            success: (res) => {
                console.log(res.result.get.data[0].password)
                if (!this.data.password)
                {
                    wx.showToast({
                      title: '请输入密码',
                      icon: 'error'
                    })
                }
                else if (this.data.password == res.result.get.data[0].password)
                {
                    wx.setStorageSync('account', res.result.get.data[0])

                    wx.showToast({
                        title: '登录成功',
                        icon: 'success'
                    })

                    wx.navigateBack({
                        delta: 1
                    })
                }
                else {
                    wx.showToast({
                        title: '密码错误！',
                        icon: 'error'
                      })
                }
            },
            fail: (err) => {
                console.log(err)
            }
         })
    },
    add_account(e) {
        console.log(e.detail.value)
        this.setData({
            account: e.detail.value
        })
    },
    add_password(e) {
        console.log(e.detail.value)
        this.setData({
            password: e.detail.value
        })
    },
})