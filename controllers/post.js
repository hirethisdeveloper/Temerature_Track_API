var db_devices = require("../models/devices.js"),
    db_auth    = require("../models/auth.js"),
    utils      = require("../utils/utils.js"),
    inspect    = require('util').inspect;
// POST - TEMP ROUTE CONTROLLER
exports.postTempController = function (req, res, next) {
    var payload = utils.getQueryParams(req);
    db_devices.saveRecord(payload, function (data) {
        res.send(JSON.stringify(data));
    });
};
exports.saveLocation       = function (req, res, next) {
    db_devices.saveLocation(req.body, function (data) {
        res.send(data);
    })
};
exports.loginController    = function (req, res, next) {
    var opts = req.body;
    console.log(opts, "loginController")
    if (opts.username && opts.password) {
        db_auth.checkAuth(opts, function (data) {
            res.send(data);
        })
    }
    else res.send({status: 0, error: "Invalid username or password"});
}