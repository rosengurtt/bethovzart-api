var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Bethovzart Home' });
});

/* GET Library page. */
router.get('/songslibrary', function (req, res) {
    res.render('songsLibrary', { title: 'Bethovzart Library' });
});


router.post('/songslibrary', upload.single('musicFile'), function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    // var musicStyle = req.body.musicStyle, musician = req.body.musician, songName = req.body.songName;
    // console.log(musicStyle);
    // console.log(musician);
    // console.log(songName);
    res.render('songsLibrary', { title: 'Bethovzart Library' });
})
module.exports = router;
