var express = require('express'),
    router = express.Router();

router.use(express.static('../public'));

router.get('/', function(req, res) {
    res.sendFile('/index.html');
});

module.exports = router;
