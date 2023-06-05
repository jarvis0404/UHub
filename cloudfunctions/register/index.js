// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    //获取数据库的引用
    const db = cloud.database();

     //增 ok
    await db.collection('users').add({
      // 花括号里面是你要添加的对象
      data: {
        operator: '李庆浩',
        _id: event.account,
        account: event.account,
        password: event.password,
        avatar: event.avatar,
        nickname: event.nickname,
        motto: event.motto
      },
      //可添加多条或一条
      //event:包含传过来的所有数据的一个对象
     });

    return {
        event
    }
}