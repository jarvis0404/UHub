
Page({
    data: {
        grids: [
            {
                is_selected: 'yes',
                text: '全部',
                sum: 0
            },
            {
                is_selected: 'not',
                text: '运动',
                sum: 0
            },
            {
                is_selected: 'not',
                text: '自习',
                sum: 0
            },
            {
                is_selected: 'not',
                text: '游戏',
                sum: 0
            },
            {
                is_selected: 'not',
                text: '电影',
                sum: 0
            },
            {
                is_selected: 'not',
                text: '拼车',
                sum: 0
            },
            {
                is_selected: 'not',
                text: '旅行',
                sum: 0
            },
            {
                is_selected: 'not',
                text: '其他',
                sum: 0
            }
        ],
        datalist: []
    },
    to_more(e) {
        console.log(e.currentTarget.dataset.index)
        var index = e.currentTarget.dataset.index
        var data = this.data.datalist[index]
        // console.log(data)
        console.log('IIIndex????', index)

        wx.navigateTo({
            url: `/page/appointment/more/index?data=${JSON.stringify(data)}&index=${index}`,
        });
    },
    get_cloud_data: function () {

        // 读取缓存账号数据
        var account = wx.getStorageSync('account')
        // this.setData({
        //     account: account
        // })

        console.log('account1', account)

        wx.cloud.callFunction({
            name: 'get',
            data: {
                account: account.account,
                des_collection: 'users'
            },
            success: (res) => {
                console.log('res res:', res)
                wx.setStorageSync('account', res.result.get.data[0])
            },
            fail: (err) => {
                console.log(err)
            }
        })

        account = wx.getStorageSync('account')

        var now = ''

        // 加载页面后读取union page云端数据 最终版
        wx.cloud.callFunction({
            name: 'userOptions',
            data: {
                option: 'get',
                page: 'union'
            },
            success: (res) => {
                console.log('调用get获得的页面数据：', res.result.data[0].pagedata);
                // console.log(res)
                var datalist = res.result.data[0].pagedata
                wx.setStorageSync('union', res.result.data[0].pagedata);

                var grids = this.data.grids
                console.log('grids', grids)

                if (!grids[0].sum) {
                    for (var i = 0; i < datalist.length; ++i) {
                        switch (datalist[i].theme) {
                            case "运动":
                                grids[1].sum += 1;
                                break;
                            case "自习":
                                grids[2].sum += 1;
                                break;
                            case "游戏":
                                grids[3].sum += 1;
                                break;
                            case "电影":
                                grids[4].sum += 1;
                                break;
                            case "拼车":
                                grids[5].sum += 1;
                                break;
                            case "旅行":
                                grids[6].sum += 1;
                                break;
                            case "其他":
                                grids[7].sum += 1;
                                break;
                        }
                    }
                }

                grids[0].sum = datalist.length;
                this.setData({
                    grids: grids
                })


                // 看目前的选择
                for (var i = 0; i < grids.length; ++i) {
                    if (grids[i].is_selected == 'yes') {
                        now = grids[i].text
                        // break;
                    }
                }

                for (var i = 0; i < datalist.length; ++i) {
                    if (datalist[i].theme == now || now == '全部') {
                        console.log('show', datalist[i].theme)
                        Object.assign(datalist[i], { is_show: true })
                    }
                    else {
                        console.log('not show', datalist[i].theme)
                        Object.assign(datalist[i], { is_show: false })
                    }

                }

                console.log('data list', datalist)
                if (datalist) {
                    this.setData({
                        datalist: datalist
                    })
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })

    },
    select(e) {
        console.log(e.currentTarget.dataset)
        var index = e.currentTarget.dataset.index
        var grids = this.data.grids

        for (var i = 0; i < grids.length; ++i) {
            grids[i].is_selected = "not"
        }

        var now = grids[index].text
        grids[index].is_selected = 'yes'

        this.setData({
            grids: grids
        })
        // console.log(this.data.grids)
        var datalist = this.data.datalist

        for (var i = 0; i < datalist.length; ++i) {
            if (datalist[i].theme == now || now == '全部') {
                console.log('show', datalist[i].theme)
                Object.assign(datalist[i], { is_show: true })
            }
            else {
                console.log('not show', datalist[i].theme)
                Object.assign(datalist[i], { is_show: false })
            }

        }

        console.log('data list', datalist)
        if (datalist) {
            this.setData({
                datalist: datalist
            })
        }
    },
    jump(e) {
        console.log(e.currentTarget.dataset.des)
        wx.navigateTo({
            url: `/page/appointment/${e.currentTarget.dataset.des}/index`,
        })
    },
    onShow() {
        this.get_cloud_data();
    },
    onLoad() {
        this.get_cloud_data();
    },
    // onReady() {
    //     this.get_cloud_data();
    // }
})