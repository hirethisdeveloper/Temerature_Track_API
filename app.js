var express        = require('express'),
    app            = express(),
    server         = app.listen(7076, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Server listening at http://%s:%s', host, port);
    });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports.app = app;
routes             = require("./routes.js");