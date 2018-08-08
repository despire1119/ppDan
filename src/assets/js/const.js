import { setInterval } from "core-js";

//私有常量不暴露出去
const 
  userInfoMsg = {
    "apiLevel": 0,
    "appId": "10021449",
    "appPackageName": "com.android.mediacenter",
    "appVersionCode": "80006300",
    "appVersionName": "8.0.6.300",
    "appLayout": "Phone",
    "emuiVersionCode": "13",
    "emuiVersionName": "EmotionUI_5.1",
    "channel": "24000000",
    "cpId": "1002144900002",
    "lang": "zh_CN",
    "countryCode": "CN",
    "exParam": "",
    "isLogin": "true",
    "serial": "",
    "deviceModel": "STF-TL10",
    "deviceid": "864034030011260",
    "cpid": "32",
    "screen": "1920*1080",
    "brand": "HONOR",
    "os": "7.0",
    "rom": "EmotionUI_5.1",
    "emmcid": "11010030363447333000c9719f119300",
    "appkey": "10386231",
    "nickname": "djctt****@163.com",
    "headimgurl": "",
    "safeToken": "7d61c1c73898f3a3fd01b6a9e99c97b6562cc5fefd8fc72a0dc87f74f0650bbd",
    "status": 1,  //1：成功，0：请求中，-1：
    "h-Coins": 0
  },
  devErrMsg = {
    "9010110001": "参数异常",
    "9010120001": "session失效",
    "9010120003": "用户认证失败",
    "9010130001": "活动未开始",
    "9010130002": "活动已结束",
    "9010130003": "无抽奖次数",
    "9010130006": "超过最大参与次数",
    "9010130007": "超过最大成团数",
    "9010130004": "活动不存在",
    "9010130005": "奖品不存在",
    "9010130008": "用户已投票",
    "9010140001": "外部接口返回异常",
    "9010199998": "未登录",
    "9010199999": "系统异常",
    "9010200001": "打卡次数超上限",
    "9010200003": "活动期间投票超上限",
    "9010200004": "当天投票超上限",
    "9010200005": "客户端访问AT认证失败",
    "9010200006": "用户年鉴数据不存在",
    "9010200007": "用户年鉴分享Session不存在",
    "9010200008": "非指定时间段内，不能参与活动",
    "9010200009": "花币回调验签失败",
    "9010200011": "音乐卡已使用",
    "9010200012": "音乐卡已冻结",
    "9010200013": "音乐卡已过期",
    "9010200014": "音乐卡兑换会员订单失败",
    "9010200015": "音乐卡不存在",
    "9010200016": "音乐卡作废",
    "9010200017": "不是音乐卡",
    "9010110002": "活动不支持该区域",
    "9010300001": "消息鉴权失败"
  },
  prdErrMsg = {
    "9010130001": "活动未开始",
    "9010130002": "活动已结束",
    "9010130003": "无抽奖次数",
    "9010130006": "超过最大参与次数",
    "9010130007": "超过最大成团数",
    "9010130004": "活动不存在",
    "9010130005": "奖品不存在",
    "9010130008": "用户已投票",
    "9010200001": "打卡次数超上限",
    "9010200003": "活动期间投票超上限",
    "9010200004": "当天投票超上限",
    "9010200006": "用户年鉴数据不存在",
    "9010200007": "用户年鉴分享Session不存在",
    "9010200008": "非指定时间段内，不能参与活动",
    "9010200011": "音乐卡已使用",
    "9010200012": "音乐卡已冻结",
    "9010200013": "音乐卡已过期",
    "9010200014": "音乐卡兑换会员订单失败",
    "9010200015": "音乐卡不存在",
    "9010200016": "音乐卡作废",
    "9010200017": "不是音乐卡",
    "9010110002": "活动不支持该区域",
  }

export const getParam = callback => {
    let flag = 1
    const params = window.JsInterface ? JSON.parse(window.JsInterface.getParams()) : '',
      timer = setInterval(() => {
        if(params['status'] == 1 || flag > 14){
          clearInterval(timer)
          if(callback) callback(params)
          return params
        }else{
          flag+=1
        }
      },1000)
  }

export const serverUrl = {
  'local': "http://117.78.36.94:8081",
  'development': "http://117.78.36.94:8281",
  // 'production': "https://campaign-music.hicloud.com"
  'production': "http://117.78.36.94:8281"
}

export const userInfo = (() => process.env.NODE_ENV.indexOf("local") > -1 ? userInfoMsg : window.JsInterface ?  getParams() : "")()
// export const userInfo = getParam()

export const errMsgForDisplay = (() => !(process.env.NODE_ENV.indexOf("production")  > -1) ? devErrMsg : prdErrMsg)()