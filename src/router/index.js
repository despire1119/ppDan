import Vue from 'vue'
import Router from 'vue-router'
import Home from 'Pages/Home'
import PpDan from 'Pages/PpDan'
import InCard from 'Pages/InCard'
import actId from '@/assets/js/actId'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  },{
    path: `/${actId['PpDan'][process.env.NODE_ENV]}`,
    name: 'PpDan',
    component: PpDan
  },{
    path: `/${actId['InCard'][process.env.NODE_ENV]}`,
    alias: `/${actId['InCard'][process.env.NODE_ENV]}/000111.html`,
    name: 'InCard',
    component: InCard,
    meta:{
      title: '购年卡必有理'
    }
  }],
})
