var mysql         = require("../utils/database"),
    db            = mysql.db,
    uuid          = require("node-uuid"),
    bcrypt        = require("bcrypt-nodejs");
exports.checkAuth = function (opts, callback) {
    var pwString    = opts.username + opts.password + db.salt;
    var invalidAuth = function () {
        callback({status: 0, error: "Invalid username or password"});
    }
    db.query("select id,password from accounts where username=?", [opts.username], function (accerr, results) {
        if (!accerr) {
            if (results[0]) {
                var isAuth = bcrypt.compareSync(pwString, results[0].password);
                if (isAuth) {
                    var newuid = uuid.v4();
                    db.query("update accounts set sessionId=? where id=?", [newuid, results[0].id], function (sessionerr) {
                        if (!sessionerr) callback({status: 1, userId: results[0].id, sessionId: newuid});
                        else callback({status: 0, error: sessionerr});
                    })
                }
                else invalidAuth();
            }
            else invalidAuth();
        }
        else callback({status: 0, error: accerr});
    });
};

exports.logout = function(opts, callback) {
    db.query("update accounts set sessionId='' where sessionId=?", [opts.sessionId], function(err) {
        if (!err) callback({status: 1});
        else callback({status: 0, error: err});
    } )
};
exports.logoutByUsername = function(opts, callback) {
    db.query("update accounts set sessionId='' where username=?", [opts.username], function(err) {
        callback();
    } )
};