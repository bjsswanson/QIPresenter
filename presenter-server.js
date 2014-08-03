var uuid = require('node-uuid');
var _ = require('underscore');

var PRESENTER_SHARED = require('./shared/presenter-shared'); //Ask ID's about this

var PRESENTER = PRESENTER_SHARED || {};

PRESENTER.loadPresentations = function() {
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

PRESENTER.onConnect = function( io ) {
	io.on('connection', function(socket){
		PRESENTER.onAddPresentation(socket);
		PRESENTER.onAddSlide(socket);
		PRESENTER.onViewSlide(socket);
	});
};

PRESENTER.onAddPresentation = function( socket ) {
	socket.on("addPresentation", function( name ) {
		var presentation = PRESENTER.addPresentation( name );
		socket.emit("addedPresentation", presentation);
	})
};

PRESENTER.onAddSlide = function( socket ) {
	socket.on("addSlide", function( id, data ){
		var presentation = PRESENTER.getPresentation( id );
		if(presentation != undefined && presentation.id != undefined) {
			var slide = presentation.addSlide( data );
			socket.emit("addedSlide", slide);
		}
		return new Slide();
	});
};

PRESENTER.onViewSlide = function ( socket ) {
	socket.on("viewSlide", function( data ){
		socket.emit("viewSlide", data);
	})
}

module.exports = function( storage, io ) { //Ask about this too.
	PRESENTER.Storage = storage;
	PRESENTER.loadPresentations();
	PRESENTER.onConnect( io );
	return PRESENTER;
};

