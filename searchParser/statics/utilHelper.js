module.exports = function () {
    'use strict';

    var _filterTypes = require('./filterTypes.js')();

    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    var convertToInt = function (term) {
        return parseInt(term);
    };

    function isUnknownFilter(token) {
        return token.filter.type === _filterTypes.unknown;
    }

    var compareTermFilter = function(tokenLeft, tokenRight) {
        if (isUnknownFilter(tokenRight)) {
            return false;
        }

        return tokenLeft.filter.type === tokenRight.filter.type &&
            (tokenLeft.filter.value) &&
            tokenLeft.filter.value === tokenRight.filter.value;
    };

    var mergeTermFilter = function(tokenLeft, tokenRight) {
        tokenLeft.term = tokenLeft.term + ' ' +  tokenRight.term;
    };

    var compareRangeFilter = function(tokenLeft, tokenRight) {
        if (isUnknownFilter(tokenRight)) {
            return false;
        }

        return tokenLeft.filter.type === tokenRight.filter.type &&
            (tokenLeft.filter.valueFrom) &&
            (tokenRight.filter.valueFrom) &&
            !(tokenLeft.filter.valueTo) &&
            !(tokenRight.filter.valueTo);
    };

    var mergeRangeFilter = function(tokenLeft, tokenRight) {
        if (tokenLeft.filter.valueFrom <= tokenRight.filter.valueFrom) {
            tokenLeft.term = tokenLeft.term + ' - ' +  tokenRight.term;

            tokenLeft.filter.valueTo = tokenRight.filter.valueFrom;
            tokenLeft.filter.termTo = tokenRight.filter.termFrom;
        }
        else {
            tokenLeft.term = tokenRight.term + ' - ' +  tokenLeft.term;

            tokenLeft.filter.valueTo = tokenLeft.filter.valueFrom;
            tokenLeft.filter.termTo = tokenLeft.filter.termFrom;
            tokenLeft.filter.valueFrom = tokenRight.filter.valueFrom;
            tokenLeft.filter.termFrom = tokenRight.filter.termFrom;
        }
    };

    var reduceIdenticalFilters = function (searchTokens, fncCompare, fncMerge) {
        var t = searchTokens.reduce(function (accumulator, searchToken, index, array) {
            // are there already accumulated items identical with the current one
            var merged = accumulator.some(function (accToken, index, array) {
                var isIdentical = fncCompare(accToken, searchToken);
                if (isIdentical) {
                    fncMerge(accToken, searchToken);
                }
                return isIdentical;
            });

            if (merged) {
                return accumulator;
            }

            accumulator.push(searchToken);
            return accumulator;
        }, []);

        return t;
    };

    return {
        isNumber : isNumber,
        convertToInt : convertToInt,
        compareTermFilter : compareTermFilter,
        mergeTermFilter : mergeTermFilter,
        compareRangeFilter: compareRangeFilter,
        mergeRangeFilter : mergeRangeFilter,
        reduceIdenticalFilters : reduceIdenticalFilters
    };
};
