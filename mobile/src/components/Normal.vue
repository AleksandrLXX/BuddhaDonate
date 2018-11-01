<template>
	<div style="height: 100%;">
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
		<div>
			<group >
		      <x-input  placeholder="请留下您的姓名" novalidate :iconType='iconType1'  :show-clear="false" @on-blur="onBlur" placeholder-align="left" stye='width:40%;'></x-input>
		       <x-input placeholder-align="left" :iconType='iconType2' placeholder="请留下您的手机号码"  mask="999 9999 9999" v-model="tel" :max="13" is-type="china-mobile"></x-input>
		       
		    </group>
		    <group style="padding-left:5px;padding-right:5px;">
    	       <flexbox align='center' orient='horizontal' justify='center' style='padding-left:10px;padding-right:10px;'>
    				<flexbox-item>
    					<x-button mini :span='1/4' :type='sumSelect=="5"?"warn":"default"' @click.native='sumSelect="5"'>5 元</x-button>
    				</flexbox-item>
    				<flexbox-item>
    					<x-button mini :span='1/4' :type='sumSelect=="10"?"warn":"default"' @click.native='sumSelect="10"'>10 元</x-button>
    				</flexbox-item>
    				<flexbox-item>
    					<x-button mini :span='1/4' :type='sumSelect=="20"?"warn":"default"' @click.native='sumSelect="20"'>20 元</x-button>
    				</flexbox-item>
    				<flexbox-item>
    					<x-button mini :span='1/4' :type='sumSelect=="50"?"warn":"default"' @click.native='sumSelect="50"'>50 元</x-button>
    				</flexbox-item>
    	       </flexbox>
    	        <flexbox align='center' orient='horizontal' justify='left' style='padding-left:10px;padding-right:10px;margin-top:10px;'>
    	        	<flexbox-item :span='1/4'>
    					<x-button mini :type='sumSelect=="100"?"warn":"default"' @click.native='sumSelect="100"'>100 元</x-button>
    				</flexbox-item>
    				<flexbox-item :span='1/4'>
    					<x-button mini :type='sumSelect=="200"?"warn":"default"' @click.native='sumSelect="200"'>200 元</x-button>
    				</flexbox-item>
    				<flexbox-item :span='1/2'>
    					<x-number v-model="customValue" :min='1' :step='10' button-style='round' fillable class='custom' :active='{"active":sumSelect=="custom"}' @click.native='handleCustom'></x-number>
    				</flexbox-item>
    	        </flexbox>
		    </group>
		    <group>
				 <popup-picker title="祝福语" :data="list1" v-model="greet"   :placeholder="'请选择祝福语'"></popup-picker>
		    </group>
			
		</div>
		<flexbox class='position-absolute footer' :class='{active:sum>0}'>
			<flexbox-item class='vux-1px-r'>￥ {{sum}}</flexbox-item>
			<flexbox-item></flexbox-item>
		
		</flexbox>
	</div>
</template>
<script>
	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	import { PopupPicker } from 'vux'
	export default{
		data(){
			return{
				bannerH:width/2+'px',
				// 在space-around 下应该是 width-150 但设计图明显更紧凑
				gutter:(width-200)/4,
				name:'',
				tel:'',
				iconType1:'',
				iconType2:'',
				sumSelect:"",
				customValue:5,
				list1:[["愿佛光普照，法喜充满！","愿三宝加持，福慧双收！","更上一层楼,早登无上觉","法喜充满,六时吉祥"]],
				greet:[],
			}
		},
		computed:{
			sum(){
				return this.sumSelect == "custom"? this.customValue :Number(this.sumSelect);
			}	
		},
		components: {
			 PopupPicker
		},
		methods:{
			handleMenuClick(){
				// console.log('gesfefe')
			},
			 onImgError (item, $event) {
		      console.log(item, $event)
		    },
		    onBlur(val){
		    	this.name = val
		    },
		    handleCustom(){
		    	console.log('click')
		    	this.sumSelect = 'custom'
		    }
		},
		

	}
</script>
<style lang="less">
	.weui-cells.vux-no-group-title::before{
	
			display: none;
		
	}
	.weui-cell__ft.vux-cell-primary>div{
		float:none!important;
	}
	.custom.weui-cell{
		padding-left:0;
	}
	.weui-btn:after{
		border-width: 2px!important;
	}
	.footer{
		// bottom:-60px;
		position:absolute;
		bottom:0;
		left:0;
		width:100%;
		height:60px;
	}
</style>