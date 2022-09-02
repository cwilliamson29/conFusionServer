const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');

const Promotions = require('../models/promotions')

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

/***************PROMOTIONS***************/
promoRouter.route('/')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Promotions.find({})
                  .then((promos) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(promos);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Promotions.create(req.body)
                        .then((promo) => {
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(promo);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      })
      .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /promotions');
      })
      .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Promotions.remove({})
                        .then((resp) => {
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      });

/***************PROMOS ID***************/
promoRouter.route('/:promoId')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Promotions.findById(req.params.promoId)
                  .then((resp) => {
                        res.StatusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(resp);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /promotions');
      })
      .put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Promotions.findByIdAndUpdate(req.params.promoId, {
                              $set: req.body
                        }, {
                              new: true
                        })
                        .then((resp) => {
                              res.StatusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      })
      .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Promotions.findByIdAndRemove(req.params.promoId)
                        .then((resp) => {
                              res.StatusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      });

module.exports = promoRouter;