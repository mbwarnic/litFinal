var auth = require("./authenticate.js");

function loginUser(req, res, db) {
    auth.authenticate(req.query.user, req.query.password, db, function(err, user) {
        if (user) {
            if (new Date().getTime() - req.session.lastLogin > 24 * 60 * 60 * 1000) {
                req.session.regenerate(function() {
                    req.session.user = user.user;
                    req.session.password = user.password;
                    req.session.lastLogin = new Date().getTime();
                    res.send("1");
                });
            }
            else {
                req.session.user = user.user;
                req.session.password = user.password;
                req.session.lastLogin = new Date().getTime();
                res.send("1");
            }
        }
        else {
            res.send("0");
        }
    });
}

function addUser(req, res, db) {
    var info = req.query;

    db.collection("opNewsUsers").findOne({user: info.user}, function(err, result) {
        if (!result) {
            db.collection("opNewsUsers").insert(info, function (err, result) {
                if (result) {
                    res.send("1");
                }
                else {
                    res.send("0");
                }
            });
        }
        else {
            res.send("0");
        }
    });
}

function getUser(req, res, db) {
    auth.restrict(req, res, db, function(ret) {
        if (ret) {
            var info = req.query;
            
            db.collection("opNewsUsers").findOne({ user: info.user }, function (err, result) {
                if (result) {
                    var output = JSON.stringify(result);
                    res.write(output);
                    res.end();
                }
            });
        }
        else {
            res.send("noauth");
            res.end();
        }
    });
}


function changePassword(req, res, db) {
    auth.restrict(req, res, db, function(ret) {
        if (ret) {
            var info = req.query;

            db.collection("opNewsUsers").update({ user: info.user, userType: userType, password: info.oldPassword }, { "$set": { password: info.newPassword } }, function (err) {
                if (!err) {
                    res.send("1");
                }
                else {
                    res.send("0");
                }		
            });
        }
        else {
            res.send("noauth");
        }
    });
}

function editUser(req, res, db) {
    auth.restrict(req, res, db, function(ret) {
        if (ret) {
            db.collection("opNewsUsers").findOne({ user: info.user }, function (err, result) {
                if (result) {
                    var temp = Object.keys(info);
                                           
                    for (var t = 0; t <  temp.length; t++) {
                        key = temp[t];
                        result[key] = info[key];                                  
                    }
                    
                    db.collection("opNewsUsers").save(result, function (err) {
                        if (!err) {
                            res.send("1");
                        }
                        else {
                            res.send("0");
                        }
                    });
                }
                else {
                    res.send(0);
                }
            });
        }
        else {
            res.send("noauth");
            res.end();
        }
    });
}

exports.add = addUser;
exports.get = getUser;
exports.changePassword = changePassword;
exports.edit = editUser;
exports.login = loginUser;
