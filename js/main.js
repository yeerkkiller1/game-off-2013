﻿define(function (require) {
	var ko = require("knockout");
	var PerfChart = require("perf/PerfChart");
	var $ = require("jquery");
	var addBindings = require("customBindings");
	
	var Game = require("Game");

	var Firebase = require("Firebase");
	var db = new Firebase('https://r4zlxbwki99.firebaseio-demo.com/devGame');
	db.set("Testing");

	function resize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		var x = w > h ? (w - h) / 2 : 0;
		var y = w > h ? 0 : (h - w) / 2;
		var mwh = Math.min(w, h);
		
		$('#gameboard').css('width', mwh).css('height', mwh)
			.css('top', y).css('left', x);
	}
	return function main() {
		$(window).on('resize', resize);
		resize();

		$('#loadingScreen').fadeOut(500, 'swing', function () {$(this).remove()});

		var game = new Game(db);

		var chart = new PerfChart();
		$('.perfChart')[0].appendChild(chart.elm);

		var worldTime = new Date().getTime();
		(function GameLoop() {
			self.requestAnimationFrame(GameLoop);

			// TODO: Cap frame time...
			// TODO: Fixed timesteps
			var newTime = new Date().getTime();
			var tickTime = newTime - worldTime;
			worldTime = newTime;

			tickTime = Math.min(tickTime, 350);

			chart.addDataPoint(tickTime);

			game.tick(tickTime);
		})();
	}
});
