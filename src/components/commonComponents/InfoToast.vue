<template>
  <transition name="fade">
    <div class="toast-panel">
      <div class="ground-glass"></div>
      <div class="toast">
        <div>
          <img :src="imgSrc" alt="info">
          <div class="to-rel">          
            <button
              class="confirm"
              :style="{
                width:toVW(confirmPos.width)||null,
                height:toVW(confirmPos.height)||null,
                top:toVW(confirmPos.top)||null,
                left:toVW(confirmPos.left)||null,
                right:toVW(confirmPos.right)||null
              }"
              @click="confirm()">
            </button>
            <button
              class="cancel"
              :style="{
                width:toVW(cancelPos.width)||null,
                height:toVW(cancelPos.height)||null,
                top:toVW(cancelPos.top)||null,
                left:toVW(cancelPos.left)||null,
                right:toVW(cancelPos.right)||null
              }"
              @click="toHide()">
            </button>
          </div>
         
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import businessUtils from '@/assets/js/businessUtils'

export default {
  name: "InfoToast",
  props:{
    imgSrc:{
      type: String,
      required: true
    },
    cancelPos:{
      type: Object,
      default(){
        return {
          width: 295,
          height: 120,
          top: -200,
          left:90
        }
      }
    },
    confirmPos:{
      type: Object,
      default(){
        return {
          width: 295,
          height: 120,
          top:-200,
          right:90
        }
      }
    },
    confirmCallback:{
      type: Function,
      default(){
        return function () {
          console.log('外部逻辑');
        }
      }
    }
  },
  data(){
    return {
      exp:''
    }
  },
  methods: {
    toHide: function(){
      this.$store.commit('doInfoShow','false')
    },
    confirm: function(){
      console.log('confirm');
      this.confirmCallback()
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
    img
      display block
      width 900px
    .to-rel
      position relative
      button
        position absolute
</style>

