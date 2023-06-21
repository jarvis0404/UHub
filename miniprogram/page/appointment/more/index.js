
Page({

    data: {
        pagedata: {}
    },
    onLoad(options) {
        // console.log('Options', options)
        var pagedata = JSON.parse(options.data)
        var index = JSON.parse(options.index)
        console.log('JSON', pagedata)
        // console.log(index)

        this.setData({
            pagedata: pagedata,
            index: index
        })
    },
    join(e) {

        let that = this
        wx.showModal({
            title: '确定加入了吗？',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    var single_pagedata = that.data.pagedata
                    // var time = new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0, 8);
                    var account = wx.getStorageSync('account')
                    var pagedata = wx.getStorageSync('union')

                    var members = single_pagedata.members

                    if (account.account == that.data.pagedata.publisher) {
                        wx.showToast({
                            title: '自己不需要加入~',
                            icon: 'error'
                        })
                        return
                    }

                    // 判断人数是否已满
                    if (single_pagedata.sum <= 1 + single_pagedata.members.length) {
                        wx.showToast({
                            title: '人数已满~',
                            icon: 'error'
                        })
                        return
                    }

                    //判断是否加入过
                    for (var i = 0; i < members.length; ++i) {
                        if (members[i].account == account.account) {
                            wx.showToast({
                                title: '你已经加入了',
                                icon: 'error'
                            })
                            return
                        }
                    }

                    // console.log('my pagedata', pagedata)
                    // 向members添加的数据
                    members.push({
                        nickname: account.nickname,
                        avatar: account.avatar,
                        account: account.account,
                    });

                    var joined = account.joined

                    if (!joined) {
                        joined = []
                    }

                    joined.push(single_pagedata.name)
                    console.log('joined???', joined)

                    wx.cloud.callFunction({
                        name: 'modify_user',
                        data: {
                            account: account.account,
                            joined: joined
                        },
                        success: (res) => {
                            console.log('members更新数据的结果：', res.result.event);
                            wx.showToast({
                                title: '数据添加成功',
                            })
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })

                    single_pagedata.members = members
                    that.setData({
                        pagedata: single_pagedata
                    })

                    var index = that.data.index
                    // console.log(pagedata[index])

                    pagedata[index].members = members

                    // 更新到pagedata云端 合理版
                    wx.cloud.callFunction({
                        name: 'userOptions',
                        data: {
                            option: 'update',
                            update_page: 'union',
                            updated_page_data: pagedata
                        },
                        success: (res) => {
                            console.log('更新数据的结果：', res.result.event);
                            wx.showToast({
                                title: '数据添加成功',
                                success: (res) => {
                                    wx.showToast({
                                        title: '加入成功',
                                    })
                                }
                            })
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })

                    console.log(pagedata[index].members, pagedata[index].name)

                    //  更新到union
                    wx.cloud.callFunction({
                        name: 'union',
                        data: {
                            option: 'updata_project',
                            name: pagedata[index].name,
                            members: pagedata[index].members
                        },
                        success: (res) => {
                            console.log('union更新数据的结果：', res);
                            wx.showToast({
                                title: '数据添加成功',
                                success: (res) => {
                                    wx.showToast({
                                        title: '加入成功',
                                    })
                                }
                            })
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.showToast({
                        title: '已取消',
                    })
                    return
                }
            }
        })
    }
})