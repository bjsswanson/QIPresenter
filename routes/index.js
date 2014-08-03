var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Presenter', presentations: GLOBAL.PRESENTER.Presentations });
});

router.get('/:id/view', function(req, res) {
	var id = req.param("id");
	var presentation = PRESENTER.getPresentation(id);
	res.render('view', { title: 'Control', presentation: presentation});
});

router.get('/:id/control', function(req, res) {
	var presentation = PRESENTER.getPresentation(id);
	res.render('control', { title: 'Viewer', presentation: presentation});
});

module.exports = router;
