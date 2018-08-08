<template>
  <ul class="con">
    <li v-for="(i,index) in time" :key="index">{{i}}</li>
  </ul>
</template>
<script>
export default {
  name: "Timer",
  props: {
    endTime:{
      type: Number
    }
  },
  data(){
    return {
      time: [],
      flag: false
    }
  },
  mounted(){
    const [endTime , nowTime] = [new Date(this.endTime),new Date()],
      leftTime = parseInt((endTime.getTime()-nowTime.getTime())/1000)
    this.timeDown(leftTime)
  },
  methods: {
    timeDown(data){
      let trueLeft = data
      if(trueLeft > 0){
        let time = setInterval(()=>{
          if(this.flag){
            this.time = [0,0,":",0,0,":",0,0]
            this.$emit('ifEnd',0)
            clearInterval(time)
            return
          }
          let d = parseInt(trueLeft/(24*60*60)).toString().split("")
          let h = this.formate(parseInt(trueLeft/(60*60)%24)).toString().split("")
          let m = this.formate(parseInt(trueLeft/60%60)).toString().split("")
          let s = this.formate(parseInt(trueLeft%60)).toString().split("")
          this.time = [h[0]||"0",h[1]||"0",":",m[0]||"0",m[1]||"0",":",s[0]||"0",s[1]||"0"]
          trueLeft--
          trueLeft == 0 ? this.flag = true : null
        },1000)
      }else{
        this.time= [0,0,":",0,0,":",0,0]
        this.$emit('ifEnd',0)
      }
      // console.log(this.time)
    },
    formate(time){
      return time >= 10 ? time : `0${time}`
    }
  }
}
</script>
<style lang="stylus" scoped>
  .con
    display flex
    align-items center
    margin-left 20px
    text-align center
    justify-content center
    vertical-align middle        
    li
      display flex
      text-align center
      justify-content center
      width 57px
      height 77px
      line-height 85px
      border-radius 10px
      background-color #bf90ff
      box-shadow -5px 5px 15px #8638b9 inset
      margin-right 9px
      &:nth-child(3),&:nth-child(6)
        width 26px
        line-height 68px
        font-size 60px
        background-color transparent
        box-shadow 0 0 0 transparent inset
</style>

