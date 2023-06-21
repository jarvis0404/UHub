var myCharts = require("../../../utils/wxcharts.js")//引入一个绘图的插件

const devicesId = "1099709288" // 填写在OneNet上获得的devicesId 形式就是一串数字 例子:9939133
const api_key = "XB=KhqHUEIbCNbdxAbZ1J=fEBJg=" // 填写在OneNet上的 api-key 例子: VeFI0HZ44Qn5dZO14AuLbWSlSlI=

const APIKEY = "5eafcceaf3ad4d75b5aa10e4cb568c8a";// 填入你申请的KEY

Page({
    data: {},

    /**
     * @description 页面下拉刷新事件
     */
    onPullDownRefresh: function () {

        wx.showLoading({
            title: "正在获取"
        })
        this.getDatapoints().then(datapoints => {
            this.update(datapoints)
            wx.hideLoading()
        }).catch((error) => {
            wx.hideLoading()
            console.error(error)
        })
    },

    /**
     * @description 页面加载生命周期
     */
    onLoad: function () {
        this.getLocation()

        console.log(`your deviceId: ${devicesId}, apiKey: ${api_key}`)

        //每隔6s自动获取一次数据进行更新
        const timer = setInterval(() => {
            this.getDatapoints().then(datapoints => {
                this.update(datapoints)
            })
        }, 5000)

        wx.showLoading({
            title: '加载中'
        })

        this.getDatapoints().then((datapoints) => {
            wx.hideLoading()
            this.firstDraw(datapoints)
        }).catch((err) => {
            wx.hideLoading()
            console.error(err)
            clearInterval(timer) //首次渲染发生错误时禁止自动刷新
        })
    },

    /**
     * 向OneNet请求当前设备的数据点
     * @returns Promise
     */
    getDatapoints: function () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Temperature,Humidity&limit=20`,
                /**
                 * 添加HTTP报文的请求头, 
                 * 其中api-key为OneNet的api文档要求我们添加的鉴权秘钥
                 * Content-Type的作用是标识请求体的格式, 从api文档中我们读到请求体是json格式的
                 * 故content-type属性应设置为application/json
                 */
                header: {
                    'content-type': 'application/json',
                    'api-key': api_key
                },
                success: (res) => {
                    const status = res.statusCode
                    const response = res.data
                    if (status !== 200) { // 返回状态码不为200时将Promise置为reject状态
                        reject(res.data)
                        return;
                    }
                    if (response.errno !== 0) { //errno不为零说明可能参数有误, 将Promise置为reject
                        reject(response.error)
                        return;
                    }

                    if (response.data.datastreams.length === 0) {
                        reject("当前设备无数据, 请先运行硬件实验")
                    }

                    //程序可以运行到这里说明请求成功, 将Promise置为resolve状态
                    resolve({
                        temperature: response.data.datastreams[0].datapoints.reverse(),
                        humidity: response.data.datastreams[1].datapoints.reverse()
                    })
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },

    /**
     * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
     * 传入获取到的数据点, 函数自动更新图标
     */
    update: function (datapoints) {
        const wheatherData = this.convert(datapoints);

        this.lineChart_hum.updateData({
            categories: wheatherData.categories,
            series: [{
                name: 'humidity',
                data: wheatherData.humidity,
                format: (val, name) => val.toFixed(2)
            }],
        })

        this.lineChart_tempe.updateData({
            categories: wheatherData.categories,
            series: [{
                name: 'tempe',
                data: wheatherData.tempe,
                format: (val, name) => val.toFixed(2)
            }],
        })

    },

    /**
     * 
     * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
     * 传入数据点, 返回使用于图表的数据格式
     */
    convert: function (datapoints) {
        var categories = [];
        var humidity = [];
        var tempe = [];

        var length = datapoints.humidity.length
        for (var i = 0; i < length; i++) {
            categories.push(datapoints.humidity[i].at.slice(5, 19));
            humidity.push(datapoints.humidity[i].value);
            tempe.push(datapoints.temperature[i].value);
        }
        return {
            categories: categories,
            humidity: humidity,
            tempe: tempe
        }
    },

    /**
     * 
     * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
     * 传入数据点, 函数将进行图表的初始化渲染
     */
    firstDraw: function (datapoints) {

        //得到屏幕宽度
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        var wheatherData = this.convert(datapoints);

        //新建湿度图表
        this.lineChart_hum = new myCharts({
            canvasId: 'humidity',
            type: 'line',
            categories: wheatherData.categories,
            animation: false,
            background: '#f5f5f5',
            series: [{
                name: 'humidity',
                data: wheatherData.humidity,
                format: function (val, name) {
                    return val.toFixed(2);
                }
            }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                title: '湿度(%)',
                format: function (val) {
                    return val.toFixed(2);
                }
            },
            width: windowWidth,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'curve'
            }
        });

        //新建温度图表
        this.lineChart_tempe = new myCharts({
            canvasId: 'tempe',
            type: 'line',
            categories: wheatherData.categories,
            animation: false,
            background: '#f5f5f5',
            series: [{
                name: 'temperature',
                data: wheatherData.tempe,
                format: function (val, name) {
                    return val.toFixed(2);
                }
            }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                title: '温度(摄氏度)',
                format: function (val) {
                    return val.toFixed(2);
                }
            },
            width: windowWidth,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },
    //选择定位
    selectLocation() {
        var that = this
        wx.chooseLocation({
            success(res) {
                //console.log(res)
                that.setData({
                    location: res.longitude + "," + res.latitude
                })
                that.getWeather()
                that.getCityByLoaction()
            }
            , fail() {
                wx.getLocation({
                    type: 'gcj02',
                    fail() {
                        wx.showModal({
                            title: '获取地图位置失败',
                            content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
                            success(mRes) {
                                if (mRes.confirm) {
                                    wx.openSetting({
                                        success: function (data) {
                                            if (data.authSetting["scope.userLocation"] === true) {
                                                that.selectLocation()
                                            } else {
                                                wx.showToast({
                                                    title: '授权失败',
                                                    icon: 'none',
                                                    duration: 1000
                                                })
                                            }
                                        }, fail(err) {
                                            console.log(err)
                                            wx.showToast({
                                                title: '唤起设置页失败，请手动打开',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                })

            }
        })
    },
    /**
     * 获取定位
     */
    getLocation() {
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                that.setData({
                    location: res.longitude + "," + res.latitude
                })
                that.getWeather()
                that.getCityByLoaction()
            }, fail(err) {
                wx.showModal({
                    title: '获取定位信息失败',
                    content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
                    success(mRes) {
                        if (mRes.confirm) {
                            wx.openSetting({
                                success: function (data) {
                                    if (data.authSetting["scope.userLocation"] === true) {
                                        wx.showToast({
                                            title: '授权成功',
                                            icon: 'success',
                                            duration: 1000
                                        })
                                        that.getLocation()
                                    } else {
                                        wx.showToast({
                                            title: '授权失败',
                                            icon: 'none',
                                            duration: 1000
                                        })
                                        that.setData({
                                            location: "116.41,39.92"
                                        })
                                        that.getWeather()
                                        that.getCityByLoaction()
                                    }
                                }, fail(err) {
                                    console.log(err)
                                    wx.showToast({
                                        title: '唤起设置页失败，请手动打开',
                                        icon: 'none',
                                        duration: 1000
                                    })
                                    that.setData({
                                        location: "116.41,39.92"
                                    })
                                    that.getWeather()
                                    that.getCityByLoaction()
                                }
                            })
                        } else if (mRes.cancel) {
                            that.setData({
                                location: "116.41,39.92"
                            })
                            that.getWeather()
                            that.getCityByLoaction()
                        }
                    }
                })
            }
        })
    },
    /**
     * 根据坐标获取城市信息
     */
    getCityByLoaction() {
        var that = this
        wx.request({
            url: 'https://geoapi.qweather.com/v2/city/lookup?key=' + APIKEY + "&location=" + that.data.location,
            success(result) {
                var res = result.data
                if (res.code == "200") {
                    var data = res.location[0]
                    that.setData({
                        City: data.adm2,
                        County: data.name
                    })
                } else {
                    wx.showToast({
                        title: '获取城市信息失败',
                        icon: 'none'
                    })
                }

            }
        })
    },
    /**
     * 获取天气
     */
    getWeather() {
        var that = this
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: 'https://devapi.qweather.com/v7/weather/now?key=' + APIKEY + "&location=" + that.data.location,
            success(result) {
                var res = result.data
                //console.log(res)
                that.setData({
                    now: res.now
                })
            }
        })
        wx.request({
            url: 'https://devapi.qweather.com/v7/weather/24h?key=' + APIKEY + "&location=" + that.data.location,
            success(result) {
                var res = result.data
                //console.log(res)
                res.hourly.forEach(function (item) {
                    item.time = that.formatTime(new Date(item.fxTime)).hourly
                })
                that.setData({
                    hourly: res.hourly
                })
            }
        })
        wx.request({
            url: 'https://devapi.qweather.com/v7/weather/7d?key=' + APIKEY + "&location=" + that.data.location,
            success(result) {
                var res = result.data
                //console.log(res)
                res.daily.forEach(function (item) {
                    item.date = that.formatTime(new Date(item.fxDate)).daily
                    item.dateToString = that.formatTime(new Date(item.fxDate)).dailyToString
                })
                that.setData({
                    daily: res.daily
                })
                wx.hideLoading()
            }
        })
    },
    // 格式时间
    formatTime(date) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        const weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
        const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
        return {
            hourly: [hour, minute].map(this.formatNumber).join(":"),
            daily: [month, day].map(this.formatNumber).join("-"),
            dailyToString: isToday ? "今天" : weekArray[date.getDay()]
        }
    },
    // 补零
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },
})
