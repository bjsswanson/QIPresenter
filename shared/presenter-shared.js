(function(module){
	PRESENTER = {};
	PRESENTER.Presentations = [];

	PRESENTER.getPresentation = function( id ) {
		var presentations = PRESENTER.Presentations;

		for(index = 0; index < presentations.length; index++) {
			if(presentations[index].id === id) {
				return presentation;
			}
		}

		return new PRESENTER.Presentation();
	}

	PRESENTER.Presentation = function ( obj ) {
		this.id = obj.id || "";
		this.name = obj.name || "";
		this.slides = [];
		if(obj.slides != undefined){
			for(index = 0; index < obj.slides.length; index++) {
				this.addSlide(new PRESENTER.Slide(obj.slides[index]));
			}
		}
	};

	PRESENTER.Presentation.prototype = {
		constructor: PRESENTER.Presentation,

		addSlide: function( slide ){
			this.slides.push(slide);
			return this;
		}
	};

	PRESENTER.Slide = function( obj ) {
		this.id = obj.id || "";
		this.type = obj.type || "";
		this.url = obj.url || "";
	};

	PRESENTER.Slide.prototype = {
		constructor: PRESENTER.Presentation,

		set: function( id, type, url){
			this.id = id;
			this.type = type;
			this.url = url;

			return this;
		}
	};

	module.exports = PRESENTER;

})(typeof module === 'undefined'? this['PRESENTER']={}: module);





