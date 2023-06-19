Page({
    data: {
        comment: '输入你想说的~',
        pageData: {},
        index: 0,
        liked: false,
        is_me: false
    },
    onLoad: function (option) {
        let page_data = JSON.parse(option.page_data)
        console.log(page_data)
        console.log(option.index)

        this.setData({
            pageData: page_data,
            index: option.index
        })
    },
    change_content: function (e) {
        console.log(e.detail.value)
        this.setData({
            comment: e.detail.value
        })
    },
    handin() {
        var cloud_pagedata = wx.getStorageSync('dynamic')
        var account = wx.getStorageSync('account')
        var i = this.data.index
        // [account.nickname, account.avatar, this.data.comment]
        var time = new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0,8);

        cloud_pagedata[i].comments.push([account.nickname, account.avatar, time,this.data.comment])

        console.log(cloud_pagedata[i])

        wx.cloud.callFunction({
            name: 'userOptions',
            data: {
                option: 'update',
                update_page: 'dynamic',
                updated_page_data: cloud_pagedata
            },
            success: (res) => {
                console.log('更新数据的结果：', res.result.event);
                wx.showToast({
                    title: '评论成功~',
                })
                this.onShow();
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    onPullDownRefresh() {
        this.get_cloudPagedata()
    },
    onShow() {
        this.get_cloudPagedata()
    },
    get_cloudPagedata() {
        var i = this.data.index
        console.log('i', i)
        wx.cloud.callFunction({
            name: 'userOptions',
            data: {
                option: 'get',
                page: 'dynamic'
            },
            success: (res) => {
                var is_me = this.data.is_me
                var liked = this.data.liked
                var account = wx.getStorageSync('account')
                var datalist = res.result.data[0].pagedata
                wx.setStorageSync('dynamic', res.result.data[0].pagedata);
                // console.log('修改前的', datalist)

                // 判断某条动态是否为我发布的
                if (datalist[i].publisher == account.account)
                    is_me = true

                // 判断我是否已经点赞过了
                if (datalist[i].liked_users.indexOf(account.account) != -1)
                    liked = true

                if (datalist) {
                    this.setData({
                        pageData: datalist[i],
                        is_me: is_me,
                        liked: liked
                    })
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },
    addLike: function (e) {
        var i = this.data.index

        var cloud_pagedata = wx.getStorageSync('dynamic')
        var account = wx.getStorageSync('account')

        if (this.data.liked == false) {
            cloud_pagedata[i].liked_users.push(account.account);
            this.setData({
                liked: true
            })
            wx.showToast({
                title: '点赞成功',
            })
        }
        else {
            cloud_pagedata[i].liked_users.splice(cloud_pagedata[i].liked_users.indexOf(account.account), 1);
            this.setData({
                liked: false
            })
            wx.showToast({
                title: '取消点赞',
            })
        }

        console.log(cloud_pagedata[i])

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
})