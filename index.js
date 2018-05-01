var Bookmark = require('./models/Bookmark');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var createIndex = require('./util/createIndex');

mongoose.connect('mongodb://localhost:27017/bookmarkApp');
var Bookmark = require('./models/Bookmark');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('*', function (req, res, next) {
    res.notFound = function (message = 'error') {
        var object = {
            status: 'failed',
            message: message
        };
        res.json(object);
    }
    res.success = function (data) {
        var object = {
            status: 'success',
            results: data
        };
        res.json(object);
    }
    next();
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/pages/index.html')
})

app.get('/api/bookmark', function (req, res) {
    Bookmark.find({ parent: '1' }, function (err, bookmarks) {
        if (err) res.notFound(err);
        else
            res.json(bookmarks);
    })
});

app.get('/api/bookmark/:index', function (req, res) {
    if (req.params.index) {
        Bookmark.find({ parent: req.params.index }, function (err, bookmarks) {
            if (err) res.notFound(err);
            else
                res.success(bookmarks)
        })
    }
});

app.post('/api/bookmark/:index', function (req, res) {
    Bookmark.findOne({ index: req.params.index }, function (err, bookmark) {
        if (Bookmark) {
            var data = req.body;
            data.index = createIndex();
            data.parent = req.params.index;
            Bookmark.create(req.body, function (err, bookmark) {
                if (err) res.notFound(err);
                else {
                    res.success(bookmark);
                }
            });
        }
    })
});

app.listen(8080, function (err) {
    if (err) console.log(err)
    else
        console.log("success");
})


