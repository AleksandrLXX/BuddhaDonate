<template>
	<div>
		<h3 class='text-center' style="margin-top:10px;">选佛场建设募捐</h3>
		<h5 class='text-center' style="color:#999;margin-bottom:20px;" >捐款活动： 开始事件2018年5月12日</h5>
		
		<swiper :options="swiperOption" ref="mySwiper" :style='{"height":swiperH}'>
		    <!-- slides -->
		    <swiper-slide>I'm Slide 1</swiper-slide>
		    <swiper-slide>I'm Slide 2</swiper-slide>
		    <swiper-slide>I'm Slide 3</swiper-slide>
		    <swiper-slide>I'm Slide 4</swiper-slide>
		    <swiper-slide>I'm Slide 5</swiper-slide>
		    <swiper-slide>I'm Slide 6</swiper-slide>
		    <swiper-slide>I'm Slide 7</swiper-slide>
		    <!-- Optional controls -->
		    <!-- <div class="swiper-pagination"  slot="pagination"></div>
		    <div class="swiper-button-prev" slot="button-prev"></div>
		    <div class="swiper-button-next" slot="button-next"></div>
		    <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
		    
		</swiper>
	    <div style="margin-top:20px;">
           <tab :line-width="2" custom-bar-width="40px" v-model='currentTab' active-color='#000' bar-active-color='#4a90e2' style='font-weight:500;font-size: 1.2em;'>
            <tab-item class="vux-center" :selected="currentTab === index" v-for="(item, index) in tabList" @click="currentTab = index" :key="index">{{item}}</tab-item>
          </tab>
          <vux-swiper v-model="currentTab" height="300px" :show-dots="false" >
            <swiper-item  key="0">
              <div class="tab-swiper vux-center">tab1 Container</div>
            </swiper-item>
            <swiper-item  key="1">
              <card>
               	<div slot="content" class="card-demo-flex card-demo-content01">
                 	<div class="">
                  		用户捐款
                  		 <br/>
                    	<countup tag='span' :end-val="amt" :duration="2" :decimals="2" class="demo1"></countup>
                 	</div>
                	<div class="">
                   		捐款人次
                   		<br/>
                  		<countup tag='span' :end-val="15" :duration="2" class="demo1"></countup>
                 	</div>
               </div>
             </card>
             <card > 
             	<div slot='header'>
             		感谢 <span class='text-red'>604</span> 位参与者帮助此项目
             	</div>
             	
             	<flexbox slot='content' class='bgi-full banner' align='align' orient='horizontal' justify='left' :gutter='gutter' style='width:80px;'>
		
					<flexbox-item span='50' class="bgi-full donate-item" style="" @click.native="handleMenuClick">
						<div class='donater-title'>
							种福田
						</div>
					</flexbox-item>
					<flexbox-item span='50' class="bgi-full donate-item" style="" >
						<div class='donater-title'>
							喜乐捐
						</div>
					</flexbox-item>
					<flexbox-item span='50' class="bgi-full donate-item" style="">
						<div class='donater-title'>
							我的捐款
						</div>
					</flexbox-item>
				
				</flexbox>
             	
             </card>
	         <x-button @click.native='amt+=20' type='primary' style='background-color: #861c2a;color:#fff;font-size: 16px;'>我要捐款</x-button>
            </swiper-item>
          </vux-swiper>
        </div>
	</div>
</template>
<script type="es6">
	import { Tab, TabItem } from 'vux'
	import { Swiper,SwiperItem } from 'vux'
	import { Card } from 'vux'
	import { Countup } from 'vux'
	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	export default{
		data(){
			return {
				swiperOption:{
					slidesPerView: 2,
			        spaceBetween: 10,
			        centeredSlides: true,

				},
				swiperH:width/32*9 +'px',
				tabList:['详情','捐款'],
				currentTab:1,
				amt:1024,
				gutter:(width - 200)/5
			}
		},
		components: {
		    Tab,
		    TabItem,
		    Card,
		    Countup,
		    "vux-swiper":Swiper,
		    "swiper-item":SwiperItem

		},
		props:['id'],

	}
</script>
<style type="less">
	.swiper-slide{
		background-color: #efefef;
	}
	.vux-tab .vux-tab-item{
		font-size: 16px!important;
		font-weight: 600;
	}
	.card-demo-flex {
	  display: flex;
	}
	.card-demo-content01 {
	  padding: 10px 0;
	}
	.card-padding {
	  padding: 15px;
	}
	.card-demo-flex > div {
	  flex: 1;
	  text-align: center;
	  color:#999;
	  font-size: 12px;
	}
	.card-demo-flex span {
	  color: #f54831;
	}
	.donater-item{
		width:50px;height:50px;
		border-radius:50%;
		background-color: #a99c87;
		background-image: url(../img/种福田.png);
		position: relative;
		.donater-title{
			position: absolute;
			top:100%;
			left:50%;
			width:auto;
			white-space: nowrap;
			transform: translateX(-50%);
		}
	}
</style>