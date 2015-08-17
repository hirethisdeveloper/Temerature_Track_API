require('pmx').init();

var db_devices = require("../models/devices.js"),
    utils      = require("../utils/utils.js"),
    inspect    = require('util').inspect;
// GET - INDEX ROUTE CONTROLLER
exports.index                = function (req, res) {
    var json    = {"app": "Temerature_Track_API", "version": "0.0.1"},
        jsonStr = JSON.stringify(json);
    console.log(jsonStr);
    res.send(jsonStr);
};
exports.getRecordsByDeviceId = function (req, res) {
    var sqlVars     = {};
    var id          = req.params.id;
    sqlVars.id      = id;
    var queryParams = utils.getQueryParams(req);
    if (queryParams.dateRangeDate) sqlVars.dateRangeDate = queryParams.dateRangeDate;
    if (queryParams.dateRangeIntervalNum) sqlVars.dateRangeIntervalNum = queryParams.dateRangeIntervalNum;
    if (queryParams.dateRangeIntervalNumStr) sqlVars.dateRangeIntervalNumStr = queryParams.dateRangeIntervalNumStr;
    db_devices.getRecordsByDeviceId(sqlVars, function (data) {
        res.send(data);
    });
};
exports.getDevice            = function (req, res) {
    var id = req.params.id;
    db_devices.getDevice({id: id}, function (data) {
        res.send(data);
    });
};
exports.getLocation          = function (req, res) {
    var id = req.params.id;
    db_devices.getLocation({id: id}, function (data) {
        res.send(data);
    });
};
exports.getLocations         = function (req, res) {
    var id = req.params.id;
    db_devices.getLocations(function (data) {
        res.send(data);
    });
};
exports.getDeviceList         = function (req, res) {
    var locationId = req.params.id;
    db_devices.getDeviceList(locationId, function (data) {
        res.send(data);
    });
};