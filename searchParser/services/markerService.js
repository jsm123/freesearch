module.exports = function () {
    'use strict';

    // term is a reference to synonym object property, which contains all possible values
    return {
        price: [{term: 'Euro', value: 'euro'}],
        range: [{term: 'From', value: 'from'}, {term: 'To', value: 'to'}],
        power: [{term: 'Kw', value: 'kw'}, {term: 'Ps', value: 'ps'}],
        km: [{term: 'Km', value: ''}],
        firstRegistration: [{term: 'FirstRegistration', value: ''}],
        seat: [{term: 'Seat', value: ''}],
        door: [{term: 'Door', value: ''}],
        prevOwner: [{term: 'PrevOwner', value: ''}],
        onlineSince: [
            {term: 'OnlineSince', value: 'onlinesince'},
            {term: 'Day', value: 'day'},
            {term: 'Week', value: 'week'},
            {term: 'Yesterday', value: 'yesterday'},
            {term: 'DayBeforeYesterday', value: 'daybeforeyesterday'}
        ]
    };
};