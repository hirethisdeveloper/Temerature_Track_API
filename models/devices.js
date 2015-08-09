var mysql                    = require("../utils/database"),
    db                       = mysql.db,
    uuid                     = require("node-uuid");
exports.deviceCheck          = function (obj, callback) {
    db.query("select id from thermal_devices where deviceId=?", [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.checkValidUserId     = function (obj, callback) {
    db.query("select id from permission where userId=?", [obj.userId], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.saveRecord           = function (obj, callback) {
    var newId = uuid.v4();
    if (obj.status == "OK") obj.status = 1;
    else obj.status = 0;
    db.query("insert into thermal_data set id=?, deviceId=?, temperature=?, humidity=?, dewpoint=?, status=?, dateAdded=now()", [newId, obj.deviceId, obj.temp, obj.hum, obj.dewpoint, obj.status], function (err) {
        if (!err) callback({status: 1});
        else callback({status: 0, error: err});
    });
};
exports.getRecordsByDeviceId = function (obj, callback) {
    var sql = "select * from thermal_data where deviceId=?";
    if (obj.dateRangeDate) {
        sql += " and dateAdded between '" + obj.dateRangeDate + "' and date_add('" + obj.dateRangeDate +
            "', interval " + obj.dateRangeIntervalNum + " " + obj.dateRangeIntervalNumStr + ")";
    }
    sql += " order by dateAdded asc";
    console.log(sql);
    db.query(sql, [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1, results: results});
        }
        else callback({status: 0, error: err});
    });
};
exports.getDevice            = function (obj, callback) {
    db.query("select * from thermal_devices where deviceId=?", [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.getLocation          = function (obj, callback) {
    db.query("select * from locations where id=?", [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.getDeviceList        = function (callback) {
    db.query("select deviceId,title,locationId,status,description from thermal_devices", [], function (err, results) {
        if (!err) {
            callback({status: 1, results: results});
        }
        else callback({status: 0, error: err});
    });
};exports.getLocations         = function (callback) {
    db.query("select id, title from locations", [], function (err, results) {
        if (!err) {
            callback({status: 1, results: results});
        }
        else callback({status: 0, error: err});
    });
};