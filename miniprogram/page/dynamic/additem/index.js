


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
    confirm(e) {
        let that = this
        wx.showModal({
            title: '确定了吗',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    that.handin();
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    handin: function () {
        var pagedata = wx.getStorageSync('dynamic')
        var time = new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0, 8);

        var account = wx.getStorageSync('account')
        // console.log('lqh: account info:', account)

        // 向数据库添加的数据
        pagedata.push({
            nickname: account.nickname,
            content: this.data.content,
            update_time: time,
            avatar: account.avatar,
            urls: this.data.urls,
            publisher: account.account,
            comments: [],
            liked_users: []
        });

        console.log('上传前的urls', this.data.urls)

        // 问题应该出现在云函数
        wx.cloud.callFunction({
            name: 'userOptions',
            data: {
                option: 'update',
                update_page: 'dynamic',
                updated_page_data: pagedata
            },
            success: (res) => {
                console.log('更新数据的结果：', res.result.event);
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
    change_content: function (e) {
        console.log(e.detail.value)
        this.setData({
            content: e.detail.value
        })
    },
    upload_image(e) {
        // console.log('upload image...');
        // console.log('上传的图片数量：', e.detail.all.length)
        // 应该是current!!
        var cnt = e.detail.current.length
        // console.log('eee',e)
        var account = wx.getStorageSync('account')

        // 解决异步问题！！
        // 带上mask！
        wx.showLoading({
            title: '上传图片中...',
            mask: true
        })

        // write a loop to upload images
        for (var i = 0; i < e.detail.current.length; ++i) {
            // 解决同时上传文件命名可能相同的问题！！
            // 在time stamp后加上index
            // 多个用户同时上传可能出错
            wx.cloud.uploadFile({
                filePath: e.detail.current[i],
                cloudPath: `images/dynamic/${account.account}${new Date().getTime()}${i}.png`,
                success: (res) => {
                    // console.log('success 中的fileID',res.fileID)
                    var urls = this.data.urls;
                    urls.push(res.fileID);
                    // console.log('okay' + i)
                    this.setData({
                        urls: urls
                    })
                    cnt--;
                    if (cnt == 0) {
                        wx.hideLoading();
                    }
                }
            })
        }
    }
})