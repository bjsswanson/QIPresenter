var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Viewer', data: PRESENTER.Files });
});

router.get('/control', function(req, res) {
	res.render('control', { title: 'Control', data: PRESENTER.Files });
});

module.exports = router;
