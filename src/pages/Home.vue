<template>
  <div>
    <Slider class="slider-container" 
      :slides="slides" 
      :inv="inv" 
      :transitionName="transitionName" 
      :target="target" 
      :showPages="showPages" 
      :showControllers="showControllers"
      :autoPlay="autoPlay"></Slider>
    <ErrorMessageToast v-if="$store.state.errShow" :code="errorCode"></ErrorMessageToast>   
    <LuckyWheel 
      :awardList="awardList" 
      :diameter="200" 
      :lotteryBg="bg" 
      :lotteryBtn="btn" 
      :beforeLottery="beforeLottery"
      :afterLottery="afterLottery">
    </LuckyWheel>
    <NineRaffle
      :awardList="awardList"
      :lotteryBg="lotteryBg"
      :lotteryBtn="lotteryBtn"
      :beforeLottery="beforeLottery"
      :afterLottery="afterLottery">
    </NineRaffle>        
    <ErrorToast v-if="$store.state.toastShow"></ErrorToast>    
    <section class="header" @click="goBuy">
      <span class="rules" @click.stop="rulesShowHandler"></span>
    </section>
    <section class="clock" :class="[!ifEndNum?'clock-pre':'']">
      <div class="timer">
        <span>{{ifEndNum?"距今日秒抢仅剩":"今日秒抢已结束"}}</span>
        <Timer :endTime="1524042999000" v-on:ifEnd="ifEnd"></Timer>
      </div>
      <AwardList :ifEndNum="ifEndNum" :list = "list"></AwardList>
    </section>
    <section class="bottol">
      <div class="ball-gamer-pos">
        <BallGamer></BallGamer>
      </div>
      <div class="award-pos">
        <AwardList :ifEndNum="1"></AwardList>
      </div>
    </section>
    <section class="listen"></section>
  </div>  
</template>

<script>
import Timer from "Components/commonComponents/Timer";
import AwardList from "Components/commonComponents/AwardList";
import BallGamer from "Components/commonComponents/BallGamer";
import ErrorToast from "Components/commonComponents/ErrorToast";
import ErrorMessageToast from "Components/commonComponents/ErrorMessageToast";
import LuckyWheel from "Components/commonComponents/LuckyWheel";
import Slider from "Components/commonComponents/Slider";
import businessUtils from "@/assets/js/businessUtils";
import { userInfo } from "@/assets/js/const";
import NineRaffle from "Components/commonComponents/NineRaffle"

export default {
  name: "Home",
  components: {
    Timer,
    AwardList,
    BallGamer,
    ErrorToast,
    ErrorMessageToast,
    LuckyWheel,
    Slider,
    NineRaffle
  },
  data() {
    return {
      obj: {
        "campAlias": 'himusic.vueTest180716',
        "appId": userInfo?userInfo.appId:null,
        "terminalId": userInfo?userInfo.deviceid:null,
        "userToken": userInfo?userInfo.safeToken:null,
        "appType": userInfo?userInfo.appLayout:null,
        "appVersion": userInfo?userInfo.appVersionName:null,
        "deviceType": userInfo?userInfo.deviceModel:null
      },
      reqUrl:"/rest.root/campaign/joinCamp",
      ifEndNum: 0, //倒计时判断
      errorCode: "",
      campToken: "",
      // todo: 了解webpack中的alias 理解@等别名的使用
      list:  [
        {"tel":"139****121","detail":"获得华为watch2"},
        {"tel":"139****121","detail":"获得华为watch2"},
        {"tel":"139****121","detail":"获得华为watch2"},
        {"tel":"139****121","detail":"获得华为watch2"},
      ],
      awardList: [
        {
          name: "HUAWEI P20", // 奖品名称
          index: 0
        },
        {
          name: "华为手环青春版B3",
          index: 1
        },
        {
          name: "xSport运动蓝牙耳机",
          index: 2
        },
        {
          name: "荣耀引擎耳机",
          index: 3
        },
        {
          name: "谢谢惠顾",
          index: 4
        },
        {
          name: "36花币",
          index: 5
        },
        {
          name: "3花币",
          index: 6
        },
        {
          name: "京东卡",
          index: 7
        }
      ],
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
      autoPlay: true,
      showPages: false,
      showControllers: false,
      bg:require('@/assets/img/rotate.png'),
      btn:require('@/assets/img/start_z.png'),
      lotteryBtn:require('@/assets/img/start_lottery.png'),
      lotteryBg:require('@/assets/img/lottery-bg.png'),
    };
  },
  mounted() {
    let v;
    // console.log(this.GLOBAL)

    //ES7，异步操作的同步写法。建议使用。
    // (async ()=>{
    //   try {
    //     // v = await new Promise(resolve => {
    //     //   setTimeout(() => resolve("long_time_value"), 2000);
    //     // });
    //     // v += ' handled'
    //     // console.log(v);

    //     v = await this.axios(options)
    //     console.log(v);

    //   } catch (err) {
    //     console.log(err);
    //   }
    // })()
    // const _this = this
    businessUtils.userAuth(res => {
      res.data && res.data.retCode === "0" 
        // ? this.$store.state.campToken = res.headers['campaign-token'] 
        ? this.$store.commit('campaignTokenUpdate' , res.headers['campaign-token'])
        : this.respExp(res.data.retCode);
    });
    // console.log(businessUtils.modelJudgment("STF-TL10"));
    // console.log(this.$store.state.show)
    // this.beforeLottery(res => {

    // })
  },
  methods: {
    resolve: function (res) {
      this.respExp(res.data.retCode)
    },
    ifEnd: function(data) {
      this.ifEndNum = parseInt(data);
      // console.log(this.ifEndNum);
    },
    rulesShowHandler: function() {
      this.$store.commit('isShow','true')
      // this.$store.state.toastShow = true;
    },
    // ruleToastCtr: function(data) {
    //   this.rulesShow = data;
    // },
    goBuy: function() {
      console.log("去购买");
    },
    respExp: function (errorCode) {
      this.errorCode = errorCode;
      // this.$store.state.errShow = true
      this.$store.commit('doErrShow','true')
    },
    beforeLottery: function () {
      const promise = 
      this.axios.post('/rest.root/campaign/joinCamp',this.obj,{headers:{"campaign-token":this.$store.state.campToken}}).then(res => {
        console.log(res);
        return res.data && res.data.retCode === "0" ? this.joinSuccess(res) : this.respExp(res.data.retCode);
      })
      console.log(promise);
      
      return promise
      
    },
    joinSuccess: function (res) {
      // this.$store.state.campToken = res.headers['campaign-token'];
      this.$store.commit('campaignTokenUpdate',res.headers['campaign-token'])
      return res.data.awardName
    },
    afterLottery: function () {
      alert("pipiDan")
    }
  }
};
</script>

<style lang='stylus'>
@import '../assets/styl/common.styl';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

section {
  background-size: 100%;
  background-repeat: no-repeat;
  z-index: 1;

  &.header {
    height: 780px;
    background-image: url('../assets/img/index01.jpg');
    position relative;
    .rules {
      position: absolute;
      top: 30px;
      right: 60px;
      width: 165px;
      height: 48px;
    }
  }

  &.clock {
    position: relative;
    height: 1181px;
    background-image: url('../assets/img/index02_2.jpg');
    font-size: 34px;
    color: #fff;
    font-weight: 700;
  }

  &.clock-pre {
    height: 906px;
    background-image: url('../assets/img/index02.jpg');
  }

  &.bottol {
    position: relative;
    height: 2050px;
    background-image: url('../assets/img/index03.jpg');

    .ball-gamer-pos {
      position: absolute;
      top: 300px;
      left: 0;
      right: 0;
      height: 990px;
    }

    .award-pos {
      position: absolute;
      width: 620px;
      height: 144px;
      margin-left: -370px;
      padding: 18px 50px;
      left: 50%;
      bottom: 320px;
      overflow: hidden;
    }
  }

  &.listen {
    height: 1512px;
    background-image: url('../assets/img/index04.jpg');
  }
}

.timer {
  position: absolute;
  display: flex;
  align-items: center;
  top: 75px;
  left: 50%;
  width: 740px;
  margin-left: -370px;

  span {
    display: block;
    width: 290px;
    padding: 22px 0;
    font-size: 32px;
    text-align: center;
  }
}
</style>
