// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();

    if (event.option == 'addproject') {
        return {
            event: event,
            result: await db.collection('union').add({
                data: {
                    name: event.name,
                    description: event.text,
                    time: event.time,
                    members: event.members,
                    publisher: event.publisher,
                    sum: event.sum,
                    theme: event.theme,
                    nickname: event.nickname,
                    _id: event.name,
                    avatar: event.avatar
                }
            })
        }
    }

    if (event.option == 'findproject') {
        return {
            event: event,
            get: await db.collection('union').where({
                name: event.name
              }).get({
                success:function(res){
                  return res
                }
              })
        }
    }

    if (event.option == 'updata_project') {
        return {
            event: event,
            update_res: await db.collection('union').where({
                name: event.name
            }).update({
                data: {
                    members: event.members
                }
            })
        }
    }
    

}