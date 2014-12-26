module.exports = function () {
    'use strict';

    var _filterTypes = require('../statics/filterTypes.js')();
    var _utilHelper = require('../statics/utilHelper.js')();
    var _findHelper = require('../statics/findHelper.js')();

    var _priceAttr = '€';

    var filter = function(searchTokens) {

        searchTokens.forEach(function(searchToken, index, array) {
            if (searchToken.filter.type !== _filterTypes.unknown) {
                return;
            }

            var t = removePriceAttribute(searchToken.term);
            var isPrice = t.isPrice;
            var term = t.term;

            // term as currency. Remove it
            if (isPrice && term.length === 0) {
                array.splice(index, 1);
                return;
            }

            if (! _utilHelper.isNumber(term)) {
                return;
            }

            var intTerm = _utilHelper.convertToInt(term);

            // term must be is price due the price attribute
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
        searchToken.filter.term = term;
        searchToken.filter.value = intTerm;
    };

    var removePriceAttribute = function (term) {
        var index = term.indexOf(_priceAttr);
        if (index > -1) {
            term = term.replace(_priceAttr, '');
        }

        return {
            isPrice : (index > -1),
            term: term
        };
    };

    return filter;
};