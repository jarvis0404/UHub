// page/usercenter/userinfo/infoSetting/motto/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        account: '',
        avatar: '',
        password: '',
        info: {
            nickname: '',
            motto: '',
        }
    },
    onLoad: function () {
        var account = wx.getStorageSync('account')
        if (account) {
            this.setData({
                account: account.account,
                avatar: account.avatar,
                nickname: account.nickname,
                motto: account.motto,
            })
        }
    },
    change_motto(e) {
        console.log(e.detail.value)
        this.setData({
            motto: e.detail.value
        })
    },
    motto_change(e) {
        let that = this
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
                    key: 'account',
                    data: that.data
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