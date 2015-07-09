'use strict';
var Providers = require('../providers');
var conf = require('../config.json');

//module.exports = pushHandler;
var pushHandler = exports;
var self = pushHandler;


exports.getConfig = function() {
	var config = conf.notification;
	var setting = { "host":config.mqtt.host,
	                "port":config.mqtt.port
	              }
	return setting;
};


pushHandler.createProvider = function (pushType) {

	var self = this;
    var configData = self.getConfig();

	var Provider = Providers[pushType];

	if(!Provider ) { console.log("Provider Create Error! "); return null; }

	var provider = new Provider(configData);

	provider.on('devicesGone', function(deviceTokens) {
		// TODO deviceGone
	});

	provider.on('error', function(err) {
		console.log("provider.on Error " + err);
		self.emit('error', err);
	});
	return provider;
};





/*
pushHandler.getProvider = function (pushType, pushSettings) {
	var self = this;
	var Provider = Providers[pushType];

	if( !Provider ) { return null; }

	var provider = new Provider(pushSettings[pushType]);

	provider.on('devicesGone', function(deviceTokens) {
		// TODO deviceGone
	});

	provider.on('error', function(err) {
		self.emit('error', err);
	});

	return provider;
};



pushHandler.notify = function(installation, notification, cb) {
	if( !(_.isObject(installation) && notification) ) { return cb(new Error('bad arguments'), null);}

	var appId = installation.applicationId;
	var deviceToken = installation.deviceToken;
	var pushType = installation.pushType || this.deviceTypeToPusthType[installation.deviceType];

	this.getApplication(
		appId,
		pushType,
		function( error, provider ) {
			if ( error ) { return cb(error); }
			if ( !provider ) { return cb(error); }

			provider.pushNotification(notification, deviceToken, appId);
			cb();
		}
	);
};
*/