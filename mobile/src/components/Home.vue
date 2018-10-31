<template>
	<div>
		<flexbox class='bgi-full banner' align='center' orient='horizontal' justify='center' :gutter='gutter' :style="{'height':bannerH}">
		
			<flexbox-item span='50' class="bgi-full donate-item" style="" @click.native="handleMenuClick">
				<div class='donate-title'>
					种福田
				</div>
			</flexbox-item>
			<flexbox-item span='50' class="bgi-full donate-item" style="" >
				<div class='donate-title'>
					喜乐捐
				</div>
			</flexbox-item>
			<flexbox-item span='50' class="bgi-full donate-item" style="">
				<div class='donate-title'>
					我的捐款
				</div>
			</flexbox-item>
		
		</flexbox>
		<panel header="种福田" :footer="{url:null,title:''}" :list="list" type="5" @on-img-error="onImgError">
			
		</panel>

	</div>
</template>
<script>
	import { Panel } from 'vux'
	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	export default{
		data(){
			return{
				bannerH:width/2+'px',
				// 在space-around 下应该是 width-150 但设计图明显更紧凑
				gutter:(width-200)/4,
				list: [{
				        src: 'http://somedomain.somdomain/x.jpg',
				        // fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
				        title: '标题一',
				        desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
				        url: '/special/1'
				      }, {
				        src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
				        title: '标题二',
				        desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
				        url: {
				          path: '/special/2',
				          replace: false
				        },
				        // meta: {
				        //   source: '来源信息',
				        //   date: '时间',
				        //   other: '其他信息'
				        // }
				      }],
			}
		},
		components: {
		    Panel
		},
		methods:{
			handleMenuClick(){
				// console.log('gesfefe')
			},
			 onImgError (item, $event) {
		      console.log(item, $event)
		    }
		},
		

	}
</script>
<style lang="less">
	.banner{
		background-image: url(../img/banner.png);
	}
	.donate-item{
		width:50px;height:50px;
		border-radius:50%;
		background-color: #a99c87;
		background-image: url(../img/种福田.png);
		position: relative;
		.donate-title{
			position: absolute;
			top:100%;
			left:50%;
			width:auto;
			white-space: nowrap;
			transform: translateX(-50%);
		}
	}
</style>