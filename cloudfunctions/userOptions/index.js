// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  //写有关于数据库操作的地方
  //获取数据库的连接对象
  const db = cloud.database();

  //在一个云函数里面有4种数据库操作。所以要先判断是什么操作：增删改查

 //增 ok
  if(event.option=='add'){
    console.log(event)
    return await db.collection('public_data').add({
      // 花括号里面是你要添加的对象
      data: {
        page: event.page,
        pagedata: event.pagedata,
        operator: '李庆浩',
        _id: event.page
      },
      //可添加多条或一条
      //event:包含传过来的所有数据的一个对象
  });
}

//删 not ok
else if(event.option=="delete"){
  return await db.collection('public_data').where({
    //将要删除的值赋给name
    username: event.delname
  }).remove();
}

//查 ok
else if(event.option=="get"){
  return await db.collection('public_data').where({
    page: event.page
  }).get({
    success:function(res){
      return res
    }
  })
}

//改
else if(event.option=="update"){
  return await db.collection('public_data').where({
       page: event.update_page
  }).update({
    data:{
      pagedata: event.updated_page_data
    }
  })
}
}

