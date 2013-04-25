var http = require('http');

var xbox = function(format) {
	var valid_formats = ['json', 'xml', 'php'];
	if(typeof format != 'undefined' && valid_formats.indexOf(format) > -1) {
		this.format = format;
	} else {
		this.format = 'json';
	}
	return;
}

xbox.prototype.format = 'json';
xbox.prototype.gamertag_regex = /^[a-zA-Z0-9]{1,15}$/;

xbox.prototype.validGamertag = function(gamertag) {
	return this.gamertag_regex.test(gamertag);
}

xbox.prototype.fetchProfile = function(gamertag, callback) {
	if(!this.validGamertag(gamertag)) throw new Error("Invalid Gamertag");
	this.makeRequest('profile', callback);
	return;
}

xbox.prototype.fetchAchievements = function(gamertag, gameid, callback) {
	if(!this.validGamertag(gamertag)) throw new Error("Invalid Gamertag");
	this.makeRequest('achievements', callback);
	return;
}

xbox.prototype.fetchFriends = function(gamertag, callback) {
	if(!this.validGamertag(gamertag)) throw new Error("Invalid Gamertag");
	this.makeRequest('friends', callback);
	return;
}

xbox.prototype.makeRequest = function(request, callback) {
	var options = {
		host: 'www.xboxleaders.com',
		port: 443,
		path: '/api/' + request + '.' + this.format
	};
	var req = http.get(options, function(res) {
		var resData = '';
		res.on('data', function(chunk) {
			resData += chunk;
		});
		res.on('end', function() {
			if(resData.indexOf('404 Not Found') != -1) {
				throw new Error('error returned from steam API');
				return;
			}
			if(resData.indexOf('401 Unauthorized') != -1) {
				throw new Error('invalid API key');
				return;
			}

			if(this.format == 'json') {
				callback(JSON.parse(resData));
			}
		});
	});
	return;
}

module.exports = xbox;
