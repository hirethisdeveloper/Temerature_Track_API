var app                    = module.parent.exports.app,
    getCtrl                = require("./controllers/get.js"),
    postCtrl               = require("./controllers/post.js"),
    utils                  = require("./utils/utils.js"),
    db_devices             = require("./models/devices.js"),
    inspect                = require('util').inspect;
var middleware_deviceCheck = function (req, res, next) {
    var payload = utils.getRequestBody(req);
    if (payload.deviceId) {
        db_devices.deviceCheck({id: payload.deviceId}, function (data) {
            if (data.status == 1) {
                if (data.results.id > 0) {
                    next();
                }
                else {
                    console.log("middleware: device not found - " + payload.deviceId);
                    res.send(JSON.stringify({status: 0, error: "Device not found"}));
                }
            }
            else {
                console.log(data);
                res.send(JSON.stringify(data));
            }
        });
    }
    else res.send(JSON.stringify({status: 0, error: "Invalid communication configuration"}));
};
if (app) {
// APP MIDDLEWARE - anything touching /temp needs to check first if the deviceId passed to it is valid
    app.use('/temp', middleware_deviceCheck);
// GET - index
    app.get('/', getCtrl.index);
// POST - temp
    app.post('/temp', postCtrl.postTempController);
}