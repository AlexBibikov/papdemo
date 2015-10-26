var socket = io();

var d = [], graph;

d3.json('/api/history', function (dd) {
    var dx = dd.map(function (x) {
        return { x: x.ts, y: 1.00 * x.value };
    });

    var formatTimeSec = function (d) {
        return new Date(d*1000).toString().match(/\s+(\d+:\d+:\d+)\s+/)[1];
    }
    
    d = [{
            name: "usage",
            data: dx.reverse(),
            xFormatter: formatTimeSec,
            color: '#448888'
        }];

    graph = new Rickshaw.Graph({
        element: document.querySelector("#linechart"),
        width: 690,
        height: 400,
        renderer: 'line',
        series: new Rickshaw.Series.FixedDuration(d, undefined, {
            timeInterval: 1000,
            maxDataPoints: d.length,
            timeBase: new Date().getTime() / 1000
        }) 
    });
    
    graph.render();

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        formatter: function (series, x, y) {
            var dd = new Date(x * 1000);
            var date = '<div class="date">' + dd.toLocaleDateString() + ' ' + dd.toLocaleTimeString() + '</div>';
            var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '">' + series.name+ '</span>';
            var content = swatch + '<span class="values">' + parseInt(y) + ' of ' + 1000 +'</span>' + date;
            return content;
        }
    });
    
    new Rickshaw.Graph.Axis.Time({
        graph: graph
    });
    
    var yaxes = new Rickshaw.Graph.Axis.Y.Scaled({
        element: document.getElementById('Y'),
        graph: graph,
        orientation: 'right',
        scale: d3.scale.linear().domain([0.0, 1.0]),
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT
    });
    
    yaxes.render();

});



socket.on('pool', function (msg) {
    var newVal = { 'usage': 1.0 * msg.value };
    graph.series.addData(newVal);
    graph.render();
});
