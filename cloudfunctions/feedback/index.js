// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();

    if (event.option == 'errors') {
        return {
            event: event,
            result:  await db.collection('errors').add({
                data: {
                    account: event.account,
                    screen_shots: event.urls,
                    description: event.description,
                    time: event.time
                }
            })
        }
    }

    if (event.option == 'suggestions') {
        return {
            event: event,
            result:  await db.collection('suggestions').add({
                data: {
                    account: event.account,
                    screen_shots: event.urls,
                    description: event.description,
                    time: event.time
                }
            })
        }
    }
}