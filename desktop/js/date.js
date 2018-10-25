;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./moment'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory( require('./moment'));
    } else {
        // Browser globals
       factory(root.moment);
    }
}(this, function (moment){

	var defaultTemplate = ` <div style="height:50%;"><span class='jd-date-time'>{{time}}</span><span class='jd-date-day'>{{day}}</span></div>
			                <div style="height:50%;"><span class='jd-date-date'>{{date}}</span></div>`
	// 模板注册
	var templates = {
		default:defaultTemplate
	}

	
	$.fn.initDate=function(config){
		var _config = {
				class:'jd-date',
				template:'default',
				step:30000
		} 
		
		config=$.extend(_config,config)
		//支持jquery对象引入  即外部引入handlebars
		if(typeof config.template=='string'){
			config._template=templates[config.template]
		}else if(config.template instanceof jQuery){
			config._template=config.template.html();
		}
		return this.each(function(){
			var $this = $(this)
		    var $wrapper = $.fn.handlebarsRender(config._template,config);
		    // 先清除 
		    $this.data('date') && $this.destroyDate()
		    $wrapper.appendTo($this)
		    $this.data('date',$wrapper)
		    var now=moment().utc().
		    utcOffset(8),
	    			date=now.format('YYYY年MM月DD日'),
		        	time=now.format('HH:mm');
		        	day= '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_')[now.weekday()];
	    		$wrapper.find('.jd-date-date').text(date)
	    		$wrapper.find('.jd-date-time').text(time)
	    		$wrapper.find('.jd-date-day').text(day)
		    // 直插入一个interval 函数  其他的值只改变状态
		    var interval = setInterval(function(){
		    	console.count('live')
		    	// 如果这个节点已经被移除了 就clear掉
		    	if($wrapper.parents('body').length==0){
		    		console.log('clearInterval')
		    		clearInterval(interval)
		    	}
		    	
	    		var now=moment().utc().utcOffset(8),
	    			date=now.format('YYYY年MM月DD日'),
		        	time=now.format('HH:mm');
		        	day=now.weekday();
	    		$wrapper.find('.jd-date-date').text(date)
	    		$wrapper.find('.jd-date-time').text(time)
	    		$wrapper.find('.jd-date-day').text(day)
	    		// current 为0 时  将计时状态撤销 ，发出 timer-end 事件
		    },config.step)
		})
	}
	$.fn.destroyDate=function(){
		return this.each(function(){
			var $this = $(this)
			$this.data('date')&&$this.data('date').remove()&&console.log('date has destroyed');
			$this.data('date',null);
		})
	}
	return function(){
		// do nothing
	}

}))
