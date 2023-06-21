Page({
    data: {
        account: '',
        password: '',

    },
    login(e) {
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
                    wx.navigateBack({
                      delta:1,
                      success:result=>{
                        wx.showToast({
                          title: '登录成功',
                          icon: 'success'
                        })
                      }
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
        this.setData({
            account: e.detail.value
        })
    },
    add_password(e) {
        this.setData({
            password: e.detail.value
        })
    },
})