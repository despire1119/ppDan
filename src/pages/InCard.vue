<template>
  <div>
    <section class="title">
      <div class="buy-area">
        <button class="buy" @click = "goBuy()"></button>
      </div>
    </section>
    <section class="roll">
      <div class="lucky-wheel">
        <p class="tips"><span>{{ permissionCount }}</span></p>
        <LuckyWheel
          :handlers="handlers"
          :awardList="awardList"
          :diameter="1080"
          :lotteryBg="lotteryBg"
          :lotteryBtn="lotteryBtn"
          :beforeLottery="beforeLottery"
          :afterLottery="afterLottery"
          :btnDiameter="btnDiameter">
        </LuckyWheel>
        <div class="btns">
          <button class="rules" @click="rulesShow()"></button>
          <button class="recording" @click="recording()"></button>
        </div>
      </div>
    </section>
    <section class="music-list">
      <ul class="music-cell">
        <li @click="goMusic(`hwmediacenter://com.android.mediacenter/showdetail?catalogid=14076&catalogtype=catalog_playlist&catalogname=抖音神曲&catalogimg=http://musicpic.vmall.com/music-pics-cn/catalog/20180723/201807231504406500254_300_300.jpg&catalogdesc=时下最火的创意短视频APP，魔性绕耳&pver=61400000&portal=ut&from=com.huawei.musicplatform&needback=1`)"></li>
        <li @click="goMusic(`hwmediacenter://com.android.mediacenter/showdetail?catalogid=21198&catalogtype=catalog_playlist&catalogname=热血街舞团&catalogimg=http://musicpic.vmall.com/music-pics-cn/catalog/20180723/201807231509229370257_300_300.jpg&catalogdesc=热血街舞团，舞姿帅气惹火&pver=61400000&portal=ut&from=com.huawei.musicplatform&needback=1`)"></li>
        <li @click="goMusic(`hwmediacenter://com.android.mediacenter/showdetail?catalogid=8560&catalogtype=catalog_playlist&catalogname=节奏至上&catalogimg=http://musicpic.vmall.com/music-pics-cn/catalog/20180723/201807231512322390258_300_300.jpg&catalogdesc=以Funk为基石的神曲，节奏至上，所向披靡=1&pver=61400000&portal=ut&from=com.huawei.musicplatform&needback=1`)"></li>
      </ul>
    </section>
    <section class="bottom" @click="goVip()"></section>
    <keep-alive>
      <ErrorToast v-if="$store.state.toastShow" :imgSrc="rulesUrl" :btnPos="btnPos"></ErrorToast>    
    </keep-alive>
    <ErrorMessageToast v-if="$store.state.errShow" :code="errorCode"></ErrorMessageToast>
    <InfoToast
      v-if="$store.state.infoShow"
      :cancelPos="cancelPos"
      :confirmPos="confirmPos"
      :imgSrc="infoUrl"
      :confirmCallback="infoCallback">
    </InfoToast>
    <RecordingToast
      v-if="$store.state.recordingShow"
      :campAlias="campAlias"
      :imgCollection="recordingUrls"
      :awardList="recordingList"
      :target="target"
      :awardLimitTime="awardLimitTime">
    </RecordingToast>
    <AddressReportor
      v-if="$store.state.adRepShow"
      :imgSrc="addressReportorBg"
      :recordId="currentId"
      :campAlias="campAlias">
    </AddressReportor>
  </div>
</template>

<script>
import { userInfo , getParam } from "@/assets/js/const.js"
import businessUtils from "@/assets/js/businessUtils"
import LuckyWheel from 'Components/commonComponents/LuckyWheel'
import ErrorToast from 'Components/commonComponents/ErrorToast'
import ErrorMessageToast from "Components/commonComponents/ErrorMessageToast"
import InfoToast from "Components/commonComponents/InfoToast"
import RecordingToast from "Components/bussinessComponents/inCard/RecordingToast"
import AddressReportor from "Components/bussinessComponents/inCard/AddressReportor"

export default {
  name: 'InCard',
  components:{
    LuckyWheel,
    ErrorToast,
    ErrorMessageToast,
    InfoToast,
    RecordingToast,
    AddressReportor
  },
  data(){
    return {
      campAlias: 'himusic.yearcard07241',
      awardLimitTime: new Date('2018/08/03 23:59:59').getTime(),
      errorCode: '',
      awardList:["HUAWEI P20 PRO","荣耀引擎耳机","100花币","华为手环B3 青春版"],
      recordingUrls:{
        'default': require("@/assets/img/inCard/awards_recording.png"),
        'noAward': require("@/assets/img/inCard/empty.png"),
      },
      target:'noAward',
      recordingList:[],
      addressReportorBg: require('@/assets/img/inCard/address_reportor.png'),
      currentId: '',
      lotteryBg: require('@/assets/img/inCard/wheel.png'),
      lotteryBtn: require('@/assets/img/inCard/btn.png'),
      btnDiameter:{
        width: 270,
        height: 436,
        top: "44%"
      },
      permissionCount: 0,
      rulesUrl: require('@/assets/img/inCard/rules.png'),
      infoUrl: require('@/assets/img/inCard/to_login.png'),
      btnPos: {
        width:120,
        height: 120,
        top: 1330,
        right: 390
      },
      cancelPos:{
        width: 295,
        height: 120,
        top: -200,
        left:90
      },
      confirmPos:{
        width: 295,
        height: 120,
        top:-200,
        right:90
      },
      wheelReq: {
        "campAlias": this.campAlias,
        "appId": userInfo?userInfo.appId:null,
        "terminalId": userInfo?userInfo.deviceid:null,
        "userToken": userInfo?userInfo.safeToken:null,
        "appType": userInfo?userInfo.appLayout:null,
        "appVersion": userInfo?userInfo.appVersionName:null,
        "deviceType": userInfo?userInfo.deviceModel:null
      },
      handlers: {
        campName: 'InCard',
        notHuaWei: () => {
          this.infoToastShow(require('@/assets/img/inCard/not_huawei.png'),{
            width: 720,
            height: 120,
            top: -200,
            left:90
          },{
            width: 0,
            height: 0,
          })
        },
        toBrowser: () => {
          this.infoToastShow(require('@/assets/img/inCard/to_browser.png'),{
            width: 0,
            height: 0,
          },{
            width: 0,
            height: 0,
          })
        },
        toHuaWei: () => {
          this.infoToastShow(require('@/assets/img/inCard/opening.png'),{
            width: 0,
            height: 0,
          },{
            width: 0,
            height: 0,
          })
        },
        pleaseGo: () => {
          this.infoToastShow(require('@/assets/img/inCard/to_huawei.png'),{
            width: 720,
            height: 120,
            top: -200,
            left:90
          },{
            width: 0,
            height: 0,
          })
        },
        goUpdate: () => {
          this.infoToastShow(require('@/assets/img/inCard/go_update.png'),{
            width: 720,
            height: 120,
            top: -200,
            left:90
          },{
            width: 0,
            height: 0,
          })
        },
        //根据业务需要插入相应逻辑
        common: new Function
      },
      infoCallback: function(){
        console.log('默认方法');
      },
      awardName: '',
      awardToast:{
        'HUAWEI P20 PRO': "http://music.dbankcdn.com/music-pics-cn/campaign/musicmember/20180725/images/phone.png",
        '荣耀引擎耳机': "http://music.dbankcdn.com/music-pics-cn/campaign/musicmember/20180725/images/earphone.png",
        '100花币': "http://music.dbankcdn.com/music-pics-cn/campaign/musicmember/20180725/images/coin.png",
        '华为手环B3 青春版': "http://music.dbankcdn.com/music-pics-cn/campaign/musicmember/20180725/images/huaweib3.png"
      }
    }
  },
  created() {
  },
  mounted() {
    //客戶端以同步方式返回異步結果，造成userinfo有可能無法拿到，所以使用了這種醜陋的寫法。請不要放棄與客戶端繼續撕逼。
    userInfo ? this.initor() : getParam(this.initor)
  },
  methods: {
    initor: function (params){
      businessUtils.userAuth(res => {
        if(res.data && res.data.retCode === "0"){
          this.$store.commit('campaignTokenUpdate' , res.headers['campaign-token'])
          //获取权限后操作
          this.getLotteryCount()
        } else {
          this.respExp(res.data.retCode);
        }
      }, params);
      businessUtils.listenPage(() => {
        //需要重载的接口
        this.getLotteryCount()
      })
    },
    getServerTime: function(callback){
      this.axios.get(`/rest.root/campaign/getLotteryTimes?ver=${userInfo?userInfo.appVersionCode : null}`).then(res => {
        if(res.data && res.data.retCode === "0"){
          this.$store.commit('getServerTime', +(res.data.time))
          if(callback) callback()
        }else{
          console.log('获取服务器时间失败');
          this.respExp(res.data.retCode)
        }
      })
    },
    goBuy: function() {
      // businessUtils.buyProduct('InCard',userInfo => console.log('goBuy'))
      const productInfo = {
        "productCode": "700016",
        "productName": "120元开通年卡",
        "productType": "1",
        "merchantId": "890086000102094183",
        "price": "144.00",
        "currency": "CNY",
        "country": "CN",
        "validDay": "372",
        "canRenewFlag": "0",
        "showMode": "11",
        "pageType": "1",
    }
      this.handlers.common = () => businessUtils.buyProduct('InCard',productInfo)
      businessUtils.casesHandler(this.handlers)
    },
    getLotteryCount: function () {
      this.axios.post(`/rest.root/campaign/getLotteryTimes?ver=${userInfo ? userInfo.appVersionCode : null}`,{
        campAlias: this.campAlias,
        appId: userInfo?userInfo.appId:null
      },{
        headers:{
          "campaign-token": this.$store.state.campToken
        }
      }).then(res => {
        if(res.data && res.data.retCode === "0"){
          this.permissionCount = res.data.restTimes
        }else{
          this.cases(res.data.retCode)
        }
      })
    },
    beforeLottery: function () {
      const promise
        = this.axios.post('/rest.root/campaign/joinCamp',this.wheelReq,{
            headers:{
              "campaign-token": this.$store.state.campToken
            }
          }).then(res => {
            return res.data && res.data.retCode === "0" ? this.joinSuccess(res) : this.cases(res.data.retCode);
            // return res.data && res.data.retCode === "0" ? this.joinSuccess(res) : this.cases('9010130002');
          })
      return promise
    },
    joinSuccess: function (res) {
      this.getLotteryCount()
      this.$store.commit('campaignTokenUpdate',res.headers['campaign-token'])
      this.currentId = res.data.recordId
      this.awardName = res.data.awardName
      return res.data.awardName
    },
    afterLottery: function (){
      this.infoToastShow(this.awardToast[this.awardName],{},{},()=>{
        if(this.awardName!='100花币'){
          this.$store.commit('doInfoToastShow',false)
          this.$store.commit('doAdRepShow',true)
        }
      })
    },
    infoToastShow: function (url,cancelPos,confirmPos,confirmCallback){
      this.infoUrl = url
      this.cancelPos = cancelPos
      this.confirmPos = confirmPos
      this.infoCallback = confirmCallback
      this.$store.commit('doInfoShow', 'true')
    },
    rulesShow: function () {
      this.$store.commit('isShow','true') 
    },
    recording: function () {
      this.handlers.common =  () => {
        this.axios.post(`/rest.root/campaign/getUserCampHis?ver=${userInfo ? userInfo.appVersionCode : null}`,{
          'userToken': userInfo ? userInfo.safeToken : null,
          'campAlias': this.campAlias,
          'onlyAward': 1
        },{
          headers: {
            "campaign-token": this.$store.state.campToken
          }
        }).then(res => {
          if(res.data && res.data.retCode === '0'){
            const resData = JSON.parse(data.replace(/\"recordId\":(\d+),/g, '\"recordId\":\"$1\",'))
            console.info('中奖纪录',resData)
            if(resData.awardList.length){
              this.getServerTime(()=>{
                this.target = 'default'
                this.recordingList = resData.awardList
                this.$store.commit('doRecordingShow','true')
              })
            }else{
              this.target = 'noAward',
              this.$store.commit('doRecordingShow','true')
            }
          } else {
            this.cases(res.data.retCode)
          }
        })
      }
      businessUtils.casesHandler(this.handlers)
    },
    respExp: function (errorCode) {
      this.errorCode = errorCode;
      this.$store.commit('doErrShow','true')
    },
    cases: function (errorCode) {
      switch (errorCode){
        case '9010130001':
          //活动未开始
          //todo: 判断是否登录
          this.infoToastShow(require('@/assets/img/inCard/pre_act.png'),{
            width: 295,
            height: 120,
            top: -200,
            left:90
          },{
            width: 295,
            height: 120,
            top:-200,
            right:90
          },()=>{
            businessUtils.checkLogin('InCard')
          })
          break;
        case '9010130002':
          //活动已结束
          this.infoToastShow(require('@/assets/img/inCard/act_ended.png'),{
            width: 720,
            height: 120,
            top: -160,
            left:90
          },{
            width: 0,
            height: 0,
          })
          break;
        case '9010130003':
          //无抽奖次数
          //todo: 抽奖次数是否用完
          this.infoToastShow(require('@/assets/img/inCard/no_chance.png'), {
            width: 130,
            height: 130,
            top: -130,
            left: 385
          },{
            width: 720,
            height: 110,
            top: -410,
            left: 90
          })
          break;
        case '9010120001':
          //登录过期，session失效
          this.infoToastShow(require('@/assets/img/inCard/to_login.png'),{
            width: 295,
            height: 120,
            top: -200,
            left:90
          },{
            width: 295,
            height: 120,
            top:-200,
            right:90
          },()=>{
            businessUtils.checkLogin('InCard')
          })
          break;
        case '9010199998':
          //未登录
          this.infoToastShow(require('@/assets/img/inCard/to_login.png'),{
            width: 295,
            height: 120,
            top: -200,
            left:90
          },{
            width: 295,
            height: 120,
            top:-200,
            right:90
          },()=>{
            businessUtils.checkLogin('InCard')
          })
          break;
        default:
          this.respExp(errorCode)
      } 
    },
    goMusic: function (url){
      this.handlers.common = ()=>{ window.location.href = url }
      businessUtils.casesHandler(this.handlers)
    },
    goVip: function (){
      this.handlers.common = () => businessUtils.goVipDetail('InCard')
      businessUtils.casesHandler(this.handlers)
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/styl/common.styl';
section 
  font-style '微软雅黑'
  background-repeat no-repeat
  background-size 100% 100%
  &.title
    position relative
    height 1236px
    background-image url(../assets/img/inCard/title.jpg)
    .buy-area
      position absolute
      display flex
      justify-content center
      align-items center
      left 0
      right 0
      bottom 70px
      .buy
        width 480px
        height 135px
        background-color transparent
        background-image url(../assets/img/inCard/buy_now.png)
        background-size 100% 100%
        background-repeat no-repeat
  &.roll
    position relative
    height 1298px
    background-image url(../assets/img/inCard/roll_bg.jpg)
    .tips
      position relative
      height 100px
      line-height 100px
      span
        display block 
        position absolute
        top 7px
        left 455px
        font-size 48px
        color #0095F1
    .lucky-wheel
      // background-image url(../assets/img/inCard/wheel.png)
      background-size 100%
    .btns
      position absolute
      display flex
      flex-direction row
      flex-wrap nowrap
      justify-content space-between
      align-items center
      align-content stretch
      left 0
      right 0
      bottom 10px
      padding 0 84px
      button 
        display block
        width 400px
        height 92px
        background-color transparent
  &.music-list
    position relative
    height 842px
    background-image url(../assets/img/inCard/music_list.jpg)
    .music-cell
      position absolute
      display flex
      padding-left 60px
      top 360px
      right 0
      left 0
      li
        width 300px
        height 300px
        margin-right 30px
  &.bottom
    height 1570px
    background-image url(../assets/img/inCard/bottom.jpg)
</style>
