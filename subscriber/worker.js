'use strict';
var conf = require('./config.json');
var pushHandler = require('./handlers/push_handler.js');

function bail(err, conn) {
    console.log('[%s] Process bail : %s', process.pid, err.stack);
    process.exit(1);
    //if (conn) conn.close(function() { process.exit(1); } );
}

function onConnect() {
    var config = conf.redis;
    //var namespace   =  conf.namespace
    var host = config.public.host;
    var port = config.public.port;
    var pass = config.public.pass;
    var channel = config.public.pub_channel;
    var redis_subscriber = require('redis').createClient(port, host, {'auth_pass':pass});

    redis_subscriber.on("error", function (err) {
        console.log("Redis Error " + err);
        return bail(err);
    });
    redis_subscriber.debug_mode = true;
    console.log("push channel registration -> " + channel);
    redis_subscriber.subscribe(channel);
    run(redis_subscriber);
}

function run(redis_conn) {
    redis_conn.on("error", function (err) {  
        console.log("Redis Error " + err);
        return bail(err);
    });

    redis_conn.on("message", function(channel, message) {
        if(channel == 'push'){
            redis_conn.emit('notiData', message);
            console.log("Message " + message);
            //console.log("Message '" + message + "' on channel '" + channel + "' arrived!");
            var notiData =  JSON.parse(message);
            var provider = pushHandler.createProvider(notiData.noti_type);
            provider.pushNotification(notiData.msg, notiData.device_id, notiData.app_id);
        }
    });
}
//
onConnect();
