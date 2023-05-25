// page/study/index.js
Page({
  jumpPage(e) {
    console.log(e.currentTarget.dataset)
    console.log("invoke jump page")
    wx.navigateTo({
      url: `/page/study/${e.currentTarget.dataset.des}/index`,
    })
  },
  data: {
    pageList: [
      {
        key: 1,
        title: "ToDoList",
        description: "高效有序，全能待办清单页面，包含日计划、周计划、月计划和deadlines，助你轻松提升工作效率",
        image_src: "https://img1.baidu.com/it/u=1197037464,3766627062&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
        des: 'todo'
      },
      {
        key: 2,
        title: "交流答疑",
        description: "打破学习孤岛，大学生交流答疑学习页面，汇集学科学习方法和题目交流，共同探讨、解答，助力学业进步！",
        image_src: "https://img2.baidu.com/it/u=778203409,525023124&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        des: 'FAQ'
      },
      {
        key: 3,
        title: "经验分享",
        description: "共享智慧，启迪学习，大学生学习经验分享页面，汇聚宝贵经验，相互启发，助你走向学业成功！",
        image_src: "https://img2.baidu.com/it/u=2951375564,2710107034&fm=253&fmt=auto&app=138&f=PNG?w=435&h=436",
        des: 'experience'
      },
      {
        key: 4,
        title: "资源分享",
        description: "畅享学习，资源无限。这个页面提供电子资源分享和书籍推荐，帮助大学生们获得更多学习资料，提升成绩",
        image_src: "https://tse3-mm.cn.bing.net/th/id/OIP-C.KDIdY2N6jOY1JCKefdI1VgHaE8?w=248&h=180&c=7&r=0&o=5&pid=1.7",
        des: 'share'
      }
    ]
  }
})