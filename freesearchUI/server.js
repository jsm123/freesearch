'use strict';
let koa = require('koa');
let serve = require('koa-static')
let marko = require('marko');
let router = require('koa-router');
let json = require('koa-json');
let querystring = require('querystring');
let path  = require('path');

let app = koa();

app.use(serve(path.join(__dirname, 'public')));
app.use(router(app));
app.use(json());

app.get('/', function *() {
    this.body = marko.load('./views/index.marko').stream();
    this.type = 'text/html';
});

app.get('/api/autocomplete', function *() {
    this.status = 200;
    this.type = 'application/json';
    this.body = [{ label: 'bar' }, { label: 'bbb' }];
});

app.get('/api/parse', function *() {
    var q = querystring.parse(this.request.querystring);

    this.type = 'application/json';
    if (q.s) {
        this.body = getParserResults(q.s);
        this.status = 200;
    } else {
        this.body = 'an error occurred';
        this.status = 500;
    }
});

app.listen(3000);

let _ctx = {
    infra: true,
    saveSearchLineToFile: path.join(__dirname,'logs', 'searchLine.log')
};

let _filters = require('../searchParser/registerFilters')(_ctx);
let _parser = require('../searchParser/parser')(_filters);
let isMarkerFilter =  require('../searchParser/statics/filterTypes').isMarkerFilter;
let isRangeMarker =  require('../searchParser/statics/filterTypes').isRangeMarker;

var getParserResults = function(searchLine) {
    let searchTokens = _parser.parse(searchLine);

    searchTokens = searchTokens.filter(function(searchToken) {
        if (isMarkerFilter(searchToken.filter) || isRangeMarker(searchToken.filter) ) {
            return false;
        }
        return true;
    });

    var listQuery = 'http://fahrzeuge.autoscout24.de/?' + _ctx.publicQueryParams;

    return {
        searchTokens: searchTokens,
        listQuery: listQuery,
        counter: _ctx.counter
    };
};