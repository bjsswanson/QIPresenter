var uuid = require('node-uuid');
var socket = require('socket.io'); //How to share socket around application
var _ = require('underscore');

var PRESENTER_SHARED = require('./shared/presenter-shared'); //Ask ID's about this

var PRESENTER = PRESENTER_SHARED || {};

PRESENTER.loadPresentations = function() {
	PRESENTER.Storage.values(function(data){
		_.each(data, function(presentation){
			PRESENTER.Presentations.push(new PRESENTER.Presentation(presentation))
		});
	});

	console.log(PRESENTER.Presentations);
}

PRESENTER.addPresentation = function( name ) {
	var id = uuid.v4();
	var presentation = new PRESENTER.Presentation({"id": id, "name": name });
	var presentations = PRESENTER.Presentations;

	presentations.push(presentation);
	PRESENTER.Storage.setItem(id, presentation);

	return presentation;
};

PRESENTER.onConnect = function( socket ) {
	PRESENTER.onAddPresentation(socket);
};

PRESENTER.onAddPresentation = function( socket ) {
	socket.on("addPresentation", function( name ) {
		var presentation = PRESENTER.addPresentation( name );
		socket.emit("addPresentation", presentation);
	})
};

PRESENTER.onAddSlide = function( socket ) {
	socket.on("addSlide", function( id, data ){
		var presentation = PRESENTER.getPresentation( id );
		if(presentation != undefined) {
			presentation.addSlide( data );
		}
	});
};

module.exports = function( storage ) { //Ask about this too.
	PRESENTER.Storage = storage;
	PRESENTER.loadPresentations();
	PRESENTER.addPresentation("test");
	return PRESENTER;
};

