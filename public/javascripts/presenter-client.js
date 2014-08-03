var PRESENTER = window.PRESENTER || {};

PRESENTER.bindButtons = function() {
	$('#addPresentation').click(function(){


		return false;
	})
}

$(function() {
	PRESENTER.bindButtons();
});