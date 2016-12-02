function authenticateUser(user, password, db, fn) {
	db.collection("opNewsUsers").findOne({user: user, password: password}, function(err, user) {
		if (err) {
			return fn(err);
		}

		if (user) {
			return fn(null, user);

		}
		else {
			return fn(null, null);
		}
	});
}

function restrictUser(req, res, db, fn) {
	db.collection("opNewsUsers").findOne({user: req.session.user}, function(err, result) {
		if (result) {
			if (result.user == req.session.user && result.password == req.session.password) {
				ret = true;
			}
			else {
				ret = false;
			}

			return fn(ret);
		}
		else {
			return fn(false);
		}
	});

	return fn(false);
}

exports.authenticate = authenticateUser;
exports.restrict = restrictUser;
