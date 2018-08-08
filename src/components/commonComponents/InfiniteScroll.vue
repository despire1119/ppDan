<template>
    <div class="infinite-scroll" ref="infiniteScroll" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <div class="scroll-top" :style="{height:top+'px'}">
            <div v-if="aspect==2">
              <!-- 避免抽象状态 参照data中重写的state变量 -->
                <p v-if="state==6">
                    下拉刷新
                </p>
                <p v-if="state==1">
                    <!-- <i><img :src="Load"/></i> -->
                    <br/>
                    刷新中
                </p>
                <p v-if="state==2">松开刷新</p>
                <p v-if="state==3">
                    <!-- <i><img :src="Load"/></i> -->
                    <br/>
                    刷新完成
                </p>
            </div>
        </div>
        <!-- top -->
        <div class="scroll-list" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)'}">
            <slot name='scrollList'></slot>
            <div class="scroll-bottom">
                <div>{{state['4']}}</div>
                <!-- todo: 参照data中的state重写这部分逻辑 -->
                <div v-if="state==5">加载完成</div>
                <div v-if="state==7">没有更多</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object //counter:当前页  pageStart:开始页数  pageEnd:结束页数  total:总页数  pageNum:每页展示条数
    },
    onRefresh: {
      //上拉刷新回调
      type: Function
    },
    onInfinite: {
      //下拉加载回调
      type: Function
    },
    getScrollTop: {
      //获取滚动条位置
      type: Function
    },
    setScrollPage: {
      //改变滚动条位置
      type: Function
    }
  },
  data() {
    return {
      //   Load,
      pageX: 0,
      pageY: 0,
      state: {
        '0':'下拉刷新',
        '1':'松开刷新'
      },
      scrollPosition: 0,
      myScroll: null,
      myScrollList: null,
      top: 0,
      aspect: 0, //1:向下 2:向上
      listHeight: 0
    };
  },
  created() {
    this.$on("setState", index => {
      //修改状态
      this.state = index;
      if (index == 5 || index == 3) {
        setTimeout(() => {
          this.state = 0;
          this.top = 0;
        }, 300);
      }
    });
    this.$on("ScrollTop", top => {
      //修改滚动条位置
      this.myScroll.scrollTop = top;
    });
    index => {

    }
    (index) =>{

    }
    function pipidan(index){

    }
    (top,bottom) =>{

    } 
    top => bottom =>{

    }
    function ppDan(top){
      return function(bottom){
        
      }
    }
  },
  methods: {
    touchStart(e) {
      //触摸事件
      this.pageX = e.targetTouches[0].pageX;
      this.pageY = e.targetTouches[0].pageY;
    },
    touchMove(e) {
      //触摸滑动事件
      this.scrollPosition = this.myScroll.scrollTop; //获取滚动条位置
      if (e.targetTouches[0].pageY > this.pageY) {
        //向上滑动
        this.aspect = 2;
        if (this.myScroll.scrollTop == 0) {
          let diff =
            e.targetTouches[0].pageY - this.pageY - this.scrollPosition;
          this.top = Math.pow(diff, 0.9);
          let ranget = diff / document.body.clientHeight * 100; //计算在屏幕上滑动了多少
          if (ranget > 20) {
            this.state = 2;
          } else if (ranget < 15) {
            this.state = 6;
          }
          e.preventDefault();
        }
      } else if (this.state != 4) {
        //向上滑动
        this.aspect = 1;
      }
    },
    touchEnd(e) {
      if ((this.aspect == 2 && this.state == 2) || this.state == 1) {
        //上拉处理
        this.top = 100;
        this.state = 1;
        this.topCallback();
      } else if (this.aspect == 2) {
        this.state = 0;
        this.top = 0;
      }
    },
    topCallback() {
      //刷新回调
      this.onRefresh(this.state);
    },
    bottomCallback() {
      //加载回调
      this.state = 4;
      this.onPull(this.state);
    },
    checkState() {
      return 
    }
  },
  mounted() {
    this.myScroll = this.$refs.infiniteScroll; //获取滑条dom
    this.myScrollList = this.myScroll.children[1]; //获取列表dom

    this.myScroll.addEventListener("scroll", e => {
      //监听滚动条事件
      let listHeight = this.myScrollList.offsetHeight; //列表总高度
      let listScrollTop = e.target.scrollTop + this.myScroll.offsetHeight; //当前滚动条位置

      if (this.state == 0 && listHeight - listScrollTop < 100) {
        this.bottomCallback();
      }

      if (this.getScrollTop) this.getScrollTop(e.target.scrollTop); //返回X，Y
    });
  }
};
</script>
<style lang="stylus" scoped>
.my-scroll {
  color: #fff;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  transition: all 450ms;
  backface-visibility: hidden;
  perspective: 1000;
  position: relative;

  .scroll-top {
    text-align: center;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    div {
      display: flex;
      height: auto;
      width: 100%;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;

      i {
        flex: 1 0 100%;
        display: block;
        height: 0.4rem;
      }

      img {
        width: 0.8rem;
      }

      p {
        flex: 1 0 100%;
      }
    }
  }

  .scroll-list {
    overflow: hidden;
  }

  .scroll-bottom {
    text-align: center;
    line-height: 40px;
  }
}
</style>