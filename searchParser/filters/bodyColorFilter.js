module.exports = function () {
    'use strict';

    var _filterTypes = require('../statics/filterTypes.js').filterTypes;
    var _findHelper = require('../statics/findHelper.js')();
    var _bodyColor  = require('../services/bodyColorService.js')();

    var filter = function (searchTokens) {
        return _findHelper.searchTokens(searchTokens, _bodyColor, _filterTypes.bodyColor);
    };

    return filter;
};