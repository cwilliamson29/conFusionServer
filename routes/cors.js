const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'http://zedd2006:3001', 'http://desktop-k13jpfp:3001'];
var corsOptionsDelegate = (req, callback) => {
      var corsOptions;

      if (whitelist.indexOf(req.header('Origin')) !== -1) {
            corsOptions = { origin: true };
      } else {
            corsOptions = { origin: false };
      }
      callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);