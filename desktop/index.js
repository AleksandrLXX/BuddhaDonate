$(function(){
	// 绘制 文字 迪厅球
	renderLampMagicBall('canvasOne')
	// 绘制 云彩 
	renderCloud('canvasTwo',cloudBase64Str)
	$('.date-container').initDate({});
	var data = new Array(10).fill('').map(item=>{
                    	return {
                    		name:'建达、博泰高管',
                    		amt:79353,
                    		log:"时时心清净,日日事吉祥！"
                    	}
                    })
	$('.donate_list1').html(`
				<div  class='list-wrapper flex-fill' style='overflow:visible;position:relative;top:0'>
				<div class='roll_list1 d-flex flex-column justify-content-start' >
                    ${data.map(item=>`<div class ='esi_item flex-shrink-0 flex-grow-0 d-flex flex-row  justify-content-around align-items-center py-2' >
                         <div> ${item["name"]} </div>
                         <div>${item["amt"]}</div>
                         <div>${item["log"]}</div>
                    </div>`).join('')}
                </div>
                
                <div class='roll_list2'>
                </div>
                </div>`)
	initRollList('.donate_list1',data)
	$('.donate_list2').html(`
				<div  class='list-wrapper flex-fill' style='overflow:visible;position:relative;top:0'>
				<div class='roll_list1 d-flex flex-column justify-content-start' >
                    ${data.map(item=>`<div class ='esi_item flex-shrink-0 flex-grow-0 d-flex flex-row  justify-content-around align-items-center py-2' >
                         <div> ${item["name"]} </div>
                         <div>${item["amt"]}</div>
                         <div>${item["log"]}</div>
                    </div>`).join('')}
                </div>
                
                <div class='roll_list2'>
                </div>
                </div>`)
	initRollList('.donate_list1',data)
	initRollList('.donate_list2',data)
	function initRollList(el,data){
		$(`${el} .roll_list2`).html($(`${el} .roll_list1`).html())
		$(`${el} .list-wrapper`).css('height',$(`${el} .roll_list1`).height())
		var $wrapper = $(`${el} .list-wrapper`)
		var $roll_list1 = $(`${el} .roll_list1`)
		// let item_h = $('.esi_item').height()
		let item_h = $(`${el} .roll_list1`).height()/data.length

		// 间隔时间
		var interval_time = 3000;
		var myFunction = setInterval(moveTop, interval_time);
		function moveTop() {
		    if ($roll_list1.height() - Math.abs(parseInt($wrapper.css('top'))) - item_h <= 0){
		         $wrapper.css('transition', '')
		         $wrapper.css('top','0px')
		         // 这样处理可以避免抖动
		         moveTop()
		    }else {
		            
		        $wrapper.css('transition', 'top linear 3s')
		       $wrapper.css('top', parseInt($wrapper.css('top'))-item_h+'px')
		    }
		}
	}
	

    

})