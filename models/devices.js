var mysql                             = require("../utils/database"),
    db                                = mysql.db,
    uuid                              = require("node-uuid");
exports.deviceCheck                   = function (obj, callback) {
    db.query("select count(id) from thermal_devices where id=?", [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1});
        }
        else callback({status: 0, error: err});
    });
};
exports.checkValidUserId              = function (obj, callback) {
    db.query("select id from permission where userId=?", [obj.userId], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.saveRecord                    = function (obj, callback) {
    var newId = uuid.v4();
    if (obj.status == "OK") obj.status = 1;
    else obj.status = 0;
    db.query("insert into thermal_data set id=?, deviceId=?, temperature=?, humidity=?, dewpoint=?, status=?, dateAdded=now()", [newId, obj.deviceId, obj.temp, obj.hum, obj.dewpoint, obj.status], function (err) {
        if (!err) callback({status: 1});
        else callback({status: 0, error: err});
    });
};
exports.getRecordsByDeviceId          = function (obj, callback) {
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
exports.getRecordsByDeviceIdAvgByDate = function (obj, callback) {
    var sqlArr  = [];
    var inserts = [obj.id];
    for (var i = 0, o = 23; i < o; i++) {
        var nextNum = i + 1;
        var endDate = "'" + obj.date + " " + nextNum + ":00:00'";
        var sql     = ""
        if (obj.date == "curdate()") {
            if (nextNum > 23) {
                endDate = "date_add(concat(curdate(), ' 23:00:00', interval 1 hour)";
            }
            else {
                endDate = "concat(curdate(), ' " + nextNum + ":00:00')";
            }
            sql = "(select avg(temperature) from thermal_data where deviceId=? and dateAdded between concat(curdate(), ' " + i + ":00:00') and " + endDate + ") as 'record-" + i + "'";
            sql = db.format(sql, inserts);
            sqlArr.push(sql);
        }
        else {
            if (nextNum > 23) {
                endDate = "date_add('" + obj.date + " 23:00:00', interval 1 hour)";
            }
            sql = "(select avg(temperature) from thermal_data where deviceId=? and dateAdded between concat('" + obj.date + ", ' " + i + ":00:00') and " + endDate + ") as 'record-" + i + "'";
            sql = db.format(sql, inserts);
            sqlArr.push(sql);
        }
    }
    var sqlstr = "select " + sqlArr.join(",");
    console.log(sqlstr);
    db.query(sqlstr, function (err, results) {
        if (!err) {
            callback({status: 1, results: results});
        }
        else callback({status: 0, error: err});
    });
};
exports.getDevice                     = function (obj, callback) {
    db.query("select * from thermal_devices where id=?", [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.getLocation                   = function (obj, callback) {
    db.query("select * from locations where id=?", [obj.id], function (err, results) {
        if (!err) {
            callback({status: 1, results: results[0]});
        }
        else callback({status: 0, error: err});
    });
};
exports.getDeviceList                 = function (locationId, callback) {
    var sql = "";
    if ( locationId == "all" ) {
        sql = "select id,title,locationId,status,description from thermal_devices order by title asc";
    }
    else {
        var inserts = [locationId];
        sql = "select id,title,locationId,status,description from thermal_devices where locationId=?"
        sql = db.format(sql, inserts);
    }
    db.query(sql, function (err, results) {
        if (!err) {
            callback({status: 1, results: results});
        }
        else callback({status: 0, error: err});
    });
};
exports.getLocations                  = function (callback) {
    db.query("select id, title from locations", [], function (err, results) {
        if (!err) {
            callback({status: 1, results: results});
        }
        else callback({status: 0, error: err});
    });
};
exports.saveLocation                  = function (obj, callback) {
    var inserts = [],
        sql     = "";
    if (obj.id == "add") {
        var newId = uuid.v4();
        inserts   = [newId, obj.title, obj.address1, obj.address2, obj.city, obj.state, obj.zip, obj.contactId];
        sql       = "insert into locations set id=?, title=?, address1=?, address2=?, city=?, state=?, zip=?, contactId=?";
    }
    else {
        inserts   = [obj.title, obj.address1, obj.address2, obj.city, obj.state, obj.zip, obj.contactId, obj.id];
        sql     = "update locations set title=?, address1=?, address2=?, city=?, state=?, zip=?, contactId=? where id=?";
    }
    sql = db.format(sql, inserts);
    db.query(sql, function (err) {
        if (!err) callback({status: 1});
        else callback({status: 0, error: err});
    })
};