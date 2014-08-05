(function(module){
	PRESENTER = {};
	PRESENTER.Presentations = [];

	PRESENTER.getPresentation = function( id ) {
		var presentations = PRESENTER.Presentations;
		for(index = 0; index < presentations.length; index++) {
			var presentation = presentations[index];
			if(presentation.id === id) {
				return presentation;
			}
		}
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

		addSlide: function( data ) {
			var id = this.slides.length;
			var slide = new Slide({id: id, type: data.type, url: data.url});
			this.slides.push(slide);
			return slide;
		},

		getSlide: function ( id ) {
			for(index = 0; index < this.slides.length; index++) {
				if(this.slides[index].id === id){
					return this.slides[index];
				}
			}
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





