<template>
  <transition name="fade">
    <div class="toast-panel">
      <div class="ground-glass"></div>
      <div class="toast">
        <div class="toast-content">
          <img :src="imgCollection[target]" alt="info">
          <ul class="recording-list">
            <!-- <li>
              <i>1</i>
              <p>HUAWEI P20 PRO</p>
              <button class="time-out" @click="goAddress()"></button>
            </li> -->
            <li v-for="(param,key) in awardList" :key = "key">
              <i>{{ key + 1 }}</i>
              <p>{{ param.awardName }}</p>
              <button
                :class="{'time-out': $store.state.serverTime > awardLimitTime}"
                v-if="!param.phoneNum && param.awardName.indexOf('花币') == -1"
                @click="goAddress(param.recordId)"></button>
            </li>
          </ul>
          <button
            class="cancel"
            @click="toHide()">
          </button>
        </div>
      </div>
    </div>
    <AddressReportor
      v-if="$store.state.adRepShow"
      :imgSrc="addressReportorBg"
      :recordId="currentId"
      :campAlias="campAlias">
    </AddressReportor>
  </transition>
</template>
<script>
import businessUtils from '@/assets/js/businessUtils'
import AddressReportor from "Components/bussinessComponents/inCard/AddressReportor"

export default {
  name: "RecordingToast",
  data(){
    return {
      addressReportorBg: require('@/assets/img/inCard/address_reportor.png'),
      currentId: '123',
    }
  },
  props:{
    campAlias:{
      type: Object,
      required: true
    },
    imgCollection:{
      type: Object,
      required: true
    },
    target:{
      type: String,
      required: true
    },
    awardList:{
      type: Array,
    },
    awardLimitTime:{
      type: Number
    }
  },
  mounted(){
    
  },
  methods: {
    toHide: function(){
      this.$store.commit('doRecordingShow','false')
    },
    goAddress: function(id){
      if($store.state.serverTime < awardLimitTime){
        this.currentId = id
        this.$store.commit('doRecordingShow',false)
        this.$store.commit('doAdRepShow',true)
      }
    },
    toVW: function(px){
      return `${px*100/1080}vw`
    }
  }
}
</script>
<style lang="stylus" scoped>
  button
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
      .cancel
        position absolute
        width 130px
        height 130px
        bottom 0
        left 385px
        background-color #fff
        opacity .4
      .recording-list
        position absolute
        overflow-y auto
        overflow-x hidden
        top 330px
        right 0
        bottom 250px
        left 0
        padding 30px 60px 0
        li
          display flex
          justify-content space-between
          margin-bottom 30px
          color #fff
          i 
            display inline-block
            width 100px
            text-align center
            margin-right 90px
          p
            width 200px
            flex-grow 1
            margin-right 20px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
          button
            width 160px
            height 64px
            background-image url('../../../assets/img/inCard/get_address_btn.png')
            background-size contain
            background-repeat no-repeat
          .time-out
            background-image url('../../../assets/img/inCard/timeout_btn.png')
</style>

