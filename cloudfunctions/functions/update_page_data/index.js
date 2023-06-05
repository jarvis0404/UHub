const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  try {
    // 修改数据库信息
    await db.collection('public_data').where({
        _id: 'experience'
      }).update({
          data: {
            experience: event.data
          },
    });
    return {
      success: true,
      data: event.data,
      my_data: 'okkkkk'
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
