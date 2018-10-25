/**
 * [列表模块]
 * 推荐结构
 * list-container(页面占位div)
 * 		{{content}}
 * 		list-wrappaer(wrapper只有一个 列表滚动的主体) 
 *   		term-group(一级列表项)
 *   			term-unit(二级列表项)
 * attr1 使用handlebars模板组件化 todo:模板支持在页面实时输入 采用jquery element输入
 * attr2 机构为 container{用户传入}>wrapper>list_item
 * attr3 支持事件绑定传入 事件透出
 * attr4 支持排序 sort function 利用flex的order 避免重绘
 * @Author   AleksandrLXX
 * @DateTime 2018-04-11T14:35:39+0800
 * @param    {[type]}                 list){	return function(){	}} [description]
 * @return   {[type]}                                [description]
 *
 * tip: 使用 horizontal 时   wrapper一定要被子元素撑开  最好设为BFC
 */

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./hammer', './swiper/swiper.min'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory( require('./hammer'),require('./swiper/swiper.min'));
    } else {
        // Browser globals
       factory(root.Hammer,root.Swiper);
    }
}(this, function (Hammer, Swiper){

	// 模板注册
	var defaultGroup = `<section class="term-group" style="order:{{termGroupOrder}}" data-index='{{indexDefault}}'>
			<h5 class="term-title">{{title}}</h5>
			<dl class="term-list dl-horizontal d-flex flex-column">
			{{#each terms}}
			  <section class="term-unit" style="order:{{termUnitOrder}}">
				  <dt>{{term}}</dt>
				  <dd>{{description}}</dd>
			  </section>
			{{/each}}
			</dl>
		</section>`
	var defaultWrapper = `<div class="list-wrapper d-flex flex-column">
					<h3>默认列表</h3>
				</div>
					`
	var groupTemplates={
		default:defaultGroup
	}
	var wrapperTemplates={
		default:defaultWrapper
	}
	const directionConfig = {
		'vertical':{
				direction_tag:'vertical',
				css_tag : 'overflow-y',
				length_fun_tag:'height',
				hammer_direction_tag:Hammer.DIRECTION_VERTICAL,
				hammer_function_tag:"tap pan swipe swipeup swipedown",
				translate_tag:'translateY',
				e_attr_tag:'deltaY',
				position_tag:'top',
			},
		'horizontal':{
				direction_tag:'horizontal',
				css_tag : 'overflow-x',
				length_fun_tag:'width',
				hammer_direction_tag:Hammer.DIRECTION_HORIZONTAL,
				hammer_function_tag:"tap pan swipe swipeleft swiperight",
				translate_tag:'translateX',
				e_attr_tag:'deltaX',
				position_tag:'left',
			}
	}
	var compileHTML=function(data,config){
		var data = data;
		var dataMap = config.dataMap;
		var wrapper = config._wrapperTemplate;
		var group =config._groupTemplate;
		
		// 数据处理
		var groupCompile = Handlebars.compile(group)

		var groupsHTML = data.map(function(item,index){
			item.title=item[dataMap.title||'title']
			item.termGroupOrder=config.groupSort(item);
			//当是二层结构时,梳理一遍结构
			config._level_==2&&item[dataMap.terms].map(function(i_item){
				i_item.term=i_item[dataMap.term]||''
				i_item.description=i_item[dataMap.description]||''
				i_item.termUnitOrder=config.unitSort(i_item);
				if(config.termMap instanceof Function){
				i_item.termMap = config.termMap(i_item)||{};
				}
			})
			item['indexDefault']=index;
			item.terms=item[dataMap.terms]
			return groupCompile(item)
		}).join('')
		return groupsHTML;
	}
	/**
	 * [initList description]
	 * init config 调用该方法可以生成一个list_wrapper追加到dom尾部
	 * 调用之前会将原先的列表清除
	 * 如果想追加列表，请调用 appendList 方法 
	 * @Author   AleksandrLXX
	 * @DateTime 2018-04-11T15:31:34+0800
	 * @param    {[type]}                 config [description]
	 * @return   {[type]}                 [description]
	 */
	$.fn.initList=function(config){
		var groupOrder=0;
		var termOrder=0;
		var _config={
			name:'',

			wrapperTemplate:'default',
			groupTemplate:'default',
			data:{},
			// swiperHeight:num,
			dataMap:{
				title:'title',
				terms:'terms',
				term:'term',
				description:'description'
			}, 
			// 是否使用swiperjs插件
			useSwiperPlugin:false,
			// 滑动单元的类名（必须带data-index 属性）：
			slideItemClass:'',
			// 增加 nav 按钮
			swiper:true,

			nav:false,
			direction:'vertical',
			// 点击与滑动的点击位置  数字越大 越容易在滑动中触发点击 
			clickDeviation:20,
			// 触发惯性滑动的阈值  数字越小 越容易触发惯性滑动
			velocityThreshold:0.1,
			// 惯性速率  数字越大  触发的惯性滑动距离越大
			momentumRatio:1,
			// 回弹系数 0-1  数字越大  可以继续拖动的距离越大
			resistance: 0.3,
			// 按钮为 data-target='{{listName}}' data-roll: [prev|next]
			groupSort:function(item){
				groupOrder+=1;
				return groupOrder;
			},
			unitSort:function(item){
				termOrder+=1;
				return termOrder;
			},
		}
		config=$.extend(_config,config)
		// 触发滚动的判断
		var Mouse = {
		    x: 0,
		    y: 0,
		    delta:config.clickDeviation,
		    mousedown: function (event) {
		        Mouse.y = event.touches?event.touches[0].clientY:event.clientY;
		        Mouse.x = event.touches?event.touches[0].clientX:event.clientX;
		    },
		    mouseup: function (event) {
		   	// 当 event.clientX clientY 为undifined  则为模拟事件  应该
		   	    var transformX = event.touches?event.touches[0].clientX:event.clientX;
		   	    var transformY = event.touches?event.touches[0].clientY:event.clientY;
		        if (typeof transformX == 'undefined' || typeof transformY=='undefined'){
		        	return true
		        }else if( Math.abs(transformX - Mouse.x)>Mouse.delta || Math.abs(transformY - Mouse.y)>Mouse.delta) {
		            console.log('slide');
		            return false;
		        } else {
		            console.log('click');
		            return true
		        }
		    }
		}

		//支持jquery对象引入  即外部引入handlebars
		if(typeof config.wrapperTemplate=='string'){
			config._wrapperTemplate=wrapperTemplates[config.wrapperTemplate]
		}else if(config.wrapperTemplate instanceof jQuery){
			config._wrapperTemplate=config.wrapperTemplate.html();
		}

		if(typeof config.groupTemplate=='string'){
			config._groupTemplate=groupTemplates[config.groupTemplate]
		}else if(config.groupTemplate instanceof jQuery){
			config._groupTemplate=config.groupTemplate.html();
		}
		
		// 数据结构检查
		if(config.dataMap.terms === null){
			config._level_=1;
		}else if(config.data instanceof Array && config.data[0][config.dataMap.terms] instanceof Array){
			config._level_=2;
		}else{
			console.error('[initList]:config.data 数据结构错误，请检查或使用dataMap修正')
			return '';
		}
		config.directionMap = directionConfig[config.direction]
		return this.each(function(){
			
			// 变量
			var $this = $(this)
			var directionMap = config.directionMap 
			var height =  $this[directionMap.length_fun_tag]();
			var $wrapper = $(config._wrapperTemplate);
			var scrollType = $this.css(directionMap.css_tag);
			
			var groupsHTML =  compileHTML(config.data,config)
			// 先清除wrapper
			$this.destroyList();

			


			$(groupsHTML).appendTo($wrapper)
			
			$wrapper.appendTo($this);

			// 保存$wrapper元素
			$this.data('wrapper',$wrapper);
			$this.data('config',config);

			// 兼容一下 内置swiperjs版本  
			if(config.useSwiperPlugin){
				if(!config.slideItemClass){
							config.nav&&console.warn(`slideItemClass未制定,默认滑块定位单元为".term-group",\
								如果这不是理想的定位单元,为了保证nav表现正常,请指定正确的slideItemClass(务必带有[data-index]属性)`)
							config.slideItemClass='.term-group'
				}
				$this.addClass('swiper-container')
				$wrapper.addClass('swiper-wrapper')
				$wrapper.find(config.slideItemClass||'.term-group').addClass('swiper-slide')
				$this.append(`<div class="swiper-scrollbar parent-${$this.attr('class').split(' ').join('-')}"></div>`)
				var swiper =new Swiper('.'+$this.attr('class').split(' ').join('.'),Object.assign({
					direction:config.direction,
					freeMode:true,
					slidesPerView:'auto',
					freeModeMinimumVelocity:0.1,
					scrollbar:{
						el: `.swiper-scrollbar.parent-${$this.attr('class').split(' ').join('-')}`,
						hide: true,
					}
				},config.swiperOption||{}));
				$this.data('swiper',swiper);
				if(config.nav){
					if(typeof config.name=='string' && config.name){
						
						// reset navbtns的状态  
						$this.attr('data-current','pl lookup  swiperIndex');
						$(`[data-target='${config.name}'][data-roll='next']`).removeClass('disable')
						$(`[data-target='${config.name}'][data-roll='prev']`).removeClass('disable')
						//绑定事件
						$(`[data-target='${config.name}'][data-roll='prev']`).on('click.list_nav',function(){
							console.log('111')
							var $listContainer = $this;
							var $thisBtn = $(this);
							var length = swiper.slides.length;
							var current=swiper.activeIndex
							var $prev = current-1;
							swiper.slidePrev();
								//因为刚开始的时候prev可能会直接到最后一项 所以还是要清一下disable样式

						})
						$(`[data-target='${config.name}'][data-roll='next']`).on('click.list_nav',function(){
							var $listContainer = $this;
							var $thisBtn = $(this);
							var length = swiper.slides.length;
							var current= swiper.activeIndex;
							var $next = current + 1
						
							swiper.slideNext();
								//因为刚开始的时候prev可能会直接到最后一项 所以还是要清一下disable样式
								
							
						})
						var $nextBtn =$(`[data-target='${config.name}'][data-roll='next']`)
						var $prevBtn =$(`[data-target='${config.name}'][data-roll='prev']`)
						$nextBtn.removeClass('disable')
						$prevBtn.removeClass('disable')
						swiper.isBeginning && $prevBtn.addClass('disable')
						swiper.isEnd && $nextBtn.addClass('disable')
						swiper.on('transitionEnd',function(){
							$nextBtn.removeClass('disable')
							$prevBtn.removeClass('disable')
							swiper.isBeginning && $prevBtn.addClass('disable')
							swiper.isEnd && $nextBtn.addClass('disable')
						})
					}else{
						console.error('带nav的list必须要有name属性')
					}
				}
				return;
			}




			var wrapperHeight = $wrapper[directionMap.length_fun_tag]()
			// 回弹距离
			var resistance_offset = height*config.resistance
			//给 pre 和 next 绑定 事件 事件名称空间为 .list_nav
			if(!config.slideItemClass){
						config.nav&&console.warn(`slideItemClass未制定,默认滑块定位单元为".term-group",\
							如果这不是理想的定位单元,为了保证nav表现正常,请指定正确的slideItemClass(务必带有[data-index]属性)`)
						config.slideItemClass='.term-group'
			}
			if(config.nav){
				if(typeof config.name=='string' && config.name){
					
					// reset navbtns的状态  
					$this.attr('data-current','');
					$(`[data-target='${config.name}'][data-roll='next']`).removeClass('disable')
					$(`[data-target='${config.name}'][data-roll='prev']`).removeClass('disable')
					//绑定事件
					$(`[data-target='${config.name}'][data-roll='prev']`).on('click.list_nav',function(){
						var $listContainer = $this;
						var $thisBtn = $(this);
						var length = $listContainer.find(config.slideItemClass).length;
						var current=$listContainer.attr('data-current')||length;
						var $prev = $listContainer.find(`${config.slideItemClass}[data-index='${current-1}']`);
						if($prev.length>0){
							$listContainer.rollTo($prev);
							$listContainer.attr('data-current',--current)
							//因为刚开始的时候prev可能会直接到最后一项 所以还是要清一下disable样式
							if(current==0){
								$thisBtn.addClass('disable')
							}else{
								$thisBtn.removeClass('disable')
							}
							if(current==length-1){
								$(`[data-target='${config.name}'][data-roll='next']`).addClass('disable')
							}else{
								$(`[data-target='${config.name}'][data-roll='next']`).removeClass('disable')
							}
						}
					})
					$(`[data-target='${config.name}'][data-roll='next']`).on('click.list_nav',function(){
						var $listContainer = $this;
						var $thisBtn = $(this);
						var length = $listContainer.find(config.slideItemClass).length;
						var current=$listContainer.attr('data-current')||0;
						var $next = $listContainer.find(`${config.slideItemClass}[data-index='${Number(current)+1}']`)
						if($next.length>0){
							$listContainer.rollTo($next);
							$listContainer.attr('data-current',++current)
							//因为刚开始的时候prev可能会直接到最后一项 所以还是要清一下disable样式
							if(current==0){
								$(`[data-target='${config.name}'][data-roll='prev']`).addClass('disable')
							}else{
								$(`[data-target='${config.name}'][data-roll='prev']`).removeClass('disable')
							}
							if(current==length-1){
								$thisBtn.addClass('disable')
							}else{
								$thisBtn.removeClass('disable')
							}
						}
					})
				}else{
					console.error('带nav的list必须要有name属性')
				}
			}
			// 使用hammer来处理overflow:hidden下的滚动
			if(scrollType=='hidden' && config.swiper){
				console.log('initLIST')
				var listHammer = new Hammer(this)
				listHammer.get('pan').set({direction:directionMap.hammer_direction_tag})
				listHammer.get('swipe').set({direction:Hammer.DIRECTION_ALL,velocity:1})
				var isSwipeup = false;
				var isSwipedown = false;
 				var swipeRadio = 3;//  swipe 触发时滚动的比例
				var deltaYPrev = 0;
				var getTransformY = ()=>{
					let translateY=$wrapper.css('transform');
					if(directionMap.direction_tag == 'vertical'){

						return /translateY\((-?\d+\.?\d+)px\)/.exec(translateY)
								?/translateY\((-?\d+\.?\d+)px\)/.exec(translateY)[1]
								:/matrix\(1, 0, 0, 1, 0, (-?\d+\.?\d+)\)/.exec(translateY)
									?/matrix\(1, 0, 0, 1, 0, (-?\d+\.?\d+)\)/.exec(translateY)[1]
									:0;
					}
					if(directionMap.direction_tag == 'horizontal'){

						return /translateX\((-?\d+\.?\d+)px\)/.exec(translateY)
								?/translateX\((-?\d+\.?\d+)px\)/.exec(translateY)[1]
								:/matrix\(1, 0, 0, 1, (-?\d+\.?\d+), 0\)/.exec(translateY)
									?/matrix\(1, 0, 0, 1, (-?\d+\.?\d+), 0\)/.exec(translateY)[1]
									:0;
					}
				}

				$wrapper.on('mousedown touchstart','.term-unit,.term-group',function(e){
					Mouse.mousedown(e)
				}).on('mouseup touchend','.term-unit,.term-group',function(e){
			
					let $this = $(this)
					
					// 判断是否是正确的点击事件 
					if(Mouse.mouseup(e)){
						$this.trigger('realClick')
					}
				})

				listHammer.on(directionMap.hammer_function_tag,function(e){
					
					// console.log('isFirst',e.isFirst)
					// console.log('isFinal',e.isFinal)					
					switch (e.type){
						case 'swipeup':
							// console.log('swipeup')

							// isSwipeup = true;

							break;
						case 'swipedown':
							// console.log('swipedown')
							// isSwipedown = true;
							break;
						case 'swipeleft':
							// console.log('swipeup')

							// isSwipeup = true;

							break;
						case 'swiperight':
							// console.log('swipedown')
							// isSwipedown = true;
							break;
						case 'pan':
							// 截取 垂直方向偏移
							console.log(e)
							var transformY = 	getTransformY()
							console.log(directionMap.translate_tag,transformY)
							// 防止 拖动有延迟
							$wrapper.css('transition-duration','0s')
							$wrapper.css('transform',`${directionMap.translate_tag}(${Number(transformY)+e[directionMap.e_attr_tag]-deltaYPrev}px)`)
							// console.log('computedY',Number(transformY)+e[directionMap.e_attr_tag]-deltaYPrev)
							deltaYPrev = e[directionMap.e_attr_tag];

							// 当结束时 处理 滑动惯性  和 边界弹性 resistance 
							if(e.isFinal){
								deltaYPrev = 0;
								// console.log('deltaYPrev 清零',deltaYPrev)
								$wrapper.css('transition-duration','0.2s')
								if(isSwipeup){
									// console.log('exec swipeup')
									// console.log('swiperHeight',height)
									!height && console.warn('当前的滚动高度为0 如果要设定滚动高度 请在config中提供swiperHeight属性 {{number}}')
									$wrapper.css('transform',`${directionMap.translate_tag}(${Number(transformY)- height*swipeRadio}px)`)
									// 因为有动画 所以这里也要判断下
									if(Math.abs(Number(transformY)- height*swipeRadio )> $wrapper[directionMap.length_fun_tag]()){
										$this.rollTo($this.find(`${config.slideItemClass}:last-child`))
									}
									isSwipeup = false;
								}
								if(isSwipedown){
									// console.log('exec swipedown')
									// console.log('swiperHeight',height)
									$wrapper.css('transform',`${directionMap.translate_tag}(${Number(transformY)+ height*swipeRadio}px)`)
									// 因为有动画 所以这里也要判断下
									if(Number(transformY)+ height*swipeRadio > 0){
										$wrapper.css('transform',`${directionMap.translate_tag}(0px)`)
									}
									isSwipedown = false;
								}
								// 提供bounce 
								transformY = getTransformY()
								// 当 上方有空隙时 弹回 0 位置
								if(Number(transformY) > 0){
									$wrapper.css('transform',`${directionMap.translate_tag}(0px)`)
								}
								
								if(Math.abs(Number(transformY)) > $wrapper[directionMap.length_fun_tag]()){
									// console.log($this.data('wrapper').height())
									
									$this.rollTo($this.find(`${config.slideItemClass}:last-child`))

								}
							}
							break;
					default:
							break;
					}
				})
				$this.data('hammer',listHammer)
			}
			if(scrollType=='auto'){
				
			}
			
		})
	}

	/**
	 * [appendList description]
	 * 追加list 表单 数据结构需要相同
	 * @Author   AleksandrLXX
	 * @DateTime 2018-04-11T16:41:50+0800
	 * @return   {[type]}                 [description]
	 */
	$.fn.appendList=function(data){
		return this.each(function(){
			var $this=$(this);
			var config=$this.data('config');
			var $wrapper=$this.data('wrapper');
			if(!config || !$wrapper){
				console.error('appendList should be involved after initList!')
				return;
			}
			//插入
			var groupsHTML =  compileHTML(data,config)
			$(groupsHTML).appendTo($wrapper)

		})
	}
	/**
	 * [rollTo description]
	 * 滚动到指定dom 【jQuery对象】 的顶部
	 * @Author   AleksandrLXX
	 * @DateTime 2018-04-17T11:33:21+0800
	 * @param    {[type]}                 jqEl [description]
	 * @return   {[type]}                      [description]
	 */
	$.fn.rollTo=function(jqEl){
		return this.each(function(){
			var $this=$(this);

			var config=$this.data('config');
			var directionMap=config.directionMap 
			var $wrapper=$this.data('wrapper');
			var scrollType = $this.css(directionMap.css_tag)
			if(!config || !$wrapper){
				console.error('appendList should be involved after initList!')
				return; 
			}
			//插入
			if(config.useSwiperPlugin){
				$this.data('swiper').slideTo(jqEl)
				return ;
			}
			if(scrollType=='hidden'){
				var offsetY = jqEl.position()[directionMap.position_tag];
				console.log('RollTo','-'+offsetY)
				$wrapper.css('transform',`${directionMap.translate_tag}(-`+offsetY+'px)')
			}
			if(scrollType=='auto'){
				
			}
			

		})
	}
	/**
	 * [destroyList description]
	 * 如果已经有wrapper 即 已经init过了 就销毁wrapper
	 * @Author   AleksandrLXX
	 * @DateTime 2018-04-11T16:40:26+0800
	 * @return   {[type]}                 [description]
	 */
	$.fn.destroyList=function(){
		return this.each(function(){
			var $this=$(this);
			var config=$this.data('config');
			if($this.data('swiper')){
				$this.data('swiper').destroy(true)
				$this.data('wrapper')&&$this.data('wrapper').remove()&&console.log('list has destroyed');
				$this.data('wrapper',null);
				$this.data('swiper',null)
				$this.find('.swiper-scrollbar').remove();
				return;
			}
			$this.data('hammer')&&$this.data('hammer').destroy();
			$this.data('wrapper')&&$this.data('wrapper').remove()&&console.log('list has destroyed');
			$this.data('wrapper',null);
			if(config&&config.nav){
				$(`[data-target='${config.name}'][data-roll='prev']`).off('click.list_nav')
				$(`[data-target='${config.name}'][data-roll='next']`).off('click.list_nav')
				console.log('list_nav 事件已经移除')
			}
		})
	}
	return function(){
		// do nothing
	}
}))
