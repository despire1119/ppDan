<template>
  <div class="slide-show" @touchstart="startHandler" @touchend="endHandler" :autoPlay="autoPlay" :transitionName="transitionName">
    <transition-group tag="ul" class='slide-ul'
      :enter-class="enterClass" 
      :enter-active-class="enterActiveClass"
      :leave-class="leaveClass" 
      :leave-active-class="leaveActiveClass">
      <li v-for="(item , index ) in slides" :key="index" v-show="index===nowIndex">
        <a :href="item.href" :target="target">
          <img :src="item.src" alt="">
        </a>
      </li>
    </transition-group>
    <!-- 分页按钮 -->
    <ul class="slide-pages" v-show="showPages">
      <li v-for="(item, index) in slides" :key="index" class="slide-page-point"
      >
        <a :class="{'active': index === nowIndex}">{{ index + 1 }}</a>
      </li>
    </ul>
    <!-- 切换前一个/后一个幻灯片按钮 -->
    <div class="control-wrapper" v-show="showControllers">
      <a class="prev" @click="movePre(prevIndex)"></a>
      <a class="next" @click="moveNext(nextIndex)"></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Slider",
    props: {
      slides: {
        type: Array,
        default: []
      },
      inv: {
        type: Number,
        default: 1000
      },
      transitionName: {
        type: String,
        default: 'move'
      },
      target: {
        type: String,
        default: '_blank'
      },
      showPages: {
        type: Boolean,
        default: false
      },
      showControllers: {
        type: Boolean,
        default: false
      },
      autoPlay: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        nowIndex: 0,
        enterClass: 'move-enter-right',
        enterActiveClass: 'move-enter-right-active',
        leaveClass: 'move-leave-right',
        leaveActiveClass: 'move-leave-right-active'
      }
    },
    computed: {
      prevIndex () {
        return this.nowIndex === 0 ? this.slides.length-1 : this.nowIndex-1
      },
      nextIndex () {
        return this.nowIndex === this.slides.length - 1 ? 0 : this.nowIndex + 1
      }
    },
    methods: {
      goto (index) {
        this.nowIndex = index
      },
      runInv () {
        this.invId = setInterval(() => {
          if (this.transitionName === 'move') {
            this.enterClass = "move-enter-right";
            this.enterActiveClass = "move-enter-right-active";
            this.leaveClass = "move-leave-right";
            this.leaveActiveClass = "move-leave-right-active";
          }
          this.goto(this.nextIndex)
        }, this.inv);
      },
      clearInv () {
        clearInterval(this.invId);
      },
      startHandler (e) {
        this.clearInv();
        this.startX = e.targetTouches[0].clientX;
      },
      endHandler (e) {
        this.endX = e.changedTouches[0].clientX;
        if (this.endX - this.startX > 80) {
          this.movePre();
        } else if (this.startX - this.endX > 80) {
          this.moveNext();
        }
        if (this.autoPlay) {
          this.runInv();
        }
      },
      moveNext () {
        // 从右往左滑动
        if (this.transitionName != 'fade') {
          this.enterClass = "move-enter-right";
          this.enterActiveClass = "move-enter-right-active";
          this.leaveClass = "move-leave-right";
          this.leaveActiveClass = "move-leave-right-active";
        }
        this.nowIndex === this.slides.length - 1 ? this.nowIndex = 0 : this.nowIndex = this.nowIndex + 1;
        this.goto(this.nowIndex);
      },
      movePre () {
        // 从左往右滑动
        if (this.transitionName != 'fade') {
          this.enterClass = "move-enter-left";
          this.enterActiveClass = "move-enter-left-active";
          this.leaveClass = "move-leave-left";
          this.leaveActiveClass = "move-leave-left-active";
        }
        this.nowIndex === 0 ? this.nowIndex = this.slides.length - 1 : this.nowIndex = this.nowIndex - 1
        this.goto(this.nowIndex);
      }
    },
    mounted () {
      if (this.transitionName === 'fade') {
        this.enterClass = 'fade-enter';
        this.enterActiveClass = 'fade-enter-active';
        this.leaveClass = 'fade-leave';
        this.leaveActiveClass = 'fade-leave-active';
      }
      if (this.autoPlay) {
        this.runInv();
      }
      [this.startX, this.startY]=[0, 0]
    }
  }
</script>

<style lang="stylus" scoped>
  .slider-container {
    width: 100%;
    height: 460px;
  }
  .slide-pages {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    li {
      display: inline-block;
      height: 18px;
      a {
        display: block;
        width: 10px;
        height: 10px;
        margin: 0 5px;
        border: 2px solid #fff;
        border-color: rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        text-align: left;
        text-indent: -9999px;
        overflow: hidden;
        _zoom: 1;
        background: #f5f5f5;
        background: rgba(0, 0, 0, 0.4);
        -webkit-transition: all .2s;
        transition: all .2s;
        &.active {
          background: #fff;
          background: rgba(255, 255, 255, 0.4);
          border-color: #757575;
          border-color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }

  .control-wrapper {
    a {
      display: inline-block;
      position: absolute;
      top: 50%;
      width: 41px;
      height: 69px;
      transform: translateY(-50%);
    }
  }

  .prev {
    left: 10px;
    background: url("../../assets/img/icon-slides.png") no-repeat -30px 50%;
  }

  .next {
    right: 10px;
    background: url("../../assets/img/icon-slides.png") no-repeat -178px 50%;
  }

  .slide-show {
    position: relative;
    overflow: hidden;
  }

  .slide-ul {
    width: 100%;
    height: 100%;
    li {
      position: absolute;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .move-enter-right-active {
    transition: all .5s ease;
    transform: translateX(0);
  }
  .move-enter-right {
    transform: translateX(100%);
  }
  .move-enter-left-active {
    transition: all .5s ease;
    transform: translateX(0);
  }
  .move-enter-left {
    transform: translateX(-100%);
  }

  .move-leave-right-active {
    transition: all .5s ease;
    transform: translateX(-100%);
  }
  .move-leave-right {
    transform: translateX(0);
  }
  .move-leave-left-active {
    transition: all .5s ease;
    transform: translateX(100%);
  }
  .move-leave-left {
    transform: translateX(0);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
