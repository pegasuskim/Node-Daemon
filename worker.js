'use strict';
var conf = require('./config.json');

function bail(err, conn) {
    console.log('[%s] Process bail : %s', process.pid, err.stack);
    process.exit(1);
    //if (conn) conn.close(function() { process.exit(1); } );
}

function onConnect() {
    var config = conf.redis;
    var host = config.public.host;
    var port = config.public.port;
    var pass = config.public.pass;
    var redis_subscriber = require('redis').createClient(port, host, {'auth_pass':pass});

    redis_subscriber.on("error", function (err) {
        console.log("Redis Error " + err);
        return bail(err);
    });
    redis_subscriber.debug_mode = true;
    run(redis_subscriber);
}

function run(redis_conn) {
    redis_conn.on("error", function (err) {  
        console.log("Redis Error " + err);
        return bail(err);
    });

}
//
onConnect();
