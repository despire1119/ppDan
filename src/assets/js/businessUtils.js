'use strict'

import { userInfo } from "./const"
import actId from "./actId"
import axios from 'axios'
const verCode = userInfo ? userInfo['appVersionCode'] : null;
let businessUtils = {
  //px转换vw
  toVW: px => `${px*100/1080}vw`,
  // 判断终端类型
  terminalJudgment: () => process.env.NODE_ENV.indexOf("local") > -1 ? true :false,

  // 判断机型    
  modelJudgment: model => businessUtils.terminalJudgment() || userInfo.deviceModel.indexOf(model) > -1 ? true : false,

  // 判断登录状态
  loginJudgment: () => businessUtils.terminalJudgment() || userInfo.isLogin ? true : false,

  // 判断版本号
  versionJudgment: versionCode => userInfo.appVersionCode >= versionCode ? true : false,

  //获取活动ID
  getCampId: campName => actId[campName][process.env.NODE_ENV],

  //获取浏览器内核
  browerKernel:() => {
    var result = '';
    ['webkit', 'moz', 'o', 'ms'].forEach(prefix => {
        if(typeof document[prefix + 'Hidden'] != 'undefined') result = prefix
    });
    return result;
  },

  //请求流程
  /*
    --------------------------

    **************************
    入参说明：
    **************************

    handlers:{
      campName: String, //活动名称（项目名）
      actVersion: String, //参与活动最低版本
      notHuaWei: Function, //弹出仅限华为用户参与
      toBrowser: Function, //弹出分享蒙层
      toHuaWei: Function, //弹出正在打开华为音乐
      pleaseGo: Function, //拉起失败，弹出请打开华为音乐
      goUpdate: Function, //弹出升级框（316以下）
      common: Function, //在华为app内且app版本满足要求的正常业务流程
    }
    --------------------------
  */
  casesHandler: handlers => {
    const u_agent = navigator.userAgent.toLocaleLowerCase()
    if(!userInfo){
      switch (true){
        case u_agent.indexOf('iphone') > -1 || u_agent.indexOf('ipad') > -1:
          //apple弹窗
          handlers.notHuaWei ? handlers.notHuaWei() : alert('非华为用户未弹窗');
          break
        case u_agent.indexOf('weibo')>-1:
          //浏览器打开
          handlers.toBrowser ? handlers.toBrowser() : alert('微博打开未弹窗')
          break
        case u_agent.indexOf('micromessenger')>-1:
          if(u_agent.indexOf("huawei") > -1 || u_agent.indexOf("honor") > -1 || u_agent.indexOf("honour") > -1){
            const schema = `hwmediacenter://com.android.mediacenter/showcampaign?campaignid=${actId[handlers.campName][process.env.NODE_ENV]}&pver=80002311&portal=qq&from=com.huawei.musicplatform&needback=0&appsafearguments=true&nolandscapte=true&activity=true`,
              url = `http://a.app.qq.com/o/simple.jsp?pkgname=com.android.mediacenter&android_schema=${encodeURIComponent(schema)}`
            window.location.href = url
          }else{
            //浏览器打开
            handlers.toBrowser ? handlers.toBrowser() : alert('非华为用户微信打开未弹窗')
          }
          break
        default:
          //拉起华为音乐，显示正在拉起，2s后显示下载框
          const url = `hwmediacenter://com.android.mediacenter/showcampaign?campaignid=${actId[handlers.campName][process.env.NODE_ENV]}&pver=80002311&portal=qq&from=com.huawei.musicplatform&needback=0&appsafearguments=true&nolandscapte=true&activity=true`,
            iframe = document.createElement('iframe')
          iframe.src = url
          document.body.appendChild(iframe)
          iframe.style.display='none'
          //todo:正在打开华为音乐监听处理
          handlers.toHuaWei ? handlers.toHuaWei() : alert('正在拉起华为音乐未弹窗')
          const timer = setTimeout(() => {
            handlers.pleaseGo ? handlers.pleaseGo() : alert('请手动打开华为音乐未弹窗')
          }, 4000);
          document.addEventListener(`${businessUtils.browerKernel}visibilitychange`,() => clearTimeout(timer), false)
      }
    }else{
      businessUtils.versionJudgment(handlers.actVersion || 80004300) ?
        handlers.common()
      : businessUtils.versionJudgment(80002316) ?
        window.JsInterface.appupgrade("")
      : handlers.toUpdate()
    }
  },

  // 跳转登录
  checkLogin: campName => {
    const loginInfo = {
      campId: businessUtils.getCampId(campName),
      operator: businessUtils.getQueryString().operator
    }
    try {
      businessUtils.versionJudgment(80005000)?
      window.JsInterface.checkLogin(2,"",JSON.stringify(loginInfo))
      :
      window.JsInterface.checkLogin(2,"")
    } catch (e) {
      console.info('客户端接口：',e);
      
    }
  },
  // 跳转会员购买页面
  goVipDetail: (routerStr) => {
    const [campName, operator] = [document.title, businessUtils.getQueryString().operator],
    vipInfo = {
      campId: businessUtils.getCampId(routerStr),
      campName: campName,
      operator: operator
    };
    console.log(vipInfo);
    try {
      window.JsInterface.buyVip(JSON.stringify(vipInfo));
    } catch (e) {
      console.log(e);
    }
  },

  // 拉起会员产品购买支付页面
  buyProduct: (subStr, productInfo) => {
    const proInfo = productInfo
    proInfo.campId = businessUtils.getCampId(subStr)
    proInfo.operator = businessUtils.getQueryString().operator
    console.log(proInfo);

    try {
      window.JsInterface.buyProduct(JSON.stringify(proInfo));
    } catch (e) {
      console.log(e);
    }
  },

  // 客户端日志接口
  logger: tag => msg => level => {
    try {
      window.JsInterface.logger(tag, msg, level);
    } catch (e) {
      console.log(e);
    }
  },

  // 用户登录认证（鉴权）
  // 考虑push拿不到token的场景  异常场景给toast提示
  userAuth: (callback,params) => {
    const info = userInfo ? userInfo : params ? params : ''
    console.log(info);
    
    axios.post("/rest.root/user/auth?ver=" + verCode, {
      appId:info.appId || null,
      cpId:info.cpId || null,
      accessToken:info.safeToken || null,
      version:info.appVersionCode || null,
    })
    .then(data => {
      callback(data);
    })
    .catch(err => {
      console.log(err);
    });
  },

  // 获取url中参数对象
  getQueryString: url => {
    url = url ? url : window.location.search; //获取url中"?"符后的字串  
    let params = new Object();  
    if (url.indexOf("?") != -1) {  
      let str = url.substr(1),
        strs = str.split("&");
      for (const index in strs) {
        params[strs[index].split("=")[0]] = unescape(strs[index].split("=")[1])
      }  
    }  
    return params; 
  },

  // 对象转url参数
  urlEncode: (param,key,encode) => {
    if(!param) return '';
    var paramStr = ''
    const t = typeof(param)
    if(t == 'string' || t == 'number' || t == 'boolean'){
      paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param)
    }else{
      for(const i in param){
        const k = !key ? i : key+(param instanceof Array?`[${i}]` : `.${i}`)
        paramStr += businessUtils.urlEncode(param[i],k,encode)
      }
    }
    return paramStr
  },

  // 话单上报（即打点）
  report: incomePrams => {
    const extParams = {
      operator: businessUtils.getQueryString().operator || null,
      appVersionName: userInfo.appVersionName || null,
      emuiVersionName: userInfo.emuiVersionName || null,
      deviceModel:userInfo.deviceModel || null,
      appLayout: userInfo.appLayout || null,
      isVIP: userInfo.vipStatue || null,
      campname: incomePrams.campName,
      starttime: incomePrams.startTime,
      endtime: incomePrams.endTime,
      campType: incomePrams.campType
    },
      reportReq = {
        campAlias: incomePrams.campAlias,
        actType: incomePrams.actType,
        terminalId: userInfo.deviceid || null,
        idType: userInfo.idType || null,
        extParams: JSON.stringify(extParams)
      };

    axios.post("/rest.root/app/reportCdr?ver=" + verCode, reportReq)
      .then(data => console.log(data))
      .catch(err => console.log(err))
  },

  // 监听页面visibilitychange事件
  listenPage: callback => {
    document.addEventListener(`${businessUtils.browerKernel()||null}visibility`, () => {
      console.log('change');
      
      if (!document.hidden) callback()
    });
  }
}

export default businessUtils