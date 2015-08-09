var app                         = module.parent.exports.app,
    getCtrl                     = require("./controllers/get.js"),
    postCtrl                    = require("./controllers/post.js"),
    utils                       = require("./utils/utils.js"),
    db_devices                  = require("./models/devices.js"),
    inspect                     = require('util').inspect;
var middleware_post_deviceCheck = function (req, res, next) {
    var payload = utils.getQueryParams(req);
    if (payload.deviceId) {
        db_devices.deviceCheck({id: payload.deviceId}, function (data) {
            if (data.status == 1) {
                if (data.results.id > 0) {
                    next();
                }
                else {
                    console.log("middleware: device not found - " + payload.deviceId);
                    res.send({status: 0, error: "Device not found"});
                }
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
        db_devices.deviceCheck({id: deviceId}, function (data) {
            if (data.status == 1) {
                if (data.results) {
                    if (data.results.id > 0) {
                        next();
                    }
                }
                else {
                    console.log("middleware: device not found - " + deviceId);
                    res.send({status: 0, error: "Device not found"});
                }
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
    var userId = req.headers.userid;
    if (userId) {
        db_devices.checkValidUserId({userId: userId}, function (data) {
            if (data.status == 1) {
                if (data.results) {
                    if (data.results.id > 0) {
                        next();
                    }
                    else {
                        console.log("middleware: user not found - " + userId);
                        res.send({status: 0, error: "user not found"});
                    }
                }
                else res.send({status: 0, error: "user not found"})
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
    app.use('/device/:id', middleware_permissionCheck, middleware_get_deviceCheck);
    app.use('/device/:id/data', middleware_permissionCheck, middleware_get_deviceCheck);
    app.use('/temp', middleware_post_deviceCheck);
    // GETS ====================================================
    app.get('/', getCtrl.index);
    app.get('/device/:id', getCtrl.getDevice);
    app.get('/device/:id/data', getCtrl.getRecordsByDeviceId);
    app.get('/location/:id', getCtrl.getLocation);
    app.get('/locations', getCtrl.getLocations);
    // POSTS ====================================================
    app.post('/temp', postCtrl.postTempController);
}
else {
    console.error("There was an error initializing the application.");
    process.exit(0);
}