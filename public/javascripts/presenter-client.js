var PRESENTER = window.PRESENTER || {};
var socket = io.connect(location.origin);

PRESENTER.Control = {};
PRESENTER.Control.isControl = function(){
	return location.href.indexOf('control') > -1;
}

PRESENTER.Control.viewSlides = function() {
	$('.slide').click(function(){
		$(".slide").removeClass("selectedSlide");
		$(this).addClass("selectedSlide");

		var type = $(this).attr('data-type');
		var item = $(this).attr('data-item');

		socket.emit("view", {type: type, item:item});
	});
}

PRESENTER.View = {};

PRESENTER.View.initSocketEvents = function() {
	socket.on("view", function( data ){
		console.log( "data:", data );
		var viewer = $('#viewer');
		if(data.type === 'text') {
			var text = $('<span></span>').text(data.item);
			viewer.html( text )
			viewer.css("background-image", "");
		} else if( data.type === 'image') {
			viewer.html( "" );
			viewer.css("background-image","url(/images/" + data.item + ")");
		} else if( data.type === 'video') {
			viewer.html("<video autoplay controls><source src='/videos/" + data.item + "'></video>");
			viewer.css("background-image", "");
		}
	});

	socket.on("networkIP", function( ip ){
		var viewer = $('#viewer');
		if( ip != undefined ){
			var text = $('<span></span>').html("To control this viewer go to: <br/>" + ip + "/control");
			viewer.html( text )
		} else {
			var text = $('<span></span>').text("Please connect this server to the network.");
			viewer.html( text )
		}
	});
}

$(function() {
	if(PRESENTER.Control.isControl()){
		PRESENTER.Control.viewSlides();
	} else {
		PRESENTER.View.initSocketEvents();
	}
});