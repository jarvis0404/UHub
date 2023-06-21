import clipperNaviConfigs from './clipper-nav';

Page({
    data: {
        account: '',
        avatar: '',
        password: '',
        nickname: '',
        motto: '',
        clipperNaviConfigs,
        currentConfig: {},
        toolsConfig: {},
        currentIndex: 0
    },
    onLoad: function () {
        const current = this.data.clipperNaviConfigs[this.data.currentIndex];
        this.setData({
            currentConfig: current.config,
            toolsConfig: current.toolsConfig
        });
    },
    linclip(event) {
        let {
            clipperNaviConfigs,
            currentIndex
        } = this.data;
        clipperNaviConfigs[currentIndex].config.resultImageUrl = event.detail.url;
        this.setData({
            clipperNaviConfigs,
            'currentConfig.show': false
        });
    },
    upload(event) {
        const currentIndex = event.currentTarget.dataset.index;
        const current = this.data.clipperNaviConfigs[currentIndex];
        let currentConfig = current.config;
        let toolsConfig = current.toolsConfig;

        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                console.log('lqh', tempFilePaths)
                currentConfig.imageUrl = tempFilePaths;
                currentConfig.show = true;
                this.setData({
                    currentConfig,
                    toolsConfig,
                    currentIndex
                });
            }
        });
    },
    showClipper(event) {
        const currentIndex = event.currentTarget.dataset.index;
        const current = this.data.clipperNaviConfigs[currentIndex];
        let currentConfig = current.config;
        let toolsConfig = current.toolsConfig;
        currentConfig.show = true;
        this.setData({
            currentConfig,
            currentIndex,
            toolsConfig
        });
    },
    register(e) {
        // console.log(this.data.clipperNaviConfigs[0].config.resultImageUrl)

        if (!this.data.account) {
            wx.showToast({
                title: '还没填写账号~',
                icon: 'error'
            })
        }
        else if (!this.data.password) {
            wx.showToast({
                title: '还没填写密码~',
                icon: 'error'
            })
        }
        else if (!this.data.nickname) {
            wx.showToast({
                title: '还没填写昵称~',
                icon: 'error'
            })
        }
        else if (!this.data.motto) {
            wx.showToast({
                title: '还没填写个性签名~',
                icon: 'error'
            })
        }
        else if (!this.data.clipperNaviConfigs[0].config.resultImageUrl) {
            wx.showToast({
                title: '还没上传头像~',
                icon: 'error'
            })
        }
        else {
            wx.showLoading({
                title: '上传图片中...',
                mask: true
            })
            wx.cloud.uploadFile({
                filePath: this.data.clipperNaviConfigs[0].config.resultImageUrl,
                cloudPath: `users/avatar/${new Date().getTime()}.png`,
            }).then((res) => {

                // res 要带上括号！
                // console.log('res.fileID', res.fileID)
                wx.hideLoading();

                this.setData({
                    avatar: res.fileID
                })
                wx.cloud.callFunction({
                    name: 'register',
                    data: {
                        account: this.data.account,
                        password: this.data.password,
                        avatar: res.fileID,
                        nickname: this.data.nickname,
                        motto: this.data.motto,
                        joined: []
                    },
                    success: res => {
                        wx.showToast({
                            title: '注册成功',
                        })
                        console.log('register', res)

                        let that = this

                        wx.showModal({
                            title: '是否使用该账号登录？',
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                    wx.setStorageSync('account', that.data);
                                    wx, wx.navigateBack({
                                        delta: 1,
                                        success: (res) => {
                                            wx.showToast({
                                                title: '登陆成功'
                                            })
                                        }
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                    wx.showToast({
                                        title: '你点击了取消',
                                    })
                                }
                            }
                        })
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
            })
        }


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
    }
})