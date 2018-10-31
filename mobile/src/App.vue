<template>
  <div id="app" style='height:100%;'>
  	<drawer
      width="200px;"
      :show.sync="drawerVisibility">
	<!-- 侧边栏扩展 -->
    <div slot="drawer">
      <!-- 菜单内容 -->
    </div>

    <!-- rourer-view 作为默认插槽内容 -->
    <div class='weui-tab' >
	  	<x-header :left-options="leftOption"  class='bgi-full'
	  	style='position: absolute;width: 100%;top:0;left:0;'>浙江第一古刹金粟寺</x-header>
	  	<div class="weui-tab__panel">
	      <router-view></router-view>
	  	</div>
    </div>
    </drawer>
  </div>
</template>

<script>
import { Drawer } from 'vux'
import { XHeader } from 'vux'

export default {
  name: 'app',
  data:()=>{
  	return {
  		drawerVisibility:false,
  		leftOption:{
  			showBack:false
  		}
  	}
  },
  components: {
    Drawer,
    XHeader,
  },
}
</script>

<style lang="less">
/*深红 #861c2a */
/*橙红 #f54831*/
/*棕灰 #a99c87*/
/*深灰 #3d3d3d */
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';
@import './css/weui.min.css';

body, html {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
}
body {
  background-color: #fbf9fe;
}
.weui-tab {
    position: relative;
    height: 100%;
}
.weui-tab__panel {
    box-sizing: border-box;
    height: 100%;
    padding-bottom: 50px;
    padding-top: 46px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.bgi-normal{
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
}
.bgi-full{
	background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
}
.text-left{
    text-align: left;
}
.text-right{
    text-align: right;
}
.text-center{
    text-align: center;
}
.text-red{
	color:#f54831;
}
.absolute-center{
  position: absolute;
  left:50%;
  top:50%;
  transform: translateX(-50%) translateY(-50%);
}
.vux-header{
	background-image: url(./img/title_pattern.png);
}
</style>
