<template>
  <div class="iv-lottery">
    <ul :style="{width:toVW(diameter),height:toVW(diameter),backgroundImage:'url('+lotteryBg+')'}">
      <li class="row">
        <div :class="['col-4' , {active : activeClass[index]}]" v-for="(prize,index) in lis1" :key="index">
            <div :style="{width:toVW(cellDiameter.width),height:toVW(cellDiameter.height)}"></div>
        </div>
      </li>
      <li class="row">
        <div :class="['col-4' , {active : activeClass[7]}]">
            <div :style="{width:toVW(cellDiameter.width),height:toVW(cellDiameter.height)}"></div>
        </div>
        <div class="col-4" @click="startLottery()">
            <img :src="lotteryBtn">
        </div>
        <div :class="['col-4' , {active : activeClass[3]}]">
            <div :style="{width:toVW(cellDiameter.width),height:toVW(cellDiameter.height)}"></div>
        </div>
      </li>
      <li class="row">
        <div :class="['col-4' , {active : activeClass[6-index]}]" v-for="(prize,index) in lis2" :key="index">
            <div :style="{width:toVW(cellDiameter.width),height:toVW(cellDiameter.height)}"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NineRaffle",
  data() {
    return {
      activeClass: [false, false, false, false, false, false, false, false],
      index: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: 0, // 每次转动定时器
      times: 0, // 转动次数
      speedData: 100,
      lock: true,
      awardIndex: 0
    };
  },
  props: {
    awardList: {
      // 奖品列表
      type: Array,
      required: true
    },
    lotteryBtn: {
      // 抽奖按钮
      type: String,
      required: true
    },
    lotteryBg: {
      // 背景图片
      type: String,
      required: true
    },
    diameter: {
      // 宽高
      type: Number,
      default: 200
    },
    cellDiameter:{ // 宽、高参数分开配置
      // 奖品框大小
      type: Object,
      default(){
        return {
          width: 50,
          height: 50
        }
      }
    },
    speed: {
      //速度
      type: Number,
      default: 100
    },
    cycle: {
      // 转动圈数
      type: Number,
      default: 5
    },
    beforeLottery:{
      // 接口请求函数
      type: Function,
      require: true
    },
    afterLottery: {
      //抽奖结束回调函数 , 用于处理结果
      type: Function,
      required: true,
    }
  },
  computed: {
    lis1() {
      return this.awardList.slice(0, 3);
    },
    lis2() {
      return this.awardList.slice(4, 7).reverse();
    },
    cycTimes() {
      return this.cycle*8
    }
  },
  created() {
    this.speedData = this.speed;
  },
  methods: {
    startLottery: function() {
      if(this.lock){
        this.lock = (() => {
          return false
        })()
        // this.lock = () => {
        //   return false
        // }
        console.log(this.lock);
        
        (async ()=>{
          try {
            const awards = await this.beforeLottery();
            if(awards) {
              // this.lock = true
              this.roll(awards)
            }
          } catch (err) {
            console.log(err);
          }
        })()
      }
    },
    // 开始转动
    roll: function(awards) {
      this.activeClass = this.activeClass.map(item => (item = false));
      this.times += 1; // 转动次数（一个奖品为1次，一圈为8次）
      this.rollHandle(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      this.awardList.map((v,i) => {
        if(awards == v.name) this.awardIndex = v.index
      })
      if (this.times > this.cycTimes + 10 && this.awardIndex == this.index) {
        clearTimeout(this.timer); // 清除转动定时器，停止转动
        setTimeout(() => {
          this.lock = true;
          this.afterLottery() // 延时，保证转完后才能再次点击
        }, 1000);
        this.index = -1;
        this.count = 8;
        this.timer = 0;
        this.speedData = this.speed;
        this.times = 0;
      } else {
        if (this.times < this.cycTimes) {
          this.speedData -= 2; // 加快转动速度
        } else {
          if (this.times > this.cycTimes + 10 &&((this.awardIndex == 0 && this.index == 7) || this.awardIndex == this.index + 1)) {
            this.speedData += 110;
          } else {
            this.speedData += 20;
          }
        }
        if (this.speedData < 40) {
          this.speedData = 40;
        }
        this.timer = setTimeout(() => {
          this.roll();
        }, this.speedData);
      }
      return false;
    },
    rollHandle: function() {
      var index = this.index, // 当前转动到哪个位置
        count = this.count; // 总共有多少个位置
      for (let i = 0, len = this.activeClass.length; i < len; i++) {
        this.activeClass[i] = false;
      }
      index += 1;
      if (index > count - 1) {
        index = 0;
      }
      this.activeClass[index] = true;
      this.index = index;
      return false;
    },
    toVW(px) {
      return `${px/1080*document.body.clientWidth}vw`
    }
  }, 
};
</script>
<style lang="stylus" scoped>
.col-4 
  width 33.333333%

.row .col-3, .row .col-4 
  float left
  box-sizing border-box

ul 
  margin 0 auto
  box-sizing border-box
  background-size contain
  background-repeat no-repeat
  padding 0.831rem 0.768rem 0.768rem 0.768rem
  position relative
  z-index 1

  li 
    overflow hidden
    position relative
  

  li div 
    padding 8px
    position relative

    &.active:before 
      content ''
      display block
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      border-radius 5px
      background rgba(255, 135, 46, 0.62)

  li div img 
    width 100%
    vertical-align middle
  

</style>
