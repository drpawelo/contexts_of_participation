var tooltip=function(){
	var id = 'tt';
	var top = 10;
	var left = 10;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h,ww;
	var ie = document.all ? true : false;
	return{
		show:function(title,summary,w,ev){
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				t = document.createElement('div');
				t.setAttribute('id',id + 'top');
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				b = document.createElement('div');
				b.setAttribute('id',id + 'bot');
				tt.appendChild(t);
				tt.appendChild(c);
				tt.appendChild(b);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.pos;
				document.ontouchmove = this.pos;
			}
			tt.style.display = 'block';
			
			c.innerHTML = '<strong>' + URLDecode(title) + '</strong><br>' + URLDecode(summary);
			//c.innerHTML = '<strong>' + 'title title title title' + '</strong><br>' + 'summary summary summary summary summary summary summary summary summary summary summary ';
			tt.style.width = w ? w + 'px' : 'auto';
			tt.style.zIndex = 2;
			
			if(!w && ie){
				t.style.display = 'none';
				b.style.display = 'none';
				tt.style.width = tt.offsetWidth;
				t.style.display = 'block';
				b.style.display = 'block';
			}
			if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
			h = parseInt(tt.offsetHeight) + top;
			ww = w;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
			if (typeof ev != "undefined" && platform!='desktop') this.pos(ev);
		},
		pos:function(e){
			if (typeof tt == "undefined") return;
			var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY - 10;
			var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX + 10;
			u -= h;
			if (u<0) u = 0;
			l += left;
			if ((l+ww)>document.width){
				l = l - left*2 - ww;
				if (l<0) l=0;
			}
			tt.style.top = u + 'px';
			tt.style.left = l + 'px';
		},
		fade:function(d){
			if (typeof tt == "undefined") return;
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
			if (typeof tt == "undefined") return;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();

function URLDecode(encodedString) {
	var output = decodeURIComponent(encodedString.replace(/\+/g, '%20'));
	var binVal, thisString;
	var myregexp = /(%[^%]{2})/;
	while ((match = myregexp.exec(output)) != null
			 && match.length > 1
			 && match[1] != '') {
		binVal = parseInt(match[1].substr(1),16);
		thisString = String.fromCharCode(binVal);
		output = output.replace(match[1], thisString);
	}
	return output;
}