var city;

module.exports = function (file) {
    'use strict';
    if (city) {
        return city;
    }

    var _utilHelper = require('../statics/utilHelper')();
    var path = require('path');
    var fs = require('fs');
    var f = file || path.join(__dirname, '../data/city.json');

    try {
        var t = fs.readFileSync(f, 'utf8');
        city = JSON.parse(t);

        return city;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};