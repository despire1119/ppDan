<template>
<!-- <div :class="{hide: !$store.state.toastShow}"> -->
  <transition name="fade">
    <div class="toast-panel">
      <div class="ground-glass" @click="toHide"></div>
      <div class="toast">
        <img :src="imgSrc" alt="rules">
        <div class="txt">
          <p class="tit">活动规则</p>
          <div class="content">
            <p class="slot">1.【活动时间】:</p>
            <p class="straight"></p>
            <p class="slot">2.【活动内容】:</p>
            <p class="straight">&nbsp;·&nbsp;活动期间通过活动页面购买年卡会员，即可参与抽奖，100%中奖。每次购买可获得一次抽奖机会，不限参与次数；</p>
            <p class="straight">&nbsp;·&nbsp;前1400名成功开通年卡的会员，保底送价值129元荣耀引擎耳机2代；</p>
            <p class="straight">&nbsp;·&nbsp;本活动仅限通过此页面开通年卡的用户参与，活动权益不与其他活动权益共享。抽奖机会当期有效，超时作废；</p>
            <p class="straight">&nbsp;·&nbsp;音乐会员有效期达2年的用户，无法购买和参与此活动；</p>
            <p class="slot">3.【奖品发放】:</p>
            <p class="straight">&nbsp;·&nbsp;抽中花币后请点击 “领取”按钮，在“待领取”中领取花币。若点击“领取”跳转失败，请将华为钱包升级至最新版本或打开华为音乐，在“我的”-“花币”-“花币领取”-“待领取”领取，花币展示有效期为15天，请及时领取；</p>
            <p class="straight">&nbsp;·&nbsp;抽中实物礼品的用户，奖品颜色随机发放。中实物奖品的用户，活动结束后3天内未反馈有效收货信息则视为弃奖处理，奖品将在活动结束后15个工作日内安排发放；</p>
            <p class="slot">4.【活动支持】:</p>
            <p class="straight">&nbsp;·&nbsp;本活动仅支持8.0.4.300及以上版本客户端参与，未升级用户升级版本后即可参与；</p>
            <p class="slot">5.【安全维护】:</p>
            <p class="straight">&nbsp;·&nbsp;严禁恶意刷奖行为，一旦后台发现异常情况，将取消获奖资格。如有疑问，请联系客服热线：4008308300。</p>
          </div>
        </div>
        <span class="close" @click="toHide" :style="{width:toVW(btnPos.width),height:toVW(btnPos.height),top:toVW(btnPos.top),right:toVW(btnPos.right)}"></span>
      </div>
    </div>
  </transition>
<!-- </div> -->
</template>
<script>
export default {
  name: "ErrorToast",
  props: {
    imgSrc:{
      type: String,
      required: true
    },
    btnPos:{
      type: Object,
      default(){
        return{
          width:100,
          height:100,
          top: 10,
          right: 20,
        }
      }
    }
  },
  data(){
    return{
    }
  },

  mounted(){
  },
  methods: {
    toHide: function(){
      this.$store.commit('isShow','false')
    },
    toVW: function(px) {
      // return `${px*100/document.body.clientWidth}vw`
      return `${px*100/1080}vw`
    }
  }
}
</script>

<style lang="stylus" scoped>
  .toast-panel
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    z-index 9999
  .hide
    display none
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
    width 900px
    top 100px
    left 50%
    margin-left -450px
    z-index 9999
    img
      width 100%
      height 100%
    .close
      position absolute
      top 10px
      right 20px
      width 100px
      height 100px
      z-index 3
    .txt
      position absolute
      top 40px
      right 0
      bottom 206px
      left 0
      color #ffffff
      font-size 54px
      z-index 2
      .tit
        margin-top 100px
        height 64px
        line-height 64px
        text-align center
      .content
        padding 0 65px
        margin-top 23px
        margin-bottom 70px
        height 950px
        overflow-x hidden
        overflow-y auto
        .slot
          margin-top 20px
          height 100px
          line-height 100px
          font-size 48px
        .straight
          margin-top 20px
          font-weight 100
          font-size 34px
          word-break break-all
          line-height 62px
</style>
