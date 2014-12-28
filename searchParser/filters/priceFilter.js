module.exports = function () {
    'use strict';

    var _filterTypes = require('../statics/filterTypes.js')();
    var _utilHelper = require('../statics/utilHelper.js')();
    var _findHelper = require('../statics/findHelper.js')();

    var _priceMarker = '€';

    var filter = function(searchTokens) {

        searchTokens.forEach(function(searchToken, index, array) {
            if (searchToken.filter.type !== _filterTypes.unknown) {
                return;
            }

            var tuple = removePriceMarker(searchToken.term);
            var isPrice = tuple.isPrice;
            var term = tuple.term;

            // term as currency. Remove it
            if (isPrice && term.length === 0) {
                array.splice(index, 1);
                return;
            }

            if (! _utilHelper.isNumber(term)) {
                return;
            }

            var intTerm = _utilHelper.convertToInt(term);

            // term must be is price due the price marker
            if (isPrice) {
                assignFilter(searchToken, term, intTerm);
                return;
            }

            if (! _findHelper.isInSuitableRange(intTerm,  _filterTypes.price)) {
                return;
            }

            assignFilter(searchToken, term, intTerm);
        });

        return searchTokens;
    };

    var assignFilter = function (searchToken, term, intTerm) {
        searchToken.filter.type = _filterTypes.price;
        searchToken.filter.termFrom = term;
        searchToken.filter.valueFrom = intTerm;
    };

    var removePriceMarker = function (term) {
        var index = term.indexOf(_priceMarker);
        if (index > -1) {
            term = term.replace(_priceMarker, '');
        }

        return {
            isPrice : (index > -1),
            term: term
        };
    };

    return filter;
};