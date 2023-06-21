

Page({
    data: {
        lst: []
    },
    get_data() {
        var account = wx.getStorageSync('account')

        var lst = []

        wx.cloud.callFunction({
            name: 'get',
            data: {
                account: account.account,
                des_collection: 'users'
            },
            success: (res) => {
                console.log(res.result.get.data[0])
                var data = res.result.get.data[0].joined
                if (!data) {
                    wx.navigateBack({
                        delta: 1,
                        success: res => {
                            wx.showToast({
                                title: '未加入任何项目~',
                                icon: 'error'
                            })
                        }
                    })
                }
                else {
                    var name_lst = data
                    for (var i = 0; i < name_lst.length; ++i) {
                        wx.cloud.callFunction({
                            name: 'union',
                            data: {
                                option: 'findproject',
                                name: name_lst[i]
                            },
                            success: (res) => {
                                console.log('cloud的结果：', i,  res.result.get.data[0]);

                                lst.push(res.result.get.data[0])
                                console.log('lst :', lst)

                                this.setData({
                                    lst: lst
                                })
                            },
                            fail: err => {
                                console.log(err)
                            }
                        })
                    }

                    console.log('this.data', this.data)
                    // this.setData({
                    //     lst: lst
                    // })
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },
    onLoad() {
        this.get_data();
    },
    onShow() {
        this.get_data();
    }
})