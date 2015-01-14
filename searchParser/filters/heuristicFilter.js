module.exports = function () {
    'use strict';

    var _filterTypes = require('../statics/filterTypes.js')();
    var _filterHelper = require('../statics/filterHelper.js')();

    var _priceFilter = require('../filters/priceFilter.js')();
    var _powerFilter = require('../filters/powerFilter.js')();
    var _mileageFilter = require('../filters/mileageFilter.js')();
    var _firstRegistration = require('../filters/firstRegistrationFilter.js')();

    var filter = function (searchTokens) {
        return searchTokens.reduce(function (accumulator, searchToken) {
            if (searchToken.filter.type === _filterTypes.priceMarker) {
                accumulator = _filterHelper.iterateBackward(
                    accumulator,
                    collectCondition(searchToken.index),
                    assignFilter(_priceFilter.assignFilter, {
                        hasMarker: true
                    }));
            }

            if (searchToken.filter.type === _filterTypes.powerMarker) {
                accumulator = _filterHelper.iterateBackward(
                    accumulator,
                    collectCondition(searchToken.index),
                    assignFilter(_powerFilter.assignFilter, {
                        hasMarker: true,
                        powerType: searchToken.filter.value
                    }));
            }

            if (searchToken.filter.type === _filterTypes.kmMarker) {
                accumulator = _filterHelper.iterateBackward(
                    accumulator,
                    collectCondition(searchToken.index),
                    assignFilter(_mileageFilter.assignFilter, {
                        hasMarker: true
                    }));
            }

            if (searchToken.filter.type === _filterTypes.firstRegistrationMarker) {
                var context = {};

                accumulator = _filterHelper.iterateBackward(
                    accumulator,
                    collectCondition(searchToken.index),
                    assignFilter(_firstRegistration.assignFilter, context));

                if (!context.found) {
                    accumulator = _filterHelper.iterateForward(
                        accumulator,
                        collectCondition(searchToken.index),
                        assignFilter(_firstRegistration.assignFilter, context));
                }
            }

            return accumulator;

        }, searchTokens);
    };

    var assignFilter = function (assignFnc, context) {
        return function (searchToken) {
            return assignFnc(searchToken, context);
        };
    };

    var collectCondition = function (fromIndex) {
        var curDeep = 0;
        var maxDeep = 2;
        var isNext = false;

        // iterate from fromIndex up to maxDeep
        return function(searchToken) {
            if (searchToken.index === fromIndex) {
                isNext = true;
                return false;
            }

            if (!isNext) {
                return false;
            }

            if (_filterHelper.isMarkerFilter(searchToken.filter)) {
                return false;
            }

            if (_filterHelper.isRangeMarker(searchToken.filter)) {
                return false;
            }

            if (! _filterHelper.isUnknownFilter(searchToken.filter)) {
                return false;
            }

            curDeep++;
            return maxDeep >= curDeep;
        };
    };

    return filter;
};