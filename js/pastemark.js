var base_url = "http://pastemark.ru/";

var template = {
	"id":function(id, text)
	{
		document.getElementById(decodeURI(id)).value = decodeURI(text) + document.getElementById(decodeURI(id)).value;
	},
	"name":function(name, text){
		var fields = document.getElementsByName(name);
		for(var i = 0; i < fields.length; i++)
		{
			fields[i].value = decodeURI(text) + fields[i].value;
		}
	},
	"click":function(dummy, text){
		var fields = [];
		var textareas = document.getElementsByTagName("textarea");
		var inputs = document.getElementsByTagName("input");
		
		for(var i = 0; i < textareas.length; i++)
		{
			fields.push(textareas[i]);
		};
		
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].type == "text" || inputs[i].type == "password")
			{
				fields.push(inputs[i]);
			}
		};
		
		// Set up body
		var body_cursor = document.body.style.cursor;
		document.body.style.cursor = "crosshair";
		
		var body_onclick = document.body.onclick;
		document.body.onclick = function()
		{
			// Restore body
			document.body.style.cursor = body_cursor;
			document.body.onclick = body_onclick;
			
			// Restore other fields
			for(var i = 0; i < fields.length; i++)
			{
				fields[i].style.cursor = fields[i].style_cursor_pm_save;
				fields[i].style_cursor_pm_save = undefined;
				
				fields[i].onclick = fields[i].onclick_pm_save;
				fields[i].onclick_pm_save = undefined;
			}
		};
		
		for(var i = 0; i < fields.length; i++)
		{
			fields[i].style_cursor_pm_save = fields[i].style.cursor;
			fields[i].style.cursor = "crosshair";
			
			fields[i].onclick_pm_save = fields[i].onclick;
			fields[i].onclick = function()
			{
				// Paste text
				this.value = decodeURI(text) + this.value;
				
				// Restore body
				document.body.style.cursor = body_cursor;
				document.body.onclick = body_onclick;
				
				// Restore other fields
				for(var i = 0; i < fields.length; i++)
				{
					fields[i].style.cursor = fields[i].style_cursor_pm_save;
					fields[i].style_cursor_pm_save = undefined;
					
					fields[i].onclick = fields[i].onclick_pm_save;
					fields[i].onclick_pm_save = undefined;
				}
			}
		}
	}
};

var pm_fast = function(){
		var fields = [];
		var textareas = document.getElementsByTagName("textarea");
		var inputs = document.getElementsByTagName("input");
		
		for(var i = 0; i < textareas.length; i++)
		{
			fields.push(textareas[i]);
		};
		
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].type == "text" || inputs[i].type == "password")
			{
				fields.push(inputs[i]);
			}
		};
		
		// Set up body
		var body_cursor = document.body.style.cursor;
		document.body.style.cursor = "crosshair";
		
		var body_onclick = document.body.onclick;
		document.body.onclick = function()
		{
			// Restore body
			document.body.style.cursor = body_cursor;
			document.body.onclick = body_onclick;
			
			// Restore other fields
			for(var i = 0; i < fields.length; i++)
			{
				fields[i].style.cursor = fields[i].style_cursor_pm_save;
				fields[i].style_cursor_pm_save = undefined;
				
				fields[i].onclick = fields[i].onclick_pm_save;
				fields[i].onclick_pm_save = undefined;
			}
		};
		
		for(var i = 0; i < fields.length; i++)
		{
			fields[i].style_cursor_pm_save = fields[i].style.cursor;
			fields[i].style.cursor = "crosshair";
			
			fields[i].onclick_pm_save = fields[i].onclick;
			fields[i].onclick = function()
			{
				//
				// Analyze target
				//
				var idby = "click";
				var target = "";
				if(this.id != undefined)
				{
					idby = "id";
					target = encodeURIComponent(this.id);
				}
				else if(this.name != undefined)
				{
					idby = "name";
					target = encodeURIComponent(this.name);
				}
				
				var snippet = encodeURIComponent(this.value);
				
				titles = document.getElementsByTagName("h2");
				if(titles.length == 0)
				{
					titles = document.getElementsByTagName("h1");
					if(titles.length == 0)
					{
						titles = document.getElementsByTagName("title");
					}
				}
				
				var title = "";
				if(titles.length != 0)
				{
					title = encodeURIComponent(titles[0].innerHTML);
				}
				
				var url = base_url + "?title="+title+"&idby="+idby+"&target="+target+"&snippet="+snippet;
				window.open(url);
				// Restore body
				document.body.style.cursor = body_cursor;
				document.body.onclick = body_onclick;
				
				// Restore other fields
				for(var i = 0; i < fields.length; i++)
				{
					fields[i].style.cursor = fields[i].style_cursor_pm_save;
					fields[i].style_cursor_pm_save = undefined;
					
					fields[i].onclick = fields[i].onclick_pm_save;
					fields[i].onclick_pm_save = undefined;
				}
			}
		}
	}

function make_pastemark()
{
	$(".pm-error").hide();
	$("#pm-ready-wrapper").hide();
	
	// Collect & validate data
	var title = $("#pm-title").val();
	var idby = $("#pm-form input[name=pm-id]:checked").val();
	var target = $("#pm-target").val();
	var snippet = $("#pm-snippet").val();
	
	var error = false;
	
	if(title == "")
	{
		$("#pm-error-title").show().text("Please enter bookmarklet title");
		error = true;
	}
	
	if(idby == null)
	{
		$("#pm-error-id").show().text("Please choose one");
		error = true;
	}
	
	if(idby != null && idby != "click" && target == "")
	{
		$("#pm-error-target").show().text("Please specify target field "+idby);
		error = true;
	}

	if(snippet == "")
	{
		$("#pm-error-snippet").show().text("Please enter text to be pasted");
		error = true;
	}
	
	if(error)
	{
		return;
	}
	
	// Optimize code to one line
	var code = template[idby].toString().replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*\*\//, "").replace(/\n/g, " ").replace(/\s+/g, " ");
	var link = "javascript:void("+code+"('"+encodeURI(target)+"', '"+encodeURI(snippet)+"'))";
	
	$("#pm-ready").text(title).attr("href", encodeURI(link));
	$("#pm-ready-wrapper").show().scrollToMe();
}

$(document).ready(function(){
	// Enable navigation
	var menu_items = $("#topmenu a");
	menu_items.click(function(){
		var self = $(this);
		var target = self.attr("href")
		
		if(target.substr(0,1) != "#")
		{
			return true;
		}
		
		if(self.hasClass("selected"))
		{
			return false;
		}
		
		menu_items.each(function(){
			var self = $(this);
			self.removeClass("selected");
			var target = self.attr("href");
			if(target.substr(0,1) == "#")
			{
				$(target).hide();
			}
		});
		
		self.addClass("selected");
		$(target).show();
		
		return true;
	});
	
	if(document.location.hash != "")
	{
		var target = document.location.hash;
		menu_items.each(function(){
			var self = $(this);
			if(self.attr("href") == target)
			{
				self.addClass("selected");
				$(self.attr("href")).show();
			}
			else
			{
				self.removeClass("selected");
				$(self.attr("href")).hide();
			}
		});
	}
	
	$("#pm-form").submit(function(){
		make_pastemark();
		return false;
	});
	$("#pm-form input[type=submit]").removeAttr("disabled");
	
	$("#pm-form input[name=pm-id]").change(function(){
		if($("#pm-form input[name=pm-id]:checked").val() != "click")
		{
			$("#pm-target-wrapper").show();
		}
		else
		{
			$("#pm-target-wrapper").hide();
		}
	});
	
	$("#pm-form input[type=reset]").click(function(){
		$(".pm-error").hide();
		$("#pm-target-wrapper").hide();
		$("#pm-ready-wrapper").hide();
	});
	
	// Fill fields from request
	var params = $.getUrlVars();
	if(params["idby"] != undefined)
	{
		if($("#pm-id-"+params["idby"]).size() != 0)
		{
			$("#pm-id-"+params["idby"]).click();
			$("#pm-id-"+params["idby"]).change();
		}
		
		if(params["title"] != undefined)
		{
			$("#pm-title").val(params["title"]);
		}
		
		if(params["target"] != undefined)
		{
			$("#pm-target").val(params["target"]);
		}
		
		if(params["snippet"] != undefined)
		{
			$("#pm-snippet").val(params["snippet"]);
		}
	}
	
	// Attach Pastemark Fast! links
	var code = pm_fast.toString().replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*\*\//, "").replace(/\n/g, " ").replace(/\s+/g, " ");
	var link = "javascript:void("+code+"())";
	
	$(".fast-tool").attr("href", encodeURI(link));
});

//
// Suggest better language
//
$(document).ready(function(){
	var curr_lang = "en";
	var langs = ["ru", "en"];
	langs.splice(langs.indexOf(curr_lang));
	$("#lang a").click(function(){
		$(this).attr("href", $(this).attr("href")+document.location.hash);
	});
	
	$.ajax({
		url: "http://ajaxhttpheaders.appspot.com",
		dataType: 'jsonp',
		success: function(headers) {
			var accepted = headers['Accept-Language'].split(",");
			for(var variant in accepted)
			{
				accepted[variant] = accepted[variant].split(";")[0];
				
				for(var candidat in langs)
				{
					var regexp = new RegExp(langs[candidat], "i");
					if(regexp.test(accepted[variant]))
					{
						var lang_link = $("#lang ."+langs[candidat]);
						var hint = $("<div id=\"lang-hint\">"+lang_link.attr("alt")+"&nbsp;<span><!--[if !IE]>-->&#x2934;<!--<![endif]--><!--[if IE]>&#x2191;<![endif]--></span></div>");
						hint.hide();
						hint.appendTo($("#lang"));
						hint.css("top", String(lang_link.offset().top+lang_link.height())+"px");
						hint.css("left", String(lang_link.offset().left+lang_link.width()/2-hint.width()+3)+"px");
						
						// Show
						lang_link.addClass("suggested");
						hint.fadeIn();
					}
				}
			}
		}
	});
});

//
// Based on snippet from
// http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
//

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = [];
    if(window.location.href.lastIndexOf('#') != -1)
    {
    	hashes = window.location.href.slice(window.location.href.indexOf('?') + 1, window.location.href.lastIndexOf('#')).split('&');
    }
    else
    {
		hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    }
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      hash[0] = decodeURIComponent(hash[0]);
      hash[1] = decodeURIComponent(hash[1]);
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

// Begin scrollToMe.js
/**
 * @author rootadmin
 */
jQuery.fn.scrollToMe = function(){
	$('html,body').animate({
		scrollTo: this.offset().top
	}, 'slow');
}
// End scrollToMe.js
