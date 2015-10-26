var express = require('express');
var router = express.Router();

var io, socket;

const POOL_CAPACITY = 1000;
const HISTORY_DEPTH = 100;
const VOLATILITY = 20;
const INTERVAL = 1;

function addRandom() {
    var newVal = pool.pick();
    newVal += Math.round(Math.random() * VOLATILITY - VOLATILITY / 2);
    newVal = Math.max(newVal, 0);
    newVal = Math.min(newVal, POOL_CAPACITY);
    pool.push(newVal);
    //console.log(newVal);
}

function Pool(){
    this.pool = Array.apply(null, Array(HISTORY_DEPTH)).map(Number.prototype.valueOf, 0);
    this.shift = 0;
    this.assign(POOL_CAPACITY / 2);
};

Pool.prototype.pick = function() {
    return this.pool[this.shift];
}

Pool.prototype.push = function(x) {
    this.shift = (this.shift + 1) % HISTORY_DEPTH;
    this.assign(x);
    io.emit('pool', { "value": x, "total": POOL_CAPACITY });
}

Pool.prototype.assign = function (x) {
    this.pool[this.shift] = x;
}

Pool.prototype.history = function () {
    var now = Math.round(Date.now() / 1000);
    var aa1 = this.pool.slice(this.shift + 1);
    var aa2 = this.pool.slice(0, this.shift + 1);
    var aa = aa1.concat(aa2);
    return aa.reverse().map(function (x, i) {
        return {
            "ts": now - i,
            "value": x
        }
    });
}


var pool = new Pool();

router.get('/', function (req, res) {
    res.json({ "status": "OK" });
});

router.get('/usage', function (req, res) {
    res.json([pool.pick(), POOL_CAPACITY]);
});

router.post('/usage', function (req, res) {
    var x = req.body.usage || 0;
    pool.assign(10*x);
    res.json(["OK"]);
});

router.get('/history', function (req, res) {
    res.json(pool.history());
});

setInterval(addRandom, INTERVAL * 1000);

router.setIO = function (io_) {
    io = io_;
    io.sockets.on('connection', function (socket_) {
        socket = socket_;
        console.log('web socket connected');
        socket.on('disconnect', function () {
            socket = undefined;
            console.log('web socket disconnected');
        });
    });
}

module.exports = router;
