var express        = require('express'),
    app            = express(),
    server         = app.listen(7076, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Server listening at http://%s:%s', host, port);
    });
module.exports.app = app;
routes             = require("./routes.js");