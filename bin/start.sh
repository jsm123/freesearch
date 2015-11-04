#!/usr/bin/env bash

pushd freesearchUI
npm install
popd

pushd searchParser
npm install
npm test
popd


cd freesearchUI
mkdir -p logs
touch logs/searchLine.log
node --harmony server.js
