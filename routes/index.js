var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Bethovzart Home' });
});
router.get('/songslibrary', function (req, res) {
    res.render('songsLibrary', { title: 'Bethovzart Library' });
});
router.post('/songslibrary', upload.single('musicFile'), function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    res.render('songsLibrary', { title: 'Bethovzart Library' });
});
module.exports = router;
//# sourceMappingURL=index.js.map