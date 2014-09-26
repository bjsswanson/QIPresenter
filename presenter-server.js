var PRESENTER = PRESENTER || {};

var path = require('path');
var _ = require('underscore');
var fs = require('fs');
var os = require('os');

PRESENTER.loadPresentations = function() {
	var images = fs.readdirSync(path.join(__dirname, '/files/images'));
	var videos = fs.readdirSync(path.join(__dirname, '/files/videos'));
	var text = fs.readFileSync(path.join(__dirname, '/files/text.txt'), "utf8");

	PRESENTER.Files = {
		images: images,
		videos: videos,
		text: text.split("\n")
	};
}

PRESENTER.onConnect = function( io ) {
	io.on('connection', function( socket ){
		PRESENTER.onView( socket, io );
		PRESENTER.emitNetworkIP( socket );
	});
};

PRESENTER.getNetworkIP = function () {
	var address;
	var interfaces = os.networkInterfaces();
	for (var dev in interfaces) {
		var alias = 0;
		interfaces[dev].forEach(function(details){
            if (details.family == 'IPv4' && details.address != "127.0.0.1") {
                address =  details.address + ":" + PRESENTER.Server.address().port;
			}
        });
	}

	return address;
};

PRESENTER.onView = function( socket, io ) {
	socket.on("view", function( data ){
		if(data != undefined) {
			io.emit("view", data);
		}
	});
};

PRESENTER.emitNetworkIP = function( socket ) {
	var networkIP = PRESENTER.getNetworkIP();
	socket.emit("networkIP", networkIP);
};


module.exports = function( io, server ) { //Ask about this too.
	PRESENTER.Server = server;
	PRESENTER.loadPresentations();
	PRESENTER.onConnect( io );
	return PRESENTER;
};

