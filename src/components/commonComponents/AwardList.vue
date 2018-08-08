<template>
<scrollor :data="listData" :class-option="classOption">
  <ul class="award-list" :class="[!ifEndNum?'hide':'']">
    <li v-for="(list,key) in listData" :key="key">
      <span>{{list.tel}}</span>
      <i>{{list.detail}}</i>
    </li>
  </ul>
</scrollor>
</template>
<script>
import scrollor from 'vue-seamless-scroll'

export default {
  name: "AwardList",
  components:{
    scrollor
  },
  props: {
    ifEndNum:{
      type:Number
    },
    list: {
      type: Array,
      default: ()=>{
        return [
          {"tel":"139****121","detail":"大姨妈"},
          {"tel":"139****121","detail":"获得华为watch2"},
          {"tel":"139****121","detail":"获得华为watch2"},
          {"tel":"139****121","detail":"获得华为watch2"},
          {"tel":"139****121","detail":"获得华为watch2"},
          {"tel":"139****121","detail":"获得华为watch2"},
        ]
      }
    }
  },
  data(){
    return {
      listData:[
        {"tel":"139****121","detail":"获得华为watch2"},
        {"tel":"139****121","detail":"获得华为watch2"},
        {"tel":"139****121","detail":"获得华为watch2"},
        {"tel":"139****121","detail":"获得华为watch2"},
        {"tel":"139****121","detail":"获得华为watch2"},
      ]
    }
  },
  mounted(){
     this.listData = this.list
  },
  methods: {
  },
  computed:{
    classOption: function(){
      return{
        step: 0.5,
        limitMoveNum: this.listData.length,
        hoverStop: false,
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .hide
    display none
  .award-list
    width 100%
    height 100%
    overflow-y auto
    &&::-webkit-scrollbar
      display none
    li
      display flex
      justify-content space-between
      line-height 55px
      color #fff
</style>


