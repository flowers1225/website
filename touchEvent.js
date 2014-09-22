(function(window){
	var support = {touch : 'ontouchstart' in window},
		touchEventArr = support.touch ? ["touchstart","touchmove","touchend","touchcancel"] : ["mousedown","mousemove","mouseup",""];
	window.ake = {
		/**
		 * 将HTML字符串追加到dom中
		 */
		append : function(dom,htmlStr){
			if(!dom) return false;
			var d = document.createElement("div");
			d.innerHTML = htmlStr;
			var children = d.childNodes;
			while(children.length){
				dom.appendChild(children[0]);
			}
			return dom;
		},
		/**
		 * 是否含class
		 */
		hasClass : function(obj, cls) {
	        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	    },
		/**
		 * 添加CSS class
		 */
		addClass : function(obj, cls){
			if (!ake.hasClass(obj, cls)) obj.className += " " + cls;
		},
		/**
		 * 移除CSS class
		 */
		removeClass : function(obj, cls){
	  		if (ake.hasClass(obj, cls)) {
	            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	            obj.className = obj.className.replace(reg, ' ');
	        }
			return ake;
		},
		/**
		 * 存在class则移除，否则添加class
		 */
		toggleClass : function(obj,cls){
			ake.hasClass(obj, cls) ? ake.removeClass(obj, cls) : ake.addClass(obj, cls);
		},
		/**
		 * 与jquery的css相似
		 */
		css : function(obj, attr, value){
			switch (arguments.length) {
			case 2:
			    if (typeof arguments[1] == "object") {//批量设置属性
			        for (var i in attr) obj.style[i] = attr[i]
			    }else {// 读取属性值
			        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
			    }
			    break;
			case 3:
			    //设置属性
			    obj.style[attr] = value;
			    break;
			default:
			    return "";
			}
		},
		remove : function(obj){
			obj.parentNode.removeChild(obj);
		},
		/**
		 * 时间转换 isDate == true 返回日期 否则返回日期时间
		 */
		dateFormat : function(value,isDate){
			if(!value) return "";
			var date = new Date(value);
			var myFormat = function(val){
				return val < 10 ? ("0" + val) : val;
			};
			var dateStr = date.getFullYear()+"-"+myFormat(date.getMonth()+1)+"-"+myFormat(date.getDate());
			return isDate ? dateStr : (dateStr + " " +myFormat(date.getHours()) + ":" + myFormat(date.getMinutes()) + ":"
				+ myFormat(date.getSeconds()));
		},
		/**
		 * 扩展对象，有相同属性的覆盖，没有的添加
		 */
		extend : function(obj,extra){
			for(var i in extra){
				obj[i] = extra[i];
			}
			return obj;
		},
		/**
		 * 获取select中选中的项
		 */
		getSelectedOpt : function(el){
			var opts = el.options;
			for(var i=0;i<opts.length;i++){
				var item = opts[i];
				if(item.selected){
					return item;
				}
			}
			return null;
		},
		/**
		 * 给select设值
		 */
		setSelectValue : function(el,val){
			var opts = el.options;
			for(var i=0;i<opts.length;i++){
				var item = opts[i];
				if(item.value == val){
					item.selected = true;
					return item;
				}
			}
		},
		setSelHtml : function(sel,data,val,txt){
			var optTpl = "<option value='$v'>$t</option>",
				value = val ? val : "value",
				text = txt ? txt : "text",
				html = [];
			for(var i=0;i<data.length;i++){
				var item = data[i];
				html.push(optTpl.replace("$v",item[value]).replace("$t",item[text]));
			}
			sel.innerHTML = html.join("");
		},
		/* JS方式绑定click事件  */
		addclick : function(el,activeClass,clickFunc,longClickFunc){
			var eventStr = touchEventArr,inter = null,sP,isClick;
			el.addEventListener(eventStr[0],function(e){
				sP = getPage(e);
				isClick = true;
				if(activeClass) ake.addClass(this,activeClass);
				if(longClickFunc){
					var self = this;
					//long click event 1s
					inter = window.setTimeout(function(){
						inter = null;
						isClick = false;
						longClickFunc.call(self);
					},700);
				}
			});
			el.addEventListener(eventStr[1],function(e){
				if(!isClick) return;
				var mP = getPage(e);
				if((Math.abs(mP.x - sP.x)>5 || Math.abs(mP.y - sP.y)>5)){
					if(inter) {
						window.clearTimeout(inter);
						inter = null;
					}
					isClick = false;
				}
			});
			function endOrCancel(){
				if(activeClass) ake.removeClass(this,activeClass);
				if(isClick && clickFunc) clickFunc.call(this);
				if(inter) {
					window.clearTimeout(inter);
					inter = null;
				}
			}
			el.addEventListener(eventStr[2],endOrCancel);
			eventStr[3] && el.addEventListener(eventStr[3],endOrCancel);
		},
		/* HTML方式绑定click事件 */
		onclick : function(activeClass){
			var eventStr = touchEventArr,
				el = event.currentTarget,
				clickFuncStr = el.getAttribute("onclick"),
				isClick,sp;
			el.removeAttribute("onclick");
			el.removeAttribute("ontouchstart");
			function start(){
				if(activeClass) ake.addClass(el,activeClass);
				sP = getPage(event);
				isClick = true;
			}
			el.addEventListener(eventStr[0],start);
			el.addEventListener(eventStr[1],function(e){
				if(!isClick) return;
				var mP = getPage(e);
				if((Math.abs(mP.x - sP.x)>5 || Math.abs(mP.y - sP.y)>5)){
					isClick = false;
				}
			});
			function endOrCancel(e){
				if(activeClass) ake.removeClass(this,activeClass);
				if(isClick && clickFuncStr) eval(clickFuncStr);
			}
			el.addEventListener(eventStr[2],endOrCancel);
			eventStr[3] && el.addEventListener(eventStr[3],endOrCancel);
			start();
		},
		/* 判断对象是否没有属性 
			true 没有属性 
			false 有属性 
		*/
		isObjEmpty : function(obj){
			for(var i in obj) return false;
			return true;
		}
	};
	function getPage (e) {
		var touch = support.touch ? e.changedTouches[0] : e;
		return {
			x : touch.pageX,
			y : touch.pageY
		};
	}
})(window);
/* 全局方法 变量*/
function $a(id){
	return document.getElementById(id);
}
function Init(){
	if(window.navigator.platform == "Win32")
		document.body.style.fontSize = window.localStorage["defaultfontsize"];
}
function ConPop(id,url,x,y){
	var s = window.getComputedStyle($a(id),null);
	uexWindow.openPopover(id,"0",url,"",parseInt(x),parseInt(y),parseInt(s.width),parseInt(s.height),parseInt(s.fontSize),"0");
}
function ResizePage(id,x,y){
	var s = window.getComputedStyle($a(id),null);
	uexWindow.setPopoverFrame(id,parseInt(x),parseInt(y),parseInt(s.width),parseInt(s.height));	
}
function MyAlert(mes){
	uexWindow.toast(0,5,mes,2500);
}
var Loader = {
	/* 开始加载 */
	s : function(mes){
		var mask = $a("modalmask");
		if(mask) mask.style.display = "";
		uexWindow.toast(1,5,mes,0);
	},
	/* 结束加载 */
	e : function(){
		var mask = $a("modalmask");
		if(mask) mask.style.display = "none";
		uexWindow.closeToast();
	}
};
