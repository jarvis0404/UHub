Page({
    data: {
        account: '',
        avatar: '',
        password: '',
        nickname: '',
        motto: '',
        sex: '0',
        birthday: '',
        phone: '',
        hometown: ''
        ,
        Sex: [{
            id: 1,
            name: "男"
        }, {
            id: 2,
            name: "女"
        }],
    },

    update(e) {
        if (this.data.sex == '0') {

        }
        else {
            wx.cloud.callFunction({
                name: 'update',
                data: {
                    account: this.data.account,
                    sex: this.data.sex,
                    birthday: this.data.birthday,
                    phone: this.data.phone,
                    hometown: this.data.hometown,
                },
                success: res => {
                    // bug: 只能设置一次缓存数据
                    wx.setStorageSync('account', this.data)
                    wx.navigateBack({
                        delta: 1,
                        success: r => {
                            wx.showToast({
                                title: '修改成功',
                            })
                        }
                    })
                },
                fail: (err) => {
                    console.log(err)
                    // console.log('注册失败提示信息:', err.errCode)
                    if (err.errCode == -1) {
                        wx.showToast({
                            title: '修改失败',
                            icon: 'error'
                        })
                    }
                }
            })
        }
    },
    choose_sex(e) {
        console.log(e.detail.key)
        this.setData({
            sex: e.detail.key,
        })
    },
    add_birthday(e) {
        console.log(e.detail.value)
        this.setData({
            birthday: e.detail.value
        })
    },
    add_phone(e) {
        console.log(e.detail.value)
        this.setData({
            phone: e.detail.value
        })
    },
    add_hometown(e) {
        console.log(e.detail.value)
        this.setData({
            hometown: e.detail.value
        })
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
})