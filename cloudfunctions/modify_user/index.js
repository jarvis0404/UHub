// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();

    return {
        event: event,
        update_res: await db.collection('users').where({
            account: event.account
        }).update({
            data: {
                joined: event.joined
            }
        })
    }
}