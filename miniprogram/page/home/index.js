
Page({
      jumpPage(e) {
        console.log(e.currentTarget.dataset)
        console.log("invoke jump page")
        wx.navigateTo({
          url: `/page/home/${e.currentTarget.dataset.des}/index`,
        })
      },
      data: {
        pageList: [
          {
            key: 1,
            title: "hobby",
            description: "大学生交流兴趣爱好，让你与志同道合者畅所欲言。",
            image_src: "https://tvax1.sinaimg.cn/large/008tUvTqly1heeim84enhj305k05kglu.jpg",
            des: 'hobby'
          },
          {
            key: 2,
            title: "confess",
            description: "大学生表白墙，倾诉心声，传递爱意，勇敢表达。让爱在校园里绽放。",
            image_src: "https://tvax1.sinaimg.cn/large/008tUvTqgy1heeiq82vj3j305k05k3ym.jpg",
            des: 'confess'
          },
          {
            key: 3,
            title: "sports",
            description: "汇聚运动爱好者，分享经验、组织活动，挑战极限，激发激情，让运动成为校园生活的一部分。加入我们，追逐梦想，释放能量！",
            image_src: "https://tvax4.sinaimg.cn/large/008tUvTqgy1heeit6sccxj305k05kweg.jpg",
            des: 'sports'
          },
          {
            key: 4,
            title: "todo",
            description: "todolist",
            image_src: "https://img1.baidu.com/it/u=1197037464,3766627062&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
            des: 'todo'
          }
        ]
      }
})