<template>
  <transition name="fade">
    <div class="toast-panel">
      <div class="ground-glass"></div>
      <div class="toast">
        <div class="toast-content">
          <img :src="imgSrc" alt="addressPanel">
          <input type="text" class="name" v-model="req.userRealName">
          <input type="text" class="phone" v-model="req.phoneNum">
          <textarea name="address" class="address" v-model="req.userAddress"></textarea>
          <p class="err-msg">{{errMsg?errMsg:null}}</p>
          <button class="submit" @click="addReport()"></button>
          <button class="cancel" @click="toHide()"></button>
        </div>
      </div>
    </div>
    <InfoToast
      v-if="$store.state.infoShow"
      :cancelPos="cancelPos"
      :confirmPos="confirmPos"
      :imgSrc="infoUrl"
      :confirmCallback="infoCallback">
    </InfoToast>
  </transition>
</template>
<script>
  import {userInfo} from "@/assets/js/const.js"
  import InfoToast from "Components/commonComponents/InfoToast"
  export default{
    name: "AddressReportor",
    props:{
      imgSrc: {
        type: String,
        required: true
      },
      recordId: {
        type: String,
        required: true
      },
      campAlias: {
        type: String,
        required: true
      }
    },
    data(){
      return {
        req:{
          userRealName:'',
          phoneNum:'',
          userAddress:'',
        },
        infoUrl:'',
        confirmPos:{},
        cancelPos:{},
        confirmCallback:null,
        errMsg:''
      }
    },
    methods:{
      toHide: function (){
        this.$store.commit('doAdRepShow','false')
      },
      ifSpecification: function (){
        if(!this.req.userRealName){
          this.errMsg = '收件人名称格式不符'
          return false
        }else if(!/^1[3456789]\d{9}$/.test(this.req.phoneNum)){
          this.errMsg='电话号码格式不正确'
          return false
        }else if(!this.req.userAddress){
          this.errMsg='收货地址格式不符'
          return false
        }
        return true
      },
      infoToastShow: function (url,cancelPos,confirmPos,confirmCallback){
        this.infoUrl = url
        this.cancelPos = cancelPos
        this.confirmPos = confirmPos
        this.infoCallback = confirmCallback
        this.$store.commit('doInfoShow', 'true')
      },
      respExp: function (errorCode) {
        this.errorCode = errorCode;
        this.$store.commit('doErrShow','true')
      },
      addReport: function (){
        if(this.ifSpecification()){
          this.errMsg = ''
          let req = this.req
          req['campAlias'] = this.campAlias
          req['recordId'] = this.recordId
          console.log(req);
          this.axios.post(`/rest.root/campaign/updateLotteryUserInfo?ver=${userInfo ? userInfo.appVersionCode : null}`,req).then(res => {
            if(res.data.retCode === '0'){
              this.toHide()
              this.infoToastShow(require('@/assets/img/inCard/submit_success.png'))
            }else{
              this.respExp(res.data.retCode)
            }
          })
        }
      },
    }
  }
</script>
<style lang="stylus" scoped>
  button,input,textarea
    background-color transparent
  .toast-panel
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    z-index 9999
  .ground-glass
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background-color #000
    opacity .5
    z-index 999
  .toast
    position fixed
    display flex
    align-items center
    justify-content center
    top 0
    right 0
    bottom 0
    left 0
    z-index 9999
    .toast-content
      position relative
      img
        display block
        width 900px
      input,textarea,button
        font-size 34px
        color #fff
        left 260px
        position absolute
      input 
        width 580px
        height 90px
      .name
        top 90px
      .phone
        top 230px
      .address
        top 375px
        width 580px
        height 190px
      .err-msg
        position absolute
        right 0
        left 0
        bottom 640px
        font-size 16px
        text-align center
        letter-spacing 0
        font-family FZLTXHK--GBK1-0
	      color #EB2E46
      .submit
        left 130px
        bottom 300px
        width 660px
        height 102px
        background-image url('../../../assets/img/inCard/submit.png')
        background-repeat no-repeat
        background-size contain
      .cancel
        bottom 0
        left 385px
        width 135px
        height 135px
        border-radius 135px
</style>

