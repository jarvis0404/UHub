// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();
    // const wxContext = cloud.getWXContext()
    return {
        event: event,
        get: await db.collection('users').where({
            account: event.account
          }).get({
            success:function(res){
              return res
            }
          })
    }
}