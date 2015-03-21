'use strict';
module.exports = function () {
    var _filterTypes = require('../statics/filterTypes').filterTypes;
    var _findHelper = require('../statics/findHelper')();
    var _modelLines = require('../services/modelLineService')();

    var filter = function (searchTokens) {
        var ctx = {
            fncServiceCondition: filterModelBasedOnMake
        };

        var res = _findHelper.matchTokens(searchTokens, _modelLines, _filterTypes.modelLine, ctx); // find modelLine with an existing make
        if (! ctx.found)
            res = _findHelper.matchTokens(searchTokens, _modelLines, _filterTypes.modelLine); // find just modelLine

        return res;
    };

    var filterModelBasedOnMake = function (service, unknownSearchToken, searchTokens) {
        var unknownIndex = unknownSearchToken.index;

        // is in the search line a make before the [possible] model ?
        var makeId = 0;
        searchTokens.some(function(searchToken) {
            var found = (searchToken.filter.type === _filterTypes.make && unknownIndex > searchToken.index);
            if (found) {
                makeId = searchToken.filter.value;
            }
        });

        if (makeId > 0) {
            return service.filter(function(serviceToken) {
                return (serviceToken.value.makeId == makeId);
            });
        }
        return [];
    };

    return filter;
};