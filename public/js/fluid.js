var socket = io();

var config1 = liquidFillGaugeDefaultSettings();
config1.waveCount = 1.3;
config1.waveHeight = 0.03;
config1.circleColor = "#229999";//"#55dddd";
config1.textColor = "#006666";
config1.waveTextColor = "#229999";
config1.waveColor = function(d){ 
  if(d < 60) return "#aaeeee";
  if(d < 80) return "#dddd88";
  return "#ff5555";
}
config1.circleThickness = 0.1;
config1.textVertPosition = 0.5;
config1.waveAnimateTime = 1000;
var gauge2 = loadLiquidFillGauge("gauge", 28, config1);

socket.on('pool', function (msg) {
    var newVal = Math.round(100 * msg.value / msg.total) || 0;
    if (newVal) {
        gauge2.update(newVal);
    }
});
