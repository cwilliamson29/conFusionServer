const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');

const Leaders = require('../models/leaders')

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

/***************LEADERS***************/
leaderRouter.route('/')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Leaders.find({})
                  .then((leaders) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(leaders);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Leaders.create(req.body)
                        .then((leader) => {
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(leader);
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
            res.end('PUT operation not supported on /leaders');
      })
      .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Leaders.remove({})
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

/***************LEADERS ID***************/
leaderRouter.route('/:leaderId')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Leaders.findById(req.params.leaderId)
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
                  Leaders.findByIdAndUpdate(req.params.leaderId, {
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
                  Leaders.findByIdAndRemove(req.params.leaderId)
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

module.exports = leaderRouter;