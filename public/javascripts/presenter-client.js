var PRESENTER = window.PRESENTER || {};
var socket = io.connect('http://localhost');

PRESENTER.Present = {};
PRESENTER.Present.clearDialogs = function() {
	$('#apName').val('');
	$('#apDialog').trigger('close');

	$('#dpButton')
		.attr('data-id', '')
		.attr('data-name', '');
	$('#dpName').val('');
	$('#dpDialog').trigger('close');
};

PRESENTER.Present.createAddDialog = function() {
	$('#apOpen').click(function( e ) {
		e.preventDefault();
		$('#apDialog').lightbox_me({
	        centered: true,
	        onLoad: function() {
	            $('#apDialog').find('input:first').focus()
            }
        });
	});

	$('#apDialog form').submit(function( e ) {
		e.preventDefault();
		var pName = $('#apName').val();
		if ($.trim(pName)) {
			socket.emit('addPresentation', pName);
			PRESENTER.Present.clearDialogs();
		} else {

		}
	});

	$('#apClose').click(function( e ) {
		e.preventDefault();
		$('#apDialog').trigger('close');
	});
};

PRESENTER.Present.createDeleteDialog = function() {
	$('td .delete').click(function( e ) {
		e.preventDefault();

		var id = $(this).attr('data-id');
		var name = $(this).attr('data-name');
		var dialog = $('#dpDialog');
		dialog.lightbox_me({
	        centered: true,
	        onLoad: function() {
		        dialog.find('input:first').focus();
		        $('#dpButton')
			        .attr('data-id', id)
		            .attr('data-name', name);
		        $('#enterDName').text(name);
            }
        });
	});

	$('#dpClose').click(function( e ) {
		e.preventDefault();
		$('#dpDialog').trigger('close');
	});

	$('#dpDialog form').submit(function( e ) {
		e.preventDefault();
		var pName = $('#dpName').val();
		var dataId = $('#dpButton').attr('data-id');
		var dataName = $('#dpButton').attr('data-name');
		if (pName === dataName) {
			socket.emit('deletePresentation', dataId);
			PRESENTER.Present.clearDialogs();
		} else {

		}
	});
}

PRESENTER.Present.initSocketEvents = function() {
	socket.on('addedPresentation', function( presentation ){
		var pHtml = $.get("/templates/presentation.html", function( data ){
			var pData = $(data);

			pData.attr('id', presentation.id);

			pData.find('td.name').text(presentation.name);
			pData.find('td .control').attr('href', '/' + presentation.id + '/control');
			pData.find('td .view').attr('href', '/' + presentation.id + '/view');

			pData
				.find('td .delete')
				.attr('data-id', presentation.id)
				.attr('data-name', presentation.name)
				.click(function( e ){
					e.preventDefault();
					$('#dpDialog').lightbox_me({
				        centered: true,
				        onLoad: function() {
				            $('#dpDialog').find('input:first').focus();
					        $('#dpButton')
					            .attr('data-id', presentation.id)
		                        .attr('data-name', presentation.name);
					        $('#enterDName').text(presentation.name);
			            }
			        });
				})
			$('#pList').append( pData );
		});
	});

	socket.on('deletedPresentation', function( presentation ){
		var id = presentation.id;
		$('#' + id).remove();
	});
}

PRESENTER.Control = {};
PRESENTER.Control.clearDialogs = function() {
	$('#asDialog').trigger('close');
	$('#dsDialog').trigger('close');
}

PRESENTER.Control.createAddDialog = function() {
	$('#asOpen').click(function( e ) {
		e.preventDefault();
		$('#asDialog').lightbox_me({
	        centered: true,
	        onLoad: function() {
	            $('#asDialog').find('input:first').focus()
            }
        });
	});

	$('#asDialog form').submit(function( e ) {
		e.preventDefault();
		var pid = $('#presentation').attr('data-id');
		var type = $('#asType').val();
		var data = $('#asData').val();
		var title = "";

		socket.emit('addSlide', {pid: pid, type: type, data: data, title: title});
		PRESENTER.Control.clearDialogs();
	});

	$('#asClose').click(function( e ) {
		e.preventDefault();
		$('#asDialog').trigger('close');
	});
}

PRESENTER.Control.viewSlides = function() {
	$('.slide').click(function(){
		var pid = $('#presentation').attr('data-id');
		var sid = this.attr('data-id');
		socket.emit("viewSlide", {pid: pid, sid: sid});
	});
}

$(function() {
	PRESENTER.Present.createAddDialog();
	PRESENTER.Present.createDeleteDialog();
	PRESENTER.Present.initSocketEvents();

	PRESENTER.Control.createAddDialog();
});