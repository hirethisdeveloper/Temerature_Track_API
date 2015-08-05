var mysql           = require("../utils/database"),
    db              = mysql.db;
exports.deviceCheck = function (obj, callback) {
    db.query("select id from thermal_devices where deviceId=?", [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.saveRecord  = function (obj, callback) {
    if (obj.status == "OK") obj.status = 1;
    else obj.status = 0;
    db.query("insert into thermal_data set deviceId=?, temperature=?, humidity=?, dewpoint=?, status=?, dateAdded=now()", [obj.deviceId, obj.temp, obj.hum, obj.dewpoint, obj.status], function (err) {
        if (!err) callback({status: 1});
        else callback({status: 0, error: err});
    });
};
