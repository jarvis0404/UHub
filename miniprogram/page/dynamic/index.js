Page({
    data: {
        datalist: [],
        envId: '',
        page: 'dynamic',
        account: {}
    },
    newPage(e) {
        console.log(e.currentTarget.dataset)

        let data = this.data.datalist[e.currentTarget.dataset.index]

        console.log('data at experience', data)
        wx.navigateTo({
            url: `/page/dynamic/newPage/index?page_data=${JSON.stringify(data)}&index=${e.currentTarget.dataset.index}`
        })
    },
    onShow() {
        this.get_cloud_data();
    },
    onLoad: function () {
        this.get_cloud_data();
    },
    get_cloud_data: function () {
        // 读取缓存账号数据
        var account = wx.getStorageSync('account')
        this.setData({
            account: account
        })

        // 加载页面后读取云端数据 最终版
        wx.cloud.callFunction({
            name: 'userOptions',
            data: {
                option: 'get',
                page: 'dynamic'
            },
            success: (res) => {
                // console.log('调用get获得的页面数据：', res.result.data[0].pagedata);
                var datalist = res.result.data[0].pagedata
                wx.setStorageSync('dynamic', res.result.data[0].pagedata);
                // console.log('修改前的', datalist)

                for (var i = 0; i < datalist.length; ++i) {
                    // is_me 只是保存在了this.data中,没上云
                    // 判断某条动态是否为我发布的
                    if (datalist[i].publisher == account.account) {
                        // datalist[i].is_me = true
                        Object.assign(datalist[i], { is_me: true })
                    }
                    else {
                        Object.assign(datalist[i], { is_me: false })
                    }

                    // 判断我是否已经点赞过了
                    if (datalist[i].liked_users.indexOf(account.account) != -1) {
                        Object.assign(datalist[i], { liked: true })
                    }
                    else {
                        console.log('okay')
                        Object.assign(datalist[i], { liked: false })
                    }
                }

                if (datalist) {
                    this.setData({
                        datalist: datalist,
                    })
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },
    addLike: function (e) {
        var i = e.currentTarget.dataset.index
        var datalist = this.data.datalist

        var cloud_pagedata = wx.getStorageSync('dynamic')
        var account = wx.getStorageSync('account')

        if (datalist[i].liked == false) {
            cloud_pagedata[i].liked_users.push(account.account);
            wx.showToast({
                title: '点赞成功',
            })
        }
        else {
            cloud_pagedata[i].liked_users.splice(cloud_pagedata[i].liked_users.indexOf(account.account), 1);
            wx.showToast({
                title: '取消点赞',
            })
        }

        console.log(cloud_pagedata[i])
        // updata cloud data
        wx.cloud.callFunction({
            name: 'userOptions',
            data: {
                option: 'update',
                update_page: 'dynamic',
                updated_page_data: cloud_pagedata
            },
            success: (res) => {
                console.log('更新数据的结果：', res.result.event);
                this.onShow();
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    to_additem: function (e) {
        var account = wx.getStorageSync('account')
        if (!account) {
            wx.showToast({
                title: '请先登录！',
                icon: "error"
            })
        }
        else {
            wx.navigateTo({
                url: '/page/dynamic/additem/index',
            })
        }
    },
    onPullDownRefresh() {
        this.get_cloud_data();
    },
    delete_item(e) {
        let that = this
        wx.showModal({
            title: '确定删除吗？',
            content: '删除之后无法再次获得哦~',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    console.log(e.currentTarget.dataset.index)
                    var page_data = wx.getStorageSync('dynamic')

                    page_data.splice(e.currentTarget.dataset.index, 1)
                    // console.log(experience_data)
                    wx.cloud.callFunction({
                        name: 'userOptions',
                        data: {
                            option: 'update',
                            update_page: 'dynamic',
                            updated_page_data: page_data
                        },
                        success: res => {
                            console.log('删除数据的结果：', res)
                            wx.showToast({
                                title: '删除成功',
                            })
                            that.onShow();
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.showToast({
                      title: '已取消',
                      icon: "none"
                    })
                }
            }
        })


    },
    get_cloudPagedata() {
        wx.cloud.callFunction({
            name: 'userOptions',
            data: {
                option: 'get',
                page: 'experience'
            },
            success: (res) => {
                // console.log('调用get获得的页面数据：', res.result.data[0].pagedata);
                var datalist = res.result.data[0].pagedata
                wx.setStorageSync('experience_data', res.result.data[0].pagedata);
                // console.log('修改前的', datalist)

                for (var i = 0; i < datalist.length; ++i) {
                    // is_me 只是保存在了this.data中,没上云
                    // 判断某条动态是否为我发布的
                    if (datalist[i].publisher == account.account) {
                        // datalist[i].is_me = true
                        Object.assign(datalist[i], { is_me: true })
                    }
                    else {
                        Object.assign(datalist[i], { is_me: false })
                    }

                    // 判断我是否已经点赞过了
                    if (datalist[i].liked_users.indexOf(account.account) != -1) {
                        Object.assign(datalist[i], { liked: true })
                    }
                    else {
                        console.log('okay')
                        Object.assign(datalist[i], { liked: false })
                    }
                }

                if (datalist) {
                    this.setData({
                        datalist: datalist,
                    })
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    }
})