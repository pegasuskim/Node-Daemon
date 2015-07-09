var mqtt = require('mqtt');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

module.exports = MqttProvider;

function MqttProvider( pushSetting ) {
	var self = this;
	self._initPushConnection(pushSetting);
};

inherits(MqttProvider, EventEmitter);

MqttProvider.prototype._initPushConnection = function( settings ) {
	
	var self = this;
    var options = { qos:2, retain: true };
	var port = settings.port;
	var host = settings.host;
	//var reconnectPeriod = 100;
	this.connection = mqtt.createClient( port, host, options );
	this.connection.on('error', function(err) {
		console.log("mqtt connection Error " + err);
		self.emit('error', err);
	});
};


MqttProvider.prototype.pushNotification = function( notification, deviceToken, appId ) {
	var connection = this.connection;
	connection.publish(  appId+'/'+deviceToken , JSON.stringify(notification) );
	console.log("pushNotification DATA:  " + appId+'/'+deviceToken , JSON.stringify(notification) );
};


MqttProvider.prototype._createMessage = function( notification ) {
	var message = {};
	
	return message;
};