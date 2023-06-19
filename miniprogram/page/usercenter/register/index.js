Page({
    data: {
        account: '',
        avatar: '',
        password: '',
        info: {
            nickname: '',
            motto: ''
        }
    },
    register(e) {
        console.log('???', this.data)
        wx.cloud.callFunction({
            name: 'register',
            data: {
                account: this.data.account,
                password: this.data.password,
                avatar: this.data.avatar,
                nickname: this.data.nickname,
                motto: this.data.motto
            },
            success: res => {
              wx.showToast({
                title: '注册成功',
              })
              console.log('register',res)

              // bug: 只能设置一次缓存数据
              wx.setStorageSync('account', this.data)
              wx.navigateBack();
            },
            fail: (err) => {
              // console.log('注册失败提示信息:', err.errCode)
              if (err.errCode == -1) {
                wx.showToast({
                    title: '账号已存在',
                    icon: 'error'
                })
                console.log('账号已存在，无法注册...')
              }
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
    add_nickname(e) {
        console.log(e.detail.value)
        this.setData({
            nickname: e.detail.value
        })
    },
    add_motto(e) {
        console.log(e.detail.value)
        this.setData({
            motto: e.detail.value
        })
    },
    upload_avatar: function(e) {
        
        // 解决异步问题！！
        // 带上mask！
        wx.showLoading({
            title: '上传图片中...',
            mask: true
        })
        wx.cloud.uploadFile({
            filePath: e.detail.all[0],
            cloudPath: `users/avatar/${new Date().getTime()}.png`,
        }).then((res) => {
            // res 要带上括号！
            console.log(res.fileID)
            
            this.setData({
                avatar: res.fileID
            })
            wx.hideLoading();
        })
    }
})