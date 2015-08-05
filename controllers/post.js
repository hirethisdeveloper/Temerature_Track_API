var db_devices = require("../models/devices.js"),
    utils      = require("../utils/utils.js"),
    inspect    = require('util').inspect;
// POST - TEMP ROUTE CONTROLLER
exports.postTempController = function (req, res, next) {
    var payload = utils.getRequestBody(req);
    db_devices.saveRecord(payload, function (data) {
        res.send(JSON.stringify(data));
    });
};