var pmx                         = require('pmx');
var app                         = module.parent.exports.app,
    getCtrl                     = require("./controllers/get.js"),
    postCtrl                    = require("./controllers/post.js"),
    utils                       = require("./utils/utils.js"),
    db_devices                  = require("./models/devices.js"),
    bodyParser                  = require('body-parser'),
    inspect                     = require('util').inspect,
    jsonParser                  = bodyParser.json();
var middleware_post_deviceCheck = function (req, res, next) {
    var payload = utils.getQueryParams(req);
    if (payload.deviceId) {
        db_devices.deviceCheck(payload.deviceId, function (data) {
            if (data.status == 1) {
                next();
            }
            else {
                console.log(data);
                res.send(data);
            }
        });
    }
    else res.send({status: 0, error: "Invalid communication configuration"});
};
var middleware_get_deviceCheck  = function (req, res, next) {
    var deviceId = req.params.id;
    if (deviceId) {
        db_devices.deviceCheck(deviceId, function (data) {
            if (data.status == 1) {
                next();
            }
            else {
                console.log(data);
                res.send(data);
            }
        });
    }
    else res.send({status: 0, error: "Invalid communication configuration"});
};
var middleware_permissionCheck  = function (req, res, next) {
    var sessionId = req.headers.sessionid;
    if (sessionId) {
        db_devices.checkValidSessionId({sessionId: sessionId}, function (data) {
            if (data.status == 1) {
                if (data.results) {
                    if (data.results.id > 0) {
                        next();
                    }
                    else {
                        console.log("middleware: session not found - " + sessionId);
                        res.send({status: 0, error: "session not found"});
                    }
                }
                else res.send({status: 0, error: "session not found"})
            }
            else {
                console.log(data);
                res.send(data);
            }
        });
    }
    else res.send({status: 0, error: "Invalid user"});
};
if (app) {
    // MIDDLEWARE ====================================================
    app.use(pmx.expressErrorHandler());
    app.use('/locations', middleware_permissionCheck);
    app.use('/location/:id', middleware_permissionCheck);
    app.use('/devices/:id', middleware_permissionCheck);
    app.use('/device/:id', middleware_permissionCheck, middleware_get_deviceCheck);
    app.use('/device/:id/avg_by_date', middleware_permissionCheck, middleware_get_deviceCheck);
    app.use('/device/:id/data', middleware_permissionCheck, middleware_get_deviceCheck);
    app.use('/temp', middleware_post_deviceCheck);
    // GETS ====================================================
    app.get('/', getCtrl.index);
    app.get('/locations', getCtrl.getLocations);
    app.get('/location/:id', getCtrl.getLocation);
    app.get('/devices/:id', getCtrl.getDeviceList);
    app.get('/device/:id', getCtrl.getDevice);
    app.get('/device/:id/avg_by_date', getCtrl.getRecordsByDeviceIdAvgByDate);
    app.get('/device/:id/data', getCtrl.getRecordsByDeviceId);
    // POSTS ====================================================
    app.post('/login', jsonParser, postCtrl.loginController);
    app.post('/temp', postCtrl.postTempController);
    app.post('/location/:id', jsonParser, postCtrl.saveLocation);
}
else {
    console.error("There was an error initializing the application.");
    process.exit(0);
}