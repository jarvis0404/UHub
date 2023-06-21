// page/appointment/additem/index.js
Page({

    data: {
        grids: [
            {
                is_selected: 'not',
                text: '运动'
            },
            {
                is_selected: 'not',
                text: '自习'
            },
            {
                is_selected: 'not',
                text: '游戏'
            },
            {
                is_selected: 'not',
                text: '电影'
            },
            {
                is_selected: 'not',
                text: '拼车'
            },
            {
                is_selected: 'not',
                text: '旅行'
            },
            {
                is_selected: 'not',
                text: '其他',
            }
        ],
        text: '',
        sum: 0,
        project_name: ''
    },
    handin(e) {
        console.log(e)
        var grids = this.data.grids
        var time = new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0, 5);

        var account = wx.getStorageSync('account')
        if (!account) {
            wx.showToast({
                title: '请先登录~',
                icon: 'error'
            })
            return
        }

        var theme = ''

        for (var i = 0; i < grids.length; ++i) {
            if (grids[i].is_selected == 'yes')
                theme = grids[i].text
        }

        console.log('theme', theme)

        // var pagedata = wx.getStorageSync('union')

        if (!theme)
            wx.showToast({
                title: '你还未选择主题~',
                icon: 'error'
            })
        else if (!this.data.text) {
            wx.showToast({
                title: '你还未填写活动详情~',
                icon: 'error'
            })
        }
        else if (!this.data.sum) {
            wx.showToast({
                title: '你还未选择人数~',
                icon: 'error'
            })
        }
        else if (!this.data.project_name) {
            wx.showToast({
                title: '你还未输入名称~',
                icon: 'error'
            })
        }
        else {
            var pagedata = wx.getStorageSync('union')
            // var time = new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0, 8);
            var account = wx.getStorageSync('account')

            // var members = [account.account]
            // console.log('my pagedata', pagedata)
            // 向数据库添加的数据
            pagedata.push({
                nickname: account.nickname,
                text: this.data.text,
                update_time: time,
                avatar: account.avatar,
                publisher: account.account,
                sum: this.data.sum,
                theme: theme,
                members: [],
                name: this.data.project_name
            });

            // 更新到union paga 合理版
            wx.cloud.callFunction({
                name: 'userOptions',
                data: {
                    option: 'update',
                    update_page: 'union',
                    updated_page_data: pagedata
                },
                success: (res) => {
                    // console.log('更新数据的结果：', res.result.event);
                    wx.showToast({
                        title: '数据添加成功',
                        success: res => {
                        }
                    })
                },
                fail: err => {
                    console.log(err)
                }
            })

            // 更新到unoin 修改版
            wx.cloud.callFunction({
                name: 'union',
                data: {
                    option: 'addproject',
                    name: this.data.project_name,
                    publisher: account.account,
                    nickname: account.nickname,
                    sum: this.data.sum,
                    time: time,
                    theme: theme,
                    text: this.data.text,
                    members: [],
                    avatar: account.avatar
                },
                success: (res) => {
                    console.log('cloud的结果：', res);
                    wx.showToast({
                        title: '数据添加成功',
                        success: res => {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    })
                },
                fail: err => {
                    console.log(err)
                }
            })

            wx.cloud.callFunction({
                name: 'get',
                data: {
                    account: account.account,
                    des_collection: 'users'
                },
                success: (res) => {
                    // console.log(res.result.get.data[0].joined)
                    var joined = res.result.get.data[0].joined
                    // console.log('this.data.project_name', this.data.project_name)

                    if (!joined) {
                        joined = []
                    }
                    joined.push(this.data.project_name)
                    // console.log('joined res:', joined)

                    // 更新到users
                    wx.cloud.callFunction({
                        name: 'modify_user',
                        data: {
                            account: account.account,
                            joined: joined
                        },
                        success: (res) => {
                            console.log('users 更新数据的结果：', res);
                            wx.navigateBack({
                                delta: 1,
                                success:(res) => {
                                    wx.showToast({
                                        title: '数据添加成功',
                                    })
                                }
                            })

                        },
                        fail: err => {
                            console.log(err)
                        }
                    })
                },
                fail: (err) => {
                    console.log(err)
                }
            })
        }
    },
    select(e) {
        // 只能选择一个

        // console.log(e.currentTarget.dataset)
        var index = e.currentTarget.dataset.index
        var grids = this.data.grids

        for (var i = 0; i < grids.length; ++i) {
            grids[i].is_selected = "not"
        }

        grids[index].is_selected = 'yes'

        this.setData({
            grids: grids
        })
        // console.log(this.data.grids)
    },
    input(e) {
        // console.log(e.detail.value)
        this.setData({
            text: e.detail.value
        })
    },
    change_sum(e) {
        console.log(e.currentTarget.dataset.type)
        var sum = this.data.sum


        if (e.currentTarget.dataset.type == 'add') {
            sum++;
        }
        else if (e.currentTarget.dataset.type == 'delete') {
            if (sum <= 0)
                return;
            else if (sum > 0)
                sum--;
        }

        this.setData({
            sum: sum
        })
    },
    name(e) {
        console.log(e.detail.value)
        this.setData({
            project_name: e.detail.value
        })
    }
})