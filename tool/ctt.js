// JavaScript Document
var platform;
var small = false;
var initAngles = [Math.PI * 4/3,0, Math.PI * 4/3, 0];
var wheelAngles = [Math.PI * 4/3,0, Math.PI * 4/3, 0];
var wheelRotateInfo = { id:-1, startAngle:0 };
var wheels = [];
var glossaryActive = false;
var settingsPanel;
var crect = { x:0, y:0, w:700, h:700 };
var glossary = [];
var updating = false;
var touchactive = false;

function hitarea(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.update = function(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	this.hit = function(x, y){
		return (x>this.x && x<(this.x + this.w) && y>this.y && y<(this.y + this.h));
	}
}

function settingsPanelData(){
	var size = (small) ? crect.w : 700;	
	var sizeH = (small) ? crect.h : 350;	
	this.w = Math.floor(size * 0.7);
	this.h = Math.floor(sizeH);
	this.corner = (small) ? Math.min(parseInt((6/310)*crect.w),12) : 12;
	this.inputH = (small) ? Math.min(parseInt((20/310)*crect.w),22) : 22;
	if (platform == 'iPad'){
		this.inputH = 30;
		this.h = this.inputH * 1.6 * 9.3;
	}else if (small){
		this.h = this.inputH * 1.6 * 9.3;
	}
	var canvas = $('#ctt'); 
	this.x = Math.floor((crect.w - this.w)/2);	
	this.y = Math.floor((crect.h - this.h)/2);
	this.padding = (small) ? 4 : 10;	
	this.sliderID = -1;
	this.radioID = 0;
	this.active = false;
	this.available = (typeof(Storage)=="undefined" || typeof localStorage=="undefined") ? false : true;
	this.sliders = [];
	this.radios = [];
	this.closeButton = new hitarea( this.x+this.w-this.inputH*1.3, this.y-this.inputH*0.8, this.inputH*1.6, this.inputH*1.6 );
	this.okButton = new hitarea(this.x+this.w-this.inputH*1.6, this.y+this.h-this.inputH*1.4, this.inputH*2.4, this.inputH*2.4 );
	this.resetButton = new hitarea(0,0,1,1);
	
	this.draw = function(){
		var canvas = $('#ctt'); 
		if (canvas[0].getContext){
			var ctx = canvas[0].getContext('2d');
			ctx.drawRoundedRect(this.x, this.y, this.w, this.h, this.corner, 'rgba(60,60,60,0.7)', '');
			for(i in  this.sliders){
				this.sliders[i].value = parseInt(this.radios[this.radioID].col.substr(1 + i*2, 2), 16);
				this.sliders[i].draw(ctx);
			}
			for(i in  this.radios)  this.radios[i].draw(ctx);
			ctx.strokeStyle = '#FFFFFF';
			ctx.lineWidth = 3; 
			ctx.drawCircle('#AAAAAA',  this.inputH*0.8,  this.x +  this.w- this.inputH/2,  this.y, true);
			ctx.font = (small) ? "bold " + Math.min(parseInt((20/310)*crect.w),24) + "px Arial" : "bold 24px Arial";
			if (platform == 'iPad') ctx.font = "bold 34px Arial";
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText("X", this.x+this.w-this.inputH*0.87, this.y+this.inputH*0.4);
			ctx.drawCircle('#666666', this.inputH*1.2, this.x+this.w-this.inputH/2, this.y+this.h-this.inputH/2, true);
			ctx.fillStyle = '#00FF00';
			ctx.font = (small) ? "bold " + Math.min(parseInt((40/310)*crect.w),50) + "px Arial" : "bold 50px Arial";
			if (platform == 'iPad') ctx.font = "bold 65px Arial";
			ctx.fillText("✔", this.x+this.w-this.inputH*1.4, this.y+this.h+this.inputH*0.4);
			this.drawResetButton(ctx);
		}
	}
	
	this.checkButtons = function(x, y, m){
		var down = (typeof m == "undefined") ? true : false;
		
		if (down) setCursor("auto");
		
		for(i in this.sliders){
			if (this.sliders[i].hitarea.hit(x,y)){
				//console.log('slider selected %d', i);
				if (down){
					this.sliderID = i;
				}else{
					setCursor('pointer');
				}
				return;
			}
		}
		for(i in this.radios){
			if (this.radios[i].hitarea.hit(x,y)){
				if (down){
					this.newRadioSelected(i);
				}else{
					setCursor('pointer');
				}
				return;
			}
		}
		if (this.okButton.hit(x, y)){
			if (down){
				updateWheelColours();
				this.closePanel();
			}else{
				setCursor('pointer');
			}
			return;			
		}
		if (this.closeButton.hit(x, y)){
			if (down){
				this.closePanel();
			}else{
				setCursor('pointer');
			}
			return;		
		}
		if (this.resetButton.hit(x,y)){
			if (down){
				var cols = ['#568DC9', '#F3663C', '#8C8DBA', '#6CC27A', '#7674A8', '#15196F'];
				for(i in this.radios){
					var r = parseInt(cols[i].substr(1, 2), 16);
					var g = parseInt(cols[i].substr(3, 2), 16);
					var b = parseInt(cols[i].substr(5, 2), 16);
					this.radios[i].updateColour( r, g, b );
				}
			}else{
				setCursor('pointer');
			}
			return;
		}
		if (!down) setCursor("auto");
	}
	
	this.closePanel = function(){		
		this.sliderID = -1;
		this.active = false;
		var size = (small) ? crect.w : 700;
		var sizeH = (small) ? parseInt((400/310) * crect.w) : 700;
		var canvas = $('#ctt'); 
		if (canvas[0].getContext){
			var ctx = canvas[0].getContext('2d');
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(0,0,size,sizeH);
		}
		drawButton("SETTINGS", 0, 0.86, false);
		drawButton("GLOSSARY", 0.82, 0.86, false);
		drawTool();
	}
	
	this.newRadioSelected = function(id){
		for(i in this.radios){
			this.radios[i].selected = (i==id);
			this.radios[i].update();
		}
		var r = parseInt(this.radios[id].col.substr(1, 2), 16);
		var g = parseInt(this.radios[id].col.substr(3, 2), 16);
		var b = parseInt(this.radios[id].col.substr(5, 2), 16);
		this.sliders[0].setValue(r);
		this.sliders[1].setValue(g);
		this.sliders[2].setValue(b);
		this.radioID = id;		
	}
	
	this.drawResetButton = function(ctx){
		var x = this.x + this.padding;
		var w = (small) ? Math.min(parseInt((80/310) * crect.w), 100) : 100;
		var h = w / 4;
		var y = this.y + this.h - this.padding*2 - h;
		ctx.drawRoundedRect( x, y, w, h, this.corner, '#DDDDDD', '#FFFFFF' );
		this.resetButton.update( x, y, w, h );
		ctx.fillStyle = '#000000';
		if (small){
			ctx.font = "normal " + Math.min(parseInt((13/310) * crect.w),18) + "px Arial";
		}else{
			ctx.font = "normal 18px Arial";
		}
		var label = "RESET";
		var tw = ctx.measureText(label).width;
		var tx = x + (w - tw)/2;
		ctx.fillText(label, tx, y+h*0.8);
	}
}

function slider(label, x, y, w, h, range, val){
	this.label = label;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.minX = x+h/2;
	this.maxX = x+(w*0.8)-h/2;
	this.range = range;
	this.value = val;
	this.hitarea = new hitarea(0,0,1,1);
	this.draw = function(ctx){
		//Draw all the slider using the current value	
		ctx.drawRoundedRect(this.x, this.y, this.w*0.8, this.h, Math.floor(this.h/2), '#AAAAAA', '');
		var valX = this.value/this.range * (this.maxX-this.minX) + this.minX;
		//console.log('slider draw valX=%d range=%d [%d>>%d] %d', valX, this.range, this.minX, this.maxX, this.h);
		ctx.drawCircle('#FFFFFF', this.h*0.5, valX, this.y+this.h/2);
		this.hitarea.update( valX - this.h*0.5, this.y, this.h, this.h); 
		ctx.fillStyle = '#FFFFFF';
		ctx.font = (small) ? Math.min(parseInt((12/310) * crect.w), 16) + "px Arial" : "16px Arial";
		ctx.fillText(this.label, this.x+this.w*0.82, this.y+this.h*0.8); 	
	}
	this.update = function(x){
		//Draw the slider without updating the text based on the x value passed or a new value
		var canvas = $('canvas');
		var ctx = canvas[0].getContext('2d');
		ctx.drawRoundedRect(this.x, this.y, this.w*0.8, this.h, Math.floor(this.h/2), '#AAAAAA', '');
		if (x<this.minX) x = this.minX;
		if (x>this.maxX) x = this.maxX;
		this.value = ((x-this.minX)/(this.maxX-this.minX)) * this.range;
		//console.log('x:%d [%d>>%d] %d', x, this.minX, this.maxX, this.value);
		ctx.drawCircle('#FFFFFF', this.h*0.5, x, this.y+this.h/2);
		this.hitarea.update( x - this.h*0.5, this.y, this.h, this.h); 
	}
	this.setValue = function(val){
		this.value = val;
		var valX = this.value/this.range * (this.maxX-this.minX) + this.minX;
		this.update(valX);
	}
}

function radio(label, x, y, w, h, selected, col){
	this.label = label;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.selected = selected;
	this.col = col;
	this.hitarea = new hitarea(0, 0, 1, 1);
	
	this.draw = function(ctx){
		ctx.drawCircle('#FFFFFF', this.h*0.5, this.x+this.h/2, this.y+this.h/2);
		if (this.selected){
			ctx.drawCircle('#00FF00', this.h*0.4, this.x+this.h/2, this.y+this.h/2);
		}
		this.hitarea.update(x, y, h, h); 
		ctx.fillStyle = this.col;
		ctx.fillRect(this.x + this.w/2, this.y, this.w/2, this.h);
		if (this.selected){
			ctx.strokeStyle = '#FFFFFF';
			ctx.lineWidth = 2;
			ctx.strokeRect(this.x + this.w/2, this.y, this.w/2, this.h);
		}
		ctx.fillStyle = '#FFFFFF';
		ctx.font = (small) ? Math.min(parseInt((12/310) * crect.w), 16) + "px Arial" : "16px Arial";
		ctx.fillText(this.label, this.x + this.h*1.5, this.y+this.h*0.8);
	}
	
	this.update = function(selected){
		var canvas = $('canvas');
		var ctx = canvas[0].getContext('2d');
		ctx.drawCircle('#FFFFFF', this.h*0.5, this.x+this.h/2, this.y+this.h/2);
		if (this.selected){
			ctx.drawCircle('#00FF00', this.h*0.4, this.x+this.h/2, this.y+this.h/2);
		}
		ctx.fillStyle = this.col;
		ctx.fillRect(this.x + this.w/2, this.y, this.w/2, this.h);
		if (this.selected){
			ctx.strokeStyle = '#FFFFFF';
			ctx.lineWidth = 2;
			ctx.strokeRect(this.x + this.w/2, this.y, this.w/2, this.h);
		}		
	}
	
	this.updateColour = function(r,g,b){
		var canvas = $('canvas');
		var ctx = canvas[0].getContext('2d');
		this.col = setColour(r,g,b);
		//console.log('updateColour %s: %d,%d,%d', this.col, r, g, b);
		ctx.fillStyle = this.col;
		ctx.fillRect(this.x + this.w/2, this.y, this.w/2, this.h);
		if (this.selected){
			ctx.strokeStyle = '#FFFFFF';
			ctx.lineWidth = 2;
			ctx.strokeRect(this.x + this.w/2, this.y, this.w/2, this.h);
		}
	}
}

function setColour(r, g, b){
	var rs = Math.floor(r).toString(16);
	var gs = Math.floor(g).toString(16);
	var bs = Math.floor(b).toString(16);
	while(rs.length<2) rs = '0' + rs;
	while(gs.length<2) gs = '0' + gs;
	while(bs.length<2) bs = '0' + bs;
	return '#' + rs + gs + bs;
}

function initTool(){  
	var canvas = $('#ctt'); 
	var logo = $('#logoholder');
	var logoimg = $('#logo');
	
	for(var i=1; i<=5; i++){
		var wheel = $('#wheel' + i);
		wheels.push(wheel);
	}
		
	if (navigator.platform=='iPad'){
		platform = 'iPad';
		canvas[0].addEventListener('touchstart', canvasTouchStart, false);
		canvas[0].addEventListener('touchmove', canvasTouchMove, false);
		canvas[0].addEventListener('touchend',   canvasTouchEnd, false);
		window.onorientationchange = detectIPadOrientation;
		detectIPadOrientation();
	}else if (navigator.platform=='iPhone' || (navigator.platform.toLowerCase().indexOf("arm") > -1)){
		small = true;
		platform = (navigator.platform=='iPhone') ? 'iPhone' : 'Android';
		if (platform == 'Android'){
			//alert($(window).width() + ", " + $(window).height());
			if ($(window).width()<700 || $(window).height()<700){
				if ($(window).width()<$(window).height()){
					crect.w = parseInt($(window).width() * 0.95);
					crect.h = parseInt(crect.w*1.16);
				}else{
					crect.w = parseInt($(window).height() * 0.95);
					crect.h = parseInt(crect.w*1.16);				
				}
			}else{
				small = false;
			}
		}else{
			crect.w = 310;
			crect.h = 360;
		}
		canvas[0].width = crect.w;
		canvas[0].height = crect.h;
		for(var i=0; i<wheels.length; i++){
			wheels[i][0].width = crect.w;
			wheels[i][0].height = crect.w;
		}
		logoimg.css('width', Math.min(parseInt((122/310) * crect.w), 172));
		logoimg.css('height', Math.min(parseInt((41/310) * crect.w), 57));
		
		canvas[0].addEventListener('touchstart', canvasTouchStart, false);
		canvas[0].addEventListener('touchmove', canvasTouchMove, false);
		canvas[0].addEventListener('touchend',   canvasTouchEnd, false);
		window.onorientationchange = detectIPhoneOrientation;
		detectIPhoneOrientation();
	}else{
		//console.log("initTool browser.width %d (%d, %d, %d, %d)", $(window).width(), canvas.css('left'), canvas.css('top'), canvas[0].width, canvas[0].height );
		$(window).resize(function() {
			var canvas = $('#ctt'); 
			var logo = $('#logoholder');
			var left = ($(window).width() - canvas[0].width)/2;
			var top = ($(window).height() - canvas[0].height)/2;
			canvas.css('left', left);
			canvas.css('top', top);
			logo.css('left', left);
			logo.css('top', top);
		});
		//canvas[0].style.left = ($(window).width() - canvas[0].width)/2 + 'px';
		var left = ($(window).width() - canvas[0].width)/2;
		var top = ($(window).height() - canvas[0].height)/2;
		canvas.css('left', left);
		canvas.css('top', top);
		logo.css('left', left);
		logo.css('top', top);
		canvas[0].addEventListener('mousedown', canvasMouseDown, false);
		canvas[0].addEventListener('mousemove', canvasMouseMove, false);
		canvas[0].addEventListener('mouseup',   canvasMouseUp, false);
		platform = 'desktop';
	}

	//Settings panel stuff
	settingsPanel = new settingsPanelData();
	settingsPanel.sliders.push(new slider("Red",settingsPanel.x+settingsPanel.padding,settingsPanel.y+settingsPanel.padding,settingsPanel.w-settingsPanel.padding*2,settingsPanel.inputH,255,0));
	settingsPanel.sliders.push(new slider("Green",settingsPanel.x+settingsPanel.padding,settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4),settingsPanel.w-settingsPanel.padding*2,settingsPanel.inputH,255,0));
	settingsPanel.sliders.push(new slider("Blue",settingsPanel.x+settingsPanel.padding,settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4)*2,settingsPanel.w-settingsPanel.padding*2,settingsPanel.inputH,255,0));	
	settingsPanel.radios.push(new radio("National", settingsPanel.x+settingsPanel.padding, settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4)*3, settingsPanel.w-settingsPanel.padding*2, settingsPanel.inputH, settingsPanel.radioID==0, wheelColours[0]));	 
	settingsPanel.radios.push(new radio("Social", settingsPanel.x+settingsPanel.padding, settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4)*4, settingsPanel.w-settingsPanel.padding*2, settingsPanel.inputH, settingsPanel.radioID==1, wheelColours[1]));	 
	settingsPanel.radios.push(new radio("Local", settingsPanel.x+settingsPanel.padding,settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4)*5, settingsPanel.w-settingsPanel.padding*2, settingsPanel.inputH, settingsPanel.radioID==2, wheelColours[2]));	 
	settingsPanel.radios.push(new radio("Individual", settingsPanel.x+settingsPanel.padding,settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4)*6, settingsPanel.w-settingsPanel.padding*2, settingsPanel.inputH, settingsPanel.radioID==3, wheelColours[3]));	 
	settingsPanel.radios.push(new radio("Participation", settingsPanel.x+settingsPanel.padding, settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4)*7, settingsPanel.w-settingsPanel.padding*2, settingsPanel.inputH, settingsPanel.radioID==4, wheelColours[4]));	
	settingsPanel.radios.push(new radio("Text", settingsPanel.x+settingsPanel.padding, settingsPanel.y+settingsPanel.padding+(settingsPanel.inputH*1.4)*8, settingsPanel.w-settingsPanel.padding*2, settingsPanel.inputH, settingsPanel.radioID==5, wheelColours[5]));	

	initWheels();
	drawTool(); 
	if (settingsPanel.available) drawButton("SETTINGS", 0, 0.86, false);
	drawButton("GLOSSARY", 0.82, 0.86, glossaryActive);
} 

function drawButton( label, x, y, selected ){
	var canvas = $('#ctt'); 
	if (canvas[0].getContext){
		var size = (small) ? crect.w : 700;
		var ctx = canvas[0].getContext('2d');
		
		var w = (small) ? parseInt((100/310)*crect.w) : 124;
		var h = (small) ? parseInt((48/310)*crect.w) : 59;
		var corner = (small) ? parseInt((10/310)*crect.w) : 12;
		var fill = (selected) ? '#FFFFAA' : '#FFFFFF';
		var stroke = '#000000';

		x *= size;
		y *= size;
		if (small){
			y = parseInt((350/310) * crect.w) - h;
			if (x>parseInt((100/310) * crect.w)) x-=parseInt((45/310) * crect.w);
		}
		
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect( x-2, y-2, w+4, h+4 );
		ctx.lineWidth = (selected) ? 3 : 1;
		ctx.drawRoundedRect( x, y, w, h, corner, fill, stroke );
		
		ctx.fillStyle = '#000000';
		if (small){
			ctx.font = "normal " + Math.min(parseInt((14/310) * crect.w), 18) + "px Arial";
		}else{
			ctx.font = "normal 18px Arial";
		}
		var tw = ctx.measureText(label).width;
		var tx = x + (w - tw)/2;
		ctx.fillText(label,tx,y+h-corner*2);
	}
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

	//console.log("relMouseCoords (" + canvasX + ", " + canvasY + ") (" + event.pageX + ", " + event.pageY + ")");
	
    return {x:canvasX, y:canvasY}
}

HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function getWheelIDByXY(x,y){
	var centre = (small) ? (crect.w/2) : 350;
	var radius = (small) ? parseInt(centre * 0.95) : 330;
	x -= centre;
	y -= centre;
	var mag = Math.sqrt(x*x + y*y)/radius;
	var res = -1;
	if (mag<1.0){
		if (mag>0.8){
			res = 0;
		}else if (mag>0.6){
			res = 1;
		}else if (mag>0.4){
			res = 2;
		}else if (mag>0.2){
			res = 3;
		}else{
			res = 4;
		}
	}
	return res;
}

function getTheta( x, y ){
	var centre = (small) ? (crect.w/2) : 350;
	x -= centre;
	y -= centre;
	return Math.atan2(y, x);
}

function canvasMouseDown(ev){
	var canvas = $('#ctt'); 
	var pos = canvas[0].relMouseCoords(ev);
	if (settingsPanel.active){
		settingsPanel.checkButtons(pos.x, pos.y);
		tooltip.hide();
		setCursor('pointer');
		//console.log('canvasMouseDown (%d, %d)=%d', pos.x, pos.y, settingsPanel.sliderID);
	}else{
		wheelRotateInfo.id = getWheelIDByXY(pos.x, pos.y);	
		if (wheelRotateInfo.id != -1){
			wheelRotateInfo.startAngle = wheelAngles[wheelRotateInfo.id];
			wheelRotateInfo.userAngle = getTheta(pos.x, pos.y);	
			setCursor('pointer');
		}else{
			checkButtons(pos.x, pos.y);
			if (glossaryActive || settingsPanel.active) tooltip.hide();
			setCursor("auto");
		}
		//console.log('canvasMouseDown (%d, %d)=%d %4.2f', pos.x, pos.y, wheelRotateInfo.id, wheelRotateInfo.startAngle);
	}
}

function canvasMouseUp(ev){
	//console.log('canvasMouseUp');
	wheelRotateInfo.id = -1;
	settingsPanel.sliderID = -1;
}

function canvasMouseMove(ev){
	var canvas = $('#ctt'); 
	var pos = canvas[0].relMouseCoords(ev);
	mouseMoveHandler(pos, ev);
}

function setCursor( str ){
	if (platform != 'desktop') return;
	$('canvas').css("cursor", str);
}

function handleGlossary(pos, ev){
	var wheelID = getWheelIDByXY(pos.x, pos.y);
	if (wheelID==-1){
		tooltip.hide();
		setCursor("auto");
	}else{
		setCursor('pointer');
		var theta = getTheta(pos.x, pos.y) - wheelAngles[wheelID];
		if (wheelID==0 || wheelID==2){
			theta += Math.PI*(0.5 + 0.66);
		}else if(wheelID==1){
			theta -= Math.PI*0.75;
		}else if (wheelID==4){
			theta = 0;
		}else{
			theta -= Math.PI*0.5;
		}
		while (theta<0) theta += Math.PI * 2;
		var itemID = Math.floor( (theta/(Math.PI*2)) * glossary[wheelID].length );
		//console.log("handleGlossary wheelID %d itemID %d", wheelID, itemID);
		tooltip.show(glossary[wheelID][itemID].title, glossary[wheelID][itemID].text, 200, ev);
	}	
}

function mouseMoveHandler(pos, ev){
	if (glossaryActive){
		handleGlossary(pos, ev);
	}else if (wheelRotateInfo.id!=-1){
		setCursor('pointer');
		var theta = getTheta(pos.x, pos.y) - wheelRotateInfo.userAngle;	
		wheelAngles[wheelRotateInfo.id] = wheelRotateInfo.startAngle + theta;
		drawTool();
	}else if (settingsPanel.sliderID!=-1){
		setCursor('pointer');
		//console.log('canvasMouseMove id:%d x:%d', settingsPanel.sliderID, pos.x);
		settingsPanel.sliders[settingsPanel.sliderID].update(pos.x);	
		settingsPanel.radios[settingsPanel.radioID].updateColour(settingsPanel.sliders[0].value, settingsPanel.sliders[1].value, settingsPanel.sliders[2].value);	
	}else if (settingsPanel.active){
		tooltip.hide();
		settingsPanel.checkButtons(pos.x, pos.y, false);
	}else if (platform == 'desktop'){
		if (checkButton(0, 0.86, pos.x, pos.y)){
			setCursor('pointer');
			tooltip.show('Settings', 'Click to adjust the colours of the tool', 200);
		}else if (checkButton(0.82, 0.86, pos.x, pos.y)){
			var input = (platform=='desktop') ? 'mouse' : 'finger';
			setCursor('pointer');
			tooltip.show('Glossary', 'Click and move your ' + input + ' over the tool to see details of each item');
		}else if (getWheelIDByXY(pos.x, pos.y)!=-1){
			setCursor('pointer');
		}else{
			setCursor("auto");
			tooltip.hide();
		}
	}
}

function canvasTouchStart(ev){
	ev.preventDefault();
	touchactive = true;
	if (ev.touches.length == 1) {
		var touch = ev.touches[0];
		var canvas = $('#ctt'); 
		var pos = canvas[0].relMouseCoords(touch);
		if (glossaryActive){
			handleGlossary(pos, ev);
			if (checkButton(0.82, 0.86, pos.x, pos.y)){
				glossaryActive = false;
				drawButton("GLOSSARY", 0.82, 0.86, glossaryActive);
				tooltip.hide();
			}
		}else if (settingsPanel.active){
			settingsPanel.checkButtons(pos.x, pos.y);
			//console.log('canvasMouseDown (%d, %d)=%d', pos.x, pos.y, settingsPanel.sliderID);
		}else{
			wheelRotateInfo.id = getWheelIDByXY(pos.x, pos.y);	
			if (wheelRotateInfo.id != -1){
				wheelRotateInfo.startAngle = wheelAngles[wheelRotateInfo.id];
				wheelRotateInfo.userAngle = getTheta(pos.x, pos.y);	
			}else{
				checkButtons(pos.x, pos.y);
				if (glossaryActive || settingsPanel.active) tooltip.hide();
			}
			//console.log('canvasTouchStart (%d, %d)=%d %4.2f', pos.x, pos.y, wheelRotateInfo.id, wheelRotateInfo.startAngle);
		}
  	}
}

function canvasTouchMove(ev){
	ev.preventDefault();
	var canvas = $('#ctt'); 
	//console.log('canvasTouchMove ' + ev.touches.length);
	if (ev.touches.length == 1){
		var touch = ev.touches[0];
		var pos = canvas[0].relMouseCoords(touch);
		mouseMoveHandler(pos, touch);
	}
}

function canvasTouchEnd(ev){
	ev.preventDefault();
	//console.log('canvasTouchEnd');
	wheelRotateInfo.id = -1;
	settingsPanel.sliderID = -1;
	tooltip.hide();
	touchactive = false;
}

function updateWheelColours(){
	for(i in settingsPanel.radios) wheelColours[i] = settingsPanel.radios[i].col;
	localStorage.wheelColours = JSON.stringify(wheelColours);
	initWheels();
}

function checkButtons(mx, my){
	if (!glossaryActive && settingsPanel.available && checkButton(0, 0.86, mx, my)){
		//Settings pressed
		settingsPanel.active = !settingsPanel.active;
		if (settingsPanel.active){
			settingsPanel.draw();
		}else{
			drawTool();
		}
	}else if (checkButton(0.82, 0.86, mx, my)){
		$(this).css("cursor", "pointer");
		glossaryActive = !glossaryActive;
		drawButton("GLOSSARY", 0.82, 0.86, glossaryActive);
	}else{
		$(this).css("cursor", "auto");
	}
}

function checkButton(x, y, mx, my){
	var w = (small) ? parseInt((100/310) * crect.w) : 124;
	var h = (small) ? parseInt((48/310) * crect.w) : 59;
	var size = (small) ? crect.w : 700;
	x *= size;
	y *= size;
	if (small){
		y = parseInt((350/310) * crect.w) - h;
		if (x>parseInt((100/310) * crect.w)) x-=parseInt((45/310) * crect.w);
	}
	return (mx>x && mx<(x+w) && my>y && my<(y+h));
}

CanvasRenderingContext2D.prototype.drawRoundedRect = function(x, y, w, h, corner, fill, stroke){
	this.fillStyle = fill;
	this.strokeStyle = stroke;
	this.beginPath();
	w -= (2 * corner);
	h -= (2 * corner);
	this.arc(x+corner, y+corner, corner, Math.PI, Math.PI * 1.5);
	this.lineTo(x+corner+w, y);
	this.arc(x+corner+w, y+corner, corner, Math.PI * 1.5, Math.PI * 2);
	this.lineTo(x+2*corner+w, y+corner+h);
	this.arc(x+corner+w, y+corner+h, corner, 0, Math.PI * 0.5);
	this.lineTo(x+corner, y+2*corner+h);
	this.arc(x+corner, y+corner+h, corner, Math.PI * 0.5, Math.PI);
	this.lineTo(x, y+corner);				
	if (fill!='') this.fill();
	if (stroke!='') this.stroke();	
}

CanvasRenderingContext2D.prototype.fillTextCircle = function(text,rad, col ,startRotation){
	var centre = (small) ? (crect.w/2) : 350;
	var radius = (small) ? parseInt(centre) * 0.95 : 330;
	
	radius *= rad;
	proportional = false;
	
	if (proportional){
		var totalwidth = this.measureText(text).width;
	}else{
		var numRadsPerLetter = 2*Math.PI / text.length;
		var fettle = numRadsPerLetter * 0.2;
	}
	
	this.fillStyle = col;
	this.save();
	this.translate(centre,centre);
	this.rotate(startRotation);
	
	for(var i=0;i<text.length;i++){
		this.save();
		if (proportional){
			var subwidth = this.measureText(text.substr(0, i)).width;
			var theta = (Math.PI*2) * (subwidth/totalwidth);
			this.rotate(theta);
		}else{
			if (text[i]=="I"){
				this.rotate(i*numRadsPerLetter);// + fettle);
			}else if (text[i]=="W" || text[i]=="M"){
				if (i==0 || text[i-1]==" "){
					this.rotate(i*numRadsPerLetter - fettle);
				}else{
					this.rotate(i*numRadsPerLetter - fettle*0.3);
				}
			}else{
				this.rotate(i*numRadsPerLetter);
			}
		}
		this.fillText(text[i],0,-radius);
		this.restore();
	}
	this.restore();
}

CanvasRenderingContext2D.prototype.drawTriangles = function(col, rad, count, startAngle){
	var centre = (small) ? (crect.w/2) : 350;
	var radius = (small) ? parseInt(centre) * 0.95 : 330;
	var size = (small) ? parseInt((7/310) * crect.w) : 15;
	var w = 0.02/rad;
	
	radius *= rad;
	var theta = 2*Math.PI / count;
	
	this.fillStyle = col;
	
	for(var i=0;i<count;i++){
		this.beginPath();
		this.moveTo(Math.sin(Math.PI*2 - (startAngle + theta * i - w))*radius + centre, Math.cos(Math.PI*2 - (startAngle + theta * i - w))*radius + centre);
		this.lineTo(Math.sin(Math.PI*2 - (startAngle + theta * i + w))*radius + centre, Math.cos(Math.PI*2 - (startAngle + theta * i + w))*radius + centre);
		this.lineTo(Math.sin(Math.PI*2 - (startAngle + theta * i))*(radius-size) + centre, Math.cos(Math.PI*2 - (startAngle + theta * i))*(radius-size) + centre);
		this.closePath();
		this.fill();
	}
	this.restore();	
}

CanvasRenderingContext2D.prototype.drawCircle = function(col, rad, x, y, useStroke){
	useStroke = typeof useStroke != 'undefined' ? useStroke : false;
	
	//console.log('drawCircle %d (%d, %d)', rad, x, y);
	this.fillStyle=col;
	this.beginPath();
	this.arc(x,y,rad,0,Math.PI*2,true);
	this.closePath();
	this.fill();	
	if (useStroke) this.stroke();
}

function drawTool(){
	var centre = (small) ? (crect.w/2) : 350;
	var canvas = $('#ctt');
	var ctx = canvas[0].getContext('2d');
	drawCircle( ctx, '#FFFFFF', 1.01 );	
	for(var i=0; i<5; i++){
		//ctx = wheels[i][0].getContext('2d');
		if (i<4){
			ctx.save();
			ctx.translate(centre, centre);
			ctx.rotate(wheelAngles[i]);
			ctx.drawImage( wheels[i][0], -centre, -centre, canvas[0].width, canvas[0].width ); 
			ctx.restore();
		}else{
			ctx.drawImage( wheels[i][0], 0, 0, canvas[0].width, canvas[0].width ); 
		}
		//if ctx.rotate(wheelAngles[i]);
	}
}

function initWheels(){
	var centre = (small) ? (crect.w/2) : 350;
	var radius = (small) ? parseInt(centre) * 0.95 : 330;
	var size = (small) ? crect.w : 700;

	var ctx = wheels[0][0].getContext('2d');
	ctx.clearRect(0, 0, size, size);
	drawRadialGradient(ctx, wheelColours[0], 1, 5);
	ctx.font = (small) ? "bold " + Math.min(parseInt((9/310) * crect.w), 16) + "px Courier" : "bold 16px Courier";
	ctx.fillTextCircle("   SOCIO-CULTURAL VALUES       TYPE OF ECONOMY          NATIONAL POLICIES     ",0.9,wheelColours[5],initAngles[0]);
	ctx.drawTriangles( wheelColours[5], 1, 3, initAngles[0] + Math.PI/3);	
	
	ctx = wheels[1][0].getContext('2d');
	ctx.clearRect(0, 0, size, size);
	drawRadialGradient(ctx, wheelColours[1], 0.8, 4);
	ctx.font = (small) ? "bold " + Math.min(parseInt((9/310) * crect.w), 16) + "px Courier" : "bold 16px Courier";
	ctx.fillTextCircle("  LEISURE        WORK          MEDIA       EDUCATION      HOUSING      ECONOMIC      HEALTH &     TECHNOLOGY   ",0.70,wheelColours[5],initAngles[1]+4);
	ctx.fillTextCircle("                                                                       STATUS      SOCIAL CARE                ",0.65,wheelColours[5],initAngles[1]+4);
	ctx.drawTriangles( wheelColours[5], 0.8, 8, initAngles[1]);

	ctx = wheels[2][0].getContext('2d');
	ctx.clearRect(0, 0, size, size);
	drawRadialGradient(ctx, wheelColours[2], 0.6, 3);
	ctx.font = (small) ? "bold " + Math.min(parseInt((9/310) * crect.w), 16) + "px Courier" : "bold 16px Courier";
	ctx.fillTextCircle("LOCAL ENVIRONMENTS         SUPPORT NETWORKS      DAILY LIVING ACTIVITIES     ",0.5,wheelColours[5],initAngles[2] + 0.3);
	ctx.drawTriangles( wheelColours[5], 0.6, 3, initAngles[2] + Math.PI/3);
	
	ctx = wheels[3][0].getContext('2d');
	ctx.clearRect(0, 0, size, size);
	drawRadialGradient(ctx, wheelColours[3], 0.4, 2);
	ctx.font = (small) ? "bold " + Math.min(parseInt((9/310) * crect.w), 16) + "px Courier" : "bold 16px Courier";
	ctx.fillTextCircle("THE BODY    IDENTITY    ",0.3,wheelColours[5],initAngles[3] + Math.PI + 0.6);
	ctx.drawTriangles( wheelColours[5], 0.4, 2, initAngles[3]);

	ctx = wheels[4][0].getContext('2d');
	ctx.clearRect(0, 0, size, size);
	drawCircle(ctx, wheelColours[4], 0.2);
	ctx.font = (small) ? "bold " + Math.min(parseInt((9/310) * crect.w), 16) + "px Courier" : "bold 16px Courier";
	ctx.fillTextCircle("PARTICIPATION  ", 0.1, '#FFFFFF', Math.PI + 0.6);	
}

function drawRadialGradient( ctx, col, rad, count ){
	var centre = (small) ? (crect.w/2) : 350;
	var radius = (small) ? parseInt(centre) * 0.95 : 330;
	var size = (small) ? crect.w : 700;
	
	var r = parseInt(col.substr(1, 2), 16);
	var g = parseInt(col.substr(3, 2), 16);
	var b = parseInt(col.substr(5, 2), 16);
	
	var r1 = r + 50;
	var g1 = g + 50;
	var b1 = b + 50;
	var r2 = r - 30;
	var g2 = g - 30;
	var b2 = b - 30;
	
	if (r1>255) r1 = 255;
	if (g1>255) g1 = 255;
	if (b1>255) b1 = 255;
	if (r2<0) r2 = 0;
	if (g2<0) g2 = 0;
	if (b2<0) b2 = 0;
	
	var col1 = setColour(r1, g1, b1);
	var col2 = setColour(r2, g2, b2);
	var col3 = 'rgba(' + r + ',' + g + ',' + b + ',0)';
	
	radius *= rad;
	
	// Create gradients  
	var radgrad = ctx.createRadialGradient(centre,centre,radius/10,centre,centre,radius);  
	var n = 1/count;
	radgrad.addColorStop(1-n, col2);  
	radgrad.addColorStop(1-(n/1.2), col1);  
	radgrad.addColorStop(1-(n/1.4), col1);  
	radgrad.addColorStop(0.99, col);  
	radgrad.addColorStop(1, col3);  
	
	// draw shapes  
	ctx.fillStyle = radgrad;  
	ctx.fillRect(0,0,size,size);  
}

function drawCircle(ctx, col, rad){
	var centre = (small) ? (crect.w/2) : 350;
	var radius = (small) ? parseInt(centre) * 0.95 : 330;
	radius *= rad;
	ctx.fillStyle=col;
	ctx.beginPath();
	ctx.arc(centre,centre,radius,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();	
}

function detectIPadOrientation () {
	var canvas = $('#ctt'); 
	var logo = $('#logoholder');
	crect.x = ($(window).width()-canvas[0].width)/2;
	crect.y = ($(window).height()-canvas[0].height)/2;
	canvas.css('left', crect.x);
	canvas.css('top', crect.y);
	logo.css('left', crect.x);
	logo.css('top', crect.y);
	var help = $('#help');
	//alert(help.width() + ", " + help.height());
	help.css('left', ($(window).width()-help.width())/2);
	help.css('top', ($(window).height()-help.height())/2);
}

function detectIPhoneOrientation () {
	var canvas = $('#ctt'); 
	var logo = $('#logoholder');
	crect.x = ($(window).width()-canvas[0].width)/2;
	crect.y = ($(window).height()-canvas[0].height)/2;
	canvas.css('left', crect.x);
	canvas.css('top', crect.y);
	logo.css('left', crect.x);
	logo.css('top', crect.y - 26);
	var help = $('#help');
	//alert(crect.x + ", " + crect.y);
	help.css('left', ($(window).width()-help.width())/2-10);
	help.css('top', ($(window).height()-help.height())/2);
}

function parseGlossaryXML(xml){
	$(xml).find("wheel").each(function(){
		var wheel = new Array();
		$(this).find("item").each(function(){
			//console.log('glossary %s %s', $(this).attr('name'), $(this).text());
			wheel.push({title:$(this).attr('name'), text:$(this).text()});
		});
		glossary.push(wheel);
	});
	//console.log('parseGlossaryXML %d', glossary.length);
}