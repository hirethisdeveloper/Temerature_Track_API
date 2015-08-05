var db_temp = require("../models/devices.js"),
    utils   = require("../utils/utils.js"),
    inspect = require('util').inspect;
// GET - INDEX ROUTE CONTROLLER
exports.index = function (req, res) {
    var json    = {"app": "Temerature_Track_API", "version": "0.0.1"},
        jsonStr = JSON.stringify(json);
    console.log(jsonStr);
    res.send(jsonStr);
};