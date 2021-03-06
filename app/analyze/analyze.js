var trading_params = require('../../config.js').trading_params;
var Chart = require('../chart/chart.js');
var Authenticate = require('../authenticate/authenticate.js');
var talib = require('talib');
var async = require('async');

module.exports = class Analyze {

	constructor() {
		this.chart = new Chart();
		this.credential = new Authenticate();
	}

	macd_calculate(symbol, time_interval, cb) {
		var self = this;
		self.credential.get_token(function(flag, body) {
			self.chart.get_chart(body.token, symbol, time_interval, '50', function(flag, body) {
				var marketData = body.data;
				self._macd_calculate(marketData, time_interval, function(flag, result) {
					if(flag) {
						cb(true, result);
					}else{
						cb(false, {error: result.error});
					}
				})
			});
		});
	}

	rsi_calculate(symbol, time_interval, cb) {
		var self = this;
		self.credential.get_token(function(flag, body) {
			self.chart.get_chart(body.token, symbol, time_interval, '50', function(flag, body) {
				var marketData = body.data;
				self._rsi_calculate(marketData, time_interval, function(flag, result) {
					if(flag) {
						cb(true, result);
					}else{
						cb(false, {error: result.error});
					}
				})
			});
		});
	}
	
	_macd_calculate(marketData, timeInterval, cb) {
        talib.execute({
            name: "MACD",
            startIdx: 0,
            endIdx: marketData.close.length - 1,
            inReal: marketData.close,
            optInFastPeriod: 12,
            optInSlowPeriod: 26,
            optInSignalPeriod: 9
        }, function(error, result) {
        	if(error) {
        		cb(false, {error: 'MACD caculation error!'});
        	}else{
        		result.timeInterval = timeInterval;
        		cb(true, {MACD: result});
        	}
        });
	}

	_rsi_calculate(marketData, timeInterval, cb) {
        talib.execute({
            name: "RSI",
            startIdx: 0,
            endIdx: marketData.close.length - 1,
            inReal: marketData.close,
            optInTimePeriod: 14
        }, function(error, result) {
        	if(error) {
        		cb(false, {error: 'RSI calculation error!'});
        	}else{
        		result.timeInterval = timeInterval;
        		cb(true, {RSI: result});
        	}
            
        });
	}

}