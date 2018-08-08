<template>
  <div>
    <Slider class="slider-container" :slides="slides" :inv="inv" :name="transitionName" :target="target" :showPages="showPages" :showControllers="showControllers"></Slider>
    <NineRaffle :prizesList="prizesList" :lotteryBg="lotteryBg" :lotteryBtn="lotteryBtn" :awardId="0"></NineRaffle>
  </div>
</template>
<script>
  import Slider from 'Components/commonComponents/Slider';
  import NineRaffle from "Components/commonComponents/NineRaffle";
  export default {
    name: 'PpDan',
    components: {
      Slider,
      NineRaffle
    },
    data() {
      return {
        slides: [
        {
          src: require('@/assets/img/slide-001.jpg'),
          href: ''
        },
        {
          src: require('@/assets/img/slide-002.jpg'),
          href: ''
        },
        {
          src: require('@/assets/img/slide-003.jpg'),
          href: ''
        },
        {
          src: require('@/assets/img/slide-004.png'),
          href: ''
        },
        {
          src: require('@/assets/img/slide-005.png'),
          href: ''
        }
      ],
      inv: 4000,
      transitionName: 'move', // move | fade
      target: '_blank',
      autoPlay: false,
      showPages: false,
      showControllers: false,

      prizesList:[
        require("@/assets/img/lottery-prize1.png"),
        require("@/assets/img/lottery-prize1.png"),
        require("@/assets/img/lottery-prize1.png"),
        require("@/assets/img/lottery-prize1.png"),
        require("@/assets/img/lottery-prize1.png"),
        require("@/assets/img/lottery-prize1.png"),
        require("@/assets/img/lottery-prize1.png"),
        require("@/assets/img/lottery-prize1.png"),
      ],
      lotteryBtn:require('@/assets/img/start_lottery.png'),
      lotteryBg:require('@/assets/img/lottery-bg.png')
      }
    }
  }
</script>
<style lang='stylus'>
  @import '../assets/styl/common.styl';
</style>