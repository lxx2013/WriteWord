var canvasWidth = 800,
	canvasHeight = canvasWidth;
var ctx, canvas;
var PI = Math.PI;
var isMouseDown = false;
var lastLoc = {
		x: 0,
		y: 0
	},
	curLoc,llastLoc;
var lastTime;
var lastLineWidth = -1;
var strokeStyle = 'black';
$(document).ready(function () {
	canvas = $('Canvas')[0];
	ctx = canvas.getContext('2d');
	canvasWidth = Math.min(800, $(window).width() - 20);
	canvasHeight = canvasWidth;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	drawRice();
	//shipei
	$('footer').css('width', canvasWidth);
	$('.color_button').css({
		'width': '9%'
	});
	$('.color_button').css({
		'height': $('.color_button').css('width')
	});
	$('#clear').css({
		width: '18%',
		height: canvasWidth * 0.09
	});
	//阻止默认行为
	canvas.onmousedown = function (e) {
		e.preventDefault();
		beginStroke(e);
	}
	canvas.onmouseup = function (e) {
		e.preventDefault();
		endStroke();
	}
	canvas.onmouseout = function (e) {
		e.preventDefault();
		endStroke();
	}
	canvas.onmousemove = function (e) {
		e.preventDefault();
		moveStroke(e);
	}
	canvas.addEventListener('touchstart',function(e){
		e.preventDefault();
		var t = e.touches[0];
		beginStroke({clientX:t.pageX,clientY:t.pageY});
	});
	canvas.addEventListener('touchend',function(e){
		e.preventDefault();
		endStroke();
	});
	canvas.addEventListener('touchmove',function(e){
		e.preventDefault();
		var t = e.touches[0];
		moveStroke({clientX:t.pageX,clientY:t.pageY});
	});
	$('.color_button').click(function () {
		strokeStyle = $(this).css('background-color');
		$('.color_button').removeClass('color_button_selected');
		$(this).addClass('color_button_selected');
	});
	$('#clear').click(function () {
		//alert(Math.max.apply(null,Vlist)+","+Math.min.apply(null,Vlist));
		$(this).fadeOut(50).fadeIn(50);
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		drawRice();
	})
});

function beginStroke(e) {
	isMouseDown = true;
	lastLoc = windowToCanvas(e.clientX, e.clientY);
	llastLoc = lastLoc;
	lastTime = new Date().getTime();
}
function endStroke(){
	isMouseDown = false;
}
function moveStroke(e){
	if (isMouseDown) {
		//calculate
		curLoc = windowToCanvas(e.clientX, e.clientY);
		var s = Distance(lastLoc, curLoc);
		var curTime = new Date().getTime();
		
		//draw
		ctx.beginPath();
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lastLineWidth;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.moveTo(llastLoc.x, llastLoc.y);
		var ctrPoint = calcCtrPoint();
		ctx.quadraticCurveTo(ctrPoint.x,ctrPoint.y,curLoc.x, curLoc.y);
		ctx.stroke();
		
		//update
		calcLineWidth(curTime - lastTime, s);
		llastLoc = lastLoc;
		lastLoc = curLoc;
		lastTime = curTime;
	}
}
//var Vlist = new Array();
function calcCtrPoint(){
	var x = -llastLoc.x/2+2*lastLoc.x-curLoc.x/2;
	var y = -llastLoc.y/2+2*lastLoc.y-curLoc.y/2;
	return {x:x,y:y};
}
function calcLineWidth(t, s) {
	var v = s / t;
	//Vlist.push(v);
	var lw;

	if (v < 0.1)
		lw = 30;
	else
		lw = Math.ceil(20 / (v + 0.9) + 10);
	if (lastLineWidth == -1){
		lastLineWidth = lw;
	}
	else {
		lastLineWidth = lastLineWidth * 2 / 3 + lw / 3;
	}
	return lastLineWidth;
}

function drawRice() {
	ctx.strokeStyle = 'rgb(230,11,9)';
	ctx.beginPath();
	ctx.lineWidth = 6;
	ctx.strokeRect(3, 3, canvasWidth - 6, canvasHeight - 6);
	ctx.lineWidth = 1;
	ctx.save();
	ctx.translate(canvasWidth / 2, canvasHeight / 2);
	for (var i = 0; i < canvasWidth / 2; i += 30) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i + 20, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(-i, 0);
		ctx.lineTo(-i - 20, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(0, i + 20);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -i);
		ctx.lineTo(0, -i - 20);
		ctx.stroke();
	}
	ctx.restore();
	ctx.save();
	ctx.translate(canvasWidth / 2, canvasHeight / 2);
	ctx.rotate(PI / 4);
	for (var i = 0; i < canvasWidth / 2 * Math.pow(2, 1 / 2); i += 30) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i + 20, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(-i, 0);
		ctx.lineTo(-i - 20, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(0, i + 20);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -i);
		ctx.lineTo(0, -i - 20);
		ctx.stroke();
	}
	ctx.restore();
}

function Distance(ll, cl) {
	return Math.sqrt((ll.x - cl.x) * (ll.x - cl.x) + (ll.y - cl.y) * (ll.y - cl.y));
}

function windowToCanvas(x, y) {
	var cc = canvas.getBoundingClientRect();
	return {
		x: Math.round(x - cc.left),
		y: Math.round(y - cc.top)
	};
}
