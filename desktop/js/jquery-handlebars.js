;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./jquery', './handlebars'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory( require('./jquery'),require('./handlebars'));
    } else {
        // Browser globals
       factory(root.jQuery,root.Handlebars);
    }
}(this, function ($, Handlebars){
	 Handlebars.registerHelper('compare', function(left, operator, right, options) {
	     if (arguments.length < 3) {
	       throw new Error('Handlerbars Helper "compare" needs 2 parameters');
	     }
	     var operators = {
	       '==':     function(l, r) {return l == r; },
	       '===':    function(l, r) {return l === r; },
	       '!=':     function(l, r) {return l != r; },
	       '!==':    function(l, r) {return l !== r; },
	       '<':      function(l, r) {return l < r; },
	       '>':      function(l, r) {return l > r; },
	       '<=':     function(l, r) {return l <= r; },
	       '>=':     function(l, r) {return l >= r; },
	       'typeof': function(l, r) {return typeof l == r; }
	     };

	     if (!operators[operator]) {
	       throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
	     }

	     var result = operators[operator](left, right);

	     if (result) {
	       return options.fn(this);
	     } else {
	       return options.inverse(this);
	     }
	 });
	var compiled = {};
	$.fn.handlebars = function(template, data) {
	    if (template instanceof jQuery) {
	        template = $(template).html();
	    }
	    // 优先在缓存中读取
	    
	    compiled[template] = compiled[template] || Handlebars.compile(template);
	    this.html(compiled[template](data));
	   
	    return this.each(function(){
	        var $this = $(this)
	        $this.html(compiled[template](data))
	    })
	    
	};
	$.fn.handlebarsRender = function(template, data) {
	    if (template instanceof jQuery) {
	        template = $(template).html();
	    }
	    // 优先在缓存中读取
	    if(compiled[template]){
	        return $(compiled[template](data));
	    }else{
	        compiled[template] = Handlebars.compile(template);
	        return $(compiled[template](data));
	    }
	    
	};
}))


