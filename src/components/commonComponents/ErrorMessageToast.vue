<template>
  <transition class="error-message-toast" name="fade">
      <div class="toast">
        <p>{{ message }}</p>
      </div>
  </transition>
</template>
<script>
//todo: 看一下webpack中的alias 将引用路径根目录改为别名形式
import { errMsgForDisplay } from "@/assets/js/const";
export default {
  props: {
    code: {
      type: String,
      default: ""
    },
    msg: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      message: "网络连接错误，刷新试试！"
    };
  },
  mounted() {
    this.getMsg();
    this.hidden();
  },
  methods: {
    getMsg() {
      const msg = this.msg ? this.msg : errMsgForDisplay[this.code]
      this.message = msg ? msg : '网络连接错误，刷新试试！'
    },
    hidden() {
      if (this.$store.state.errShow == true) {
        this.autoHidden = setTimeout(() => {
          // this.$store.state.errShow = false;
          this.$store.commit('doErrShow','false')
          clearTimeout(this.autoHidden);
        }, 2000);
      }
    }
  },
  watch: {
  }
};
</script>

<style lang="stylus" scoped>
.hide {
  display: none;
}

.toast {
    position: fixed;
		z-index: 9999999999;
    //todo: 使用绝对定位或fix时，top、left等位置参数应避免使用百分比，请使用px（vw）
    bottom: 80px;
    left: 50%;
    transform: translate(-50%, -50%);
		text-align: center;
		box-sizing: border-box;
		padding: 15px 24px;
		line-height: 1.4;
		color: #fff;
		font-size: 24px;
		background-color: rgba(0,0,0,.8);
		border-radius: 40px;
		transform: translate3d(-50%,-50%,0);
}
</style>
