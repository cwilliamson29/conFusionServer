const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

/***************PROMOTIONS***************/
promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((req, res, next) => {
        res.end('will send all  promo')
    })
    .post((req, res, next) => {
        res.end('will send all promo: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        res.end('delete all promo')
    });

/***************PROMOS ID***************/
promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((req, res, next) => {
        res.end('will send PROMO ID ' + req.params.promoId + '\n')
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions');
    })
    .put((req, res, next) => {
        res.write('will update PROMO ID ' + req.params.promoId + '\n');
        res.end('will update PROMO ID ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('delete PROMO ID ' + req.params.promoId + '\n')
    });

module.exports = promoRouter;
