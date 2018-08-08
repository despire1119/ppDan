<template>
  <div class="container">
    <div class="lucky-wheel">
      <div class="wheel-main">
          <div class="wheel-pointer-box" :style="{width:toVW(btnDiameter.width),height:toVW(btnDiameter.height),top:btnDiameter.top}">
            <div class="wheel-pointer" @click="onRotate()" :style="{transform:rotateAnglePointer,transition:rotateTransitionPointer,width:toVW(btnDiameter.width),height:toVW(btnDiameter.height),backgroundImage:'url('+lotteryBtn+')'}"></div>
          </div>               
          <div class="wheel-bg" :style="{transform:rotateAngle,transition:rotateTransition,width:toVW(diameter),height:toVW(diameter),backgroundImage: 'url('+lotteryBg+')'}">                   
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import businessUtils from "@/assets/js/businessUtils"
import { userInfo } from "@/assets/js/const.js"

export default {
  name: "LuckyWheel",
  props: {
    handlers:{
      type: Object,
      require: true
    },
    awardList: {
      // 奖品列表
      type: Array,
      required: true
    },
    lotteryBg: {
      // 背景图片
      type: String,
      required: true
    },
    lotteryBtn: {
      // 抽奖按钮
      type: String,
      required: true
    },
    diameter: {
      // 转盘背景图直径
      type: Number,
      default: 200
    },
    btnDiameter: {
      // 抽奖按钮的大小,即宽高
      type: Object,
      default(){
        return{
          width:60,
          height:70,
          top:"50%",
        }
      }
    },
    cycle: {
      //转动次数
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
      required: true
    }
  },
  data() {
    return {
      startRotateDegree: 0, //初始旋转角度
      rotateAngle: 0, //将要旋转的角度
      rotateAnglePointer: 0, //指针将要旋转的度数
      rotateTransition: "transform 6s ease-in-out", //初始化选中的过度属性控制
      rotateTransitionPointer: "transform 12s ease-in-out", //初始化指针过度属性控制
      clickFlag: true, //是否可以旋转抽奖
      resultIndex: 0
    };
  },
  mounted(){
  },
  methods: {
    onRotate() {
      this.handlers.common = this.rotateHandle
      businessUtils.casesHandler(this.handlers)
    },
    rotateHandle() {
      if(this.clickFlag){
        this.clickFlag = () => {return false}
        (async () => {
          try {
            const awards = await this.beforeLottery();
            if(awards){ 
              // if (!this.clickFlag) return;
              //todo: var? 您怕是在逗我 请替换为const或let
              const duringTime = 5,
                random = Math.floor(Math.random() * 7);
              this.awardList.map((val,index) => {
                if(awards == val) this.resultIndex = index
              })
              var resultAngle = [];
              var angle = 180 / this.awardList.length;
              //todo：已定义的变量需要换算时，请使用计算属性（computed）
              resultAngle[this.resultIndex] = angle * (2 * this.resultIndex + 1); //最终会旋转到下标的位置所需要的度数
              this.clickFlag = false; // 旋转结束前，不允许再次触发
              // 转动盘子
              var rotateAngle =
                this.startRotateDegree +
                this.cycle * 360 +
                resultAngle[this.resultIndex] -
                this.startRotateDegree % 360;
                this.startRotateDegree = rotateAngle;
                this.rotateAngle = "rotate(" + rotateAngle + "deg)";
              // 旋转结束后，允许再次触发
              setTimeout(() => {
                this.clickFlag = true;
                this.afterLottery()
              }, duringTime * 1000 + 1500); // 延时，保证转盘转完       
            }
          } catch (err) {
            console.log(err);
          }
        })()
      }else{
        businessUtils.casesHandler(this.handlers)
      }
    },
    toVW(px) {
      return `${px*100/1080}vw`
    }
  }
};
</script>
<style lang='stylus' scoped>
.container {
  width: 100%;

  .lucky-wheel {
    width: 100%;
    height: auto;
    overflow: hidden;
    background-size: 100%;

    .wheel-main {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .wheel-bg {
        background-repeat: no-repeat;
        background-position: center top;
        background-size: 100%;
        color: #fff;
        font-weight: 500;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        transition: transform 3s ease;

        .wheel-bg div {
          text-align: center;
        }

        // .prize-list {
        //   width: 100%;
        //   height: 100%;
        //   position: relative;

        //   .prize-item {
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     z-index: 2;
        //     width: 270px;
        //     height: 440px;
        // }
      }

      .wheel-pointer-box {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 100;
        transform: translate(-50%, -50%);

        .wheel-pointer {
          background-repeat: no-repeat;
          background-position: center top;
          background-size: 100%;
          transform-origin: center 50%;
        }
      }
    }
  }
}
</style>

