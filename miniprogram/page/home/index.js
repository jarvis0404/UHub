
Page({
    jumpPage(e) {
        console.log(e.currentTarget.dataset)
        console.log("invoke jump page")
        wx.navigateTo({
            url: `/page/home/${e.currentTarget.dataset.des}/index`,
        })
    },
    data: {
        swiperCurrent:"",  //指示点
        pageList: [
            {
                key: 1,
                title: "To Do list",
                description: "这个页面旨在帮助您更好地组织和管理您的任务和待办事项。我们开发了这个ToDo页面，以帮助您跟踪和完成所有任务。",
                image_src: "https://img1.baidu.com/it/u=1197037464,3766627062&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
                des: 'todo'
            },
            {
                key: 2,
                title: "沙河实时天气",
                description: "为您提供准确、实时的天气信息，帮助您更好地了解和计划您的日常活动，让您随时了解当前和未来的天气状况。",
                image_src: "https://tvax1.sinaimg.cn/large/008tUvTqly1hf3qsfywzpj305k05kaa9.jpg",
                des: 'weather'
            }

        ],
        ImgUrls: [
            "https://tvax2.sinaimg.cn/large/008tUvTqly1hf60nsxy86j31hc0u0b29.jpg",
            "https://tvax3.sinaimg.cn/large/008tUvTqly1hf60pzqbyhj31hc0u0e82.jpg",
            "https://tvax3.sinaimg.cn/large/008tUvTqly1hf60qsf27vj31jf111npe.jpg",
            "https://tvax2.sinaimg.cn/large/008tUvTqly1hf60sn2xl7j33mm21hhdw.jpg",
            "https://tvax1.sinaimg.cn/large/008tUvTqly1hf617xke5qj33y8280he7.jpg"
        ]
    },
    swiperChange: function (e) {  //指示图标
        this.setData({
          swiperCurrent:e.detail.current
        })
    }
})