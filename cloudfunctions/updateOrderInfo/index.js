// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database(); //链接数据库
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {

  const { peopleNum, buyNum, totalMoney, averageJs, order_id } = event;
  console.log(event);
  try {
    return db.collection('order_info').where({
      order_id: order_id,
    }).update({
      data: {
        peopleNum,
        buyNum,
        totalMoney,
        averageJs,
      }
    }).then(res => {
      console.log(res)
    })
  } catch(e) {
    console.error(e)
  }
}