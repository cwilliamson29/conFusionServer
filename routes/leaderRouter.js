const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')

const Leaders = require('../models/leaders')

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

/***************LEADERS***************/
leaderRouter.route('/')
      .get((req, res, next) => {
            Leaders.find({})
                  .then((leaders) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(leaders);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(authenticate.verifyAdmin, (req, res, next) => {
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
      .put(authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /leaders');
      })
      .delete(authenticate.verifyAdmin, (req, res, next) => {
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
      .get((req, res, next) => {
            Leaders.findById(req.params.leaderId)
                  .then((resp) => {
                        res.StatusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(resp);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /promotions');
      })
      .put(authenticate.verifyAdmin, (req, res, next) => {
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
      .delete(authenticate.verifyAdmin, (req, res, next) => {
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