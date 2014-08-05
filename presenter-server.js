var uuid = require('node-uuid');
var _ = require('underscore');
var request = require('request');

var PRESENTER_SHARED = require('./shared/presenter-shared'); //Unnecessary, move into this file.

var PRESENTER = PRESENTER_SHARED || {};

PRESENTER.loadPresentations = function() {
	PRESENTER.Presentations = [];
	PRESENTER.Storage.values(function(data){
		_.each(data, function(presentation){
			PRESENTER.Presentations.push(new PRESENTER.Presentation(presentation))
		});
	});
}

PRESENTER.addPresentation = function( name ) {
	var id = uuid.v4();
	var presentation = new PRESENTER.Presentation({"id": id, "name": name });
	var presentations = PRESENTER.Presentations;

	presentations.push(presentation);
	PRESENTER.Storage.setItem(id, presentation);

	return presentation;
};

PRESENTER.deletePresentation = function( id ) {
	var presentations = PRESENTER.Presentations;
	for(var i = 0; i < presentations.length; i++) {
		var presentation = presentations[i];
		if(id === presentation.id){
			presentations.splice(presentation, 1);
			PRESENTER.Storage.removeItem(id);
			return presentation;
		}
	}
};

PRESENTER.addSlide = function( data ) {
	var pid = data.pid;
	var presentation = PRESENTER.getPresentation( pid );
	if(presentation != undefined && presentation.id != undefined) {
		data.id = uuid.v4();

		if(data.type === 'youtube'){
			request('http://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=nbeiq1FP3Eg&format=json', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var yData = JSON.parse(body);
					data.title = yData.title;
					var slide = presentation.addSlide(data);
					PRESENTER.Storage.setItem(pid, presentation);
			    }
			});
		} else {
			var slide = presentation.addSlide(data);
			PRESENTER.Storage.setItem(pid, presentation);
		}

		return slide;
	}
}

PRESENTER.onConnect = function( io ) {
	io.on('connection', function( socket ){
		PRESENTER.onAddPresentation( socket );
		PRESENTER.onDeletePresentation( socket );
		PRESENTER.onAddSlide( socket );
		PRESENTER.onViewSlide( socket );
	});
};

PRESENTER.onAddPresentation = function( socket ) {
	socket.on("addPresentation", function( name ) {
		var presentation = PRESENTER.addPresentation( name );
		socket.emit("addedPresentation", presentation);
	})
};

PRESENTER.onDeletePresentation = function( socket ) {
	socket.on("deletePresentation", function( id ) {
		var presentation = PRESENTER.deletePresentation( id );
		socket.emit("deletedPresentation", presentation);
	})
};

PRESENTER.onAddSlide = function( socket ) {
	socket.on("addSlide", function( data ){
		var slide = PRESENTER.addSlide( data );
		if(slide != undefined) {
			socket.emit("addedSlide", slide);
		}
	});
};

PRESENTER.onViewSlide = function ( socket ) {
	socket.on("viewSlide", function( data ){
		var presentation = PRESENTER.getPresentation(data.pid);
		var slide = presentation.getSlide(data.sid);
		socket.emit("viewSlide", slide);
	})
}

module.exports = function( storage, io ) { //Ask about this too.
	PRESENTER.Storage = storage;
	PRESENTER.loadPresentations();
	PRESENTER.onConnect( io );
	return PRESENTER;
};

